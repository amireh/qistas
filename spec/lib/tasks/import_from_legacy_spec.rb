require 'rake'

describe 'import_from_legacy rake task' do
  let :path do
    Rails.root.join('tmp', 'legacy_import_fixture.json')
  end

  let :blacklist_path do
    Rails.root.join('tmp', 'legacy_import_fixture_blacklist.json')
  end

  let :task do
    Rake::Task["pibi:import_from_legacy"]
  end

  def run(data = {}, blacklist={})
    h = data.values.each_with_object({}) do |v, h| h.merge!(v) end
    File.write(path, h.to_json)
    File.write(blacklist_path, blacklist.to_json)
    task.reenable
    task.invoke(path, blacklist_path)
  end

  before :all do
    Rake::Task.define_task(:environment)
    Rake.application.rake_require "tasks/pibi/import-from-legacy"
  end

  after do
    FileUtils.rm(path) if File.exists?(path)
  end

  it 'should import users' do
    run({
      'users' => json_fixture('import_from_legacy_users.json')
    })

    User.count.should == 2
  end

  it 'should not import blacklisted items' do
    run({
      users: {
        users: [{
          id: 10
        }]
      }
    }, { users: [ 10 ]})

    User.count.should == 0
  end

  it 'should import accounts' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json')
    })

    Account.count.should == 2

    account1 = Account.find(1)
    account1.user.should == User.find(1)
    account1.label.should == 'Pocket'
    account1.balance.should == 0

    account2 = Account.find(2)
    account2.user.should == User.find(2)
    account2.label.should == 'Pocket'
    account2.balance.should == 0
  end

  it 'should import categories' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'categories' => json_fixture('import_from_legacy_categories.json')
    })

    User.find(1).categories.count.should == 3
    User.find(2).categories.count.should == 7

    object = Category.find(103269)
    object.name.should == 'Bank Fees'
    object.icon.should == 'bank'
  end

  it 'should import payment methods' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'payment_methods' => json_fixture('import_from_legacy_payment_methods.json')
    })

    User.find(1).payment_methods.count.should == 2
    User.find(2).payment_methods.count.should == 4

    object = PaymentMethod.find(1)
    object.name.should == 'Cash'
    object.color.should == '99CC00'
    object.default.should == true
  end

  it 'should import recurrings' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json'),
      'recurrings' => json_fixture('import_from_legacy_recurrings.json')
    })

    Recurring.count.should == 5
    rtx = Recurring.find(25447)
    rtx.amount.should == 0.999E1
    rtx.name.should == 'Dropbox'
    rtx.created_at.should == DateTime.new(2013, 10, 18, 14, 32, 37)
    rtx.account_id.should == 1
    rtx.flow_type.to_sym.should == :negative
    rtx.frequency.to_sym.should == :monthly
    rtx.committed_at.should == DateTime.new(2013, 11, 18)
    rtx.active.should be_true
    rtx.every.should == 1
    rtx.weekly_days.should == []
    rtx.monthly_days.should == [18]
    rtx.yearly_months.should == []
    rtx.yearly_day.should == nil
    rtx.payment_method.should == nil
  end

  it 'should import recurrings and connect payment methods' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json'),
      'payment_methods' => json_fixture('import_from_legacy_payment_methods.json'),
      'recurrings' => json_fixture('import_from_legacy_recurrings.json')
    })

    Recurring.count.should == 5
    rtx = Recurring.find(25447)
    rtx.payment_method.should == PaymentMethod.find(3)
  end

  it 'should import transactions' do
    data = json_fixture('import_from_legacy_transactions.json')
    data.reject! { |r| r['type'] == 'Recurring' }

    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json'),
      'transactions' => data
    })

    Expense.count.should == 5
    tx = Expense.find(2998)
    tx.amount.should == 0.89E2
    tx.note.should == 'rgx.io'
    tx.created_at.should == DateTime.new(2013, 07, 14, 12, 50, 23)
    tx.occurred_on.should == DateTime.new(2014, 07, 11)
    tx.account_id.should == 1
    tx.currency.should == 'USD'
    tx.currency_rate.should == 0.71E0
    tx.recurring.should be_nil
    tx.payment_method.should be_nil
  end

  it 'should import transactions and connect recurrings' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json'),
      'recurrings' => json_fixture('import_from_legacy_recurrings.json'),
      'transactions' => json_fixture('import_from_legacy_transactions.json')
    })

    Expense.count.should == 5
    tx = Expense.find(2998)
    tx.amount.should == 0.89E2
    tx.note.should == 'rgx.io'
    tx.created_at.should == DateTime.new(2013, 07, 14, 12, 50, 23)
    tx.occurred_on.should == DateTime.new(2014, 07, 11)
    tx.account_id.should == 1
    tx.currency.should == 'USD'
    tx.currency_rate.should == 0.71E0
    tx.recurring.should == Recurring.find(25447)
    tx.payment_method.should be_nil
  end

  it 'should import transactions and connect payment methods' do
    data = json_fixture('import_from_legacy_transactions.json')
    data.reject! { |r| r['type'] == 'Recurring' }

    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json'),
      'payment_methods' => json_fixture('import_from_legacy_payment_methods.json'),
      'transactions' => data
    })

    Expense.count.should == 5
    tx = Expense.find(2998)
    tx.amount.should == 0.89E2
    tx.note.should == 'rgx.io'
    tx.created_at.should == DateTime.new(2013, 07, 14, 12, 50, 23)
    tx.occurred_on.should == DateTime.new(2014, 07, 11)
    tx.account_id.should == 1
    tx.currency.should == 'USD'
    tx.currency_rate.should == 0.71E0
    tx.payment_method.should == PaymentMethod.find(3)
  end

  it 'should import category transactions' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json'),
      'categories' => json_fixture('import_from_legacy_categories.json'),
      'transactions' => json_fixture('import_from_legacy_transactions.json'),
      'recurrings' => json_fixture('import_from_legacy_recurrings.json'),
      'category_transactions' => json_fixture('import_from_legacy_category_transactions.json')
    })

    Expense.count.should == 5
    Expense.find(2998).categories.map(&:id).should == [125]
    Recurring.find(13321).categories.map(&:id).should == [356]
  end

  it 'should import everything' do
    run({
      'users' => json_fixture('import_from_legacy_users.json'),
      'accounts' => json_fixture('import_from_legacy_accounts.json'),
      'payment_methods' => json_fixture('import_from_legacy_payment_methods.json'),
      'categories' => json_fixture('import_from_legacy_categories.json'),
      'transactions' => json_fixture('import_from_legacy_transactions.json'),
      'recurrings' => json_fixture('import_from_legacy_recurrings.json'),
      'category_transactions' => json_fixture('import_from_legacy_category_transactions.json')
    })
  end
end