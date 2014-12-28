describe TransactionService do
  let :user do
    valid! fixture(:user)
  end

  let :account do
    user.default_account
  end

  before do
    account.transactions.destroy
  end

  describe '#create' do
    it 'should create a transaction' do
      svc = subject.create account, json_fixture('transaction.json')
      svc.should be_valid
      svc.output.should == account.transactions.last
    end

    it 'should create a transaction with a payment method' do
      pm = valid! Fixtures[:payment_method].build(user, { name: 'XYZ' })
      svc = subject.create account, json_fixture('transaction.json').merge({
        payment_method_id: pm.id
      })

      svc.should be_valid
      svc.output.payment_method.should == pm
    end

    it 'should create a transaction with a bunch of categories' do
      c1 = valid! Fixtures[:category].build(user, { name: 'XYZ' })
      c2 = valid! Fixtures[:category].build(user, { name: 'ABC' })

      svc = subject.create account, json_fixture('transaction.json').merge({
        category_ids: [ c1, c2 ].map(&:id)
      })

      svc.should be_valid
      svc.output.categories.include?(c1).should be_true
      svc.output.categories.include?(c2).should be_true
    end

    it 'should catch a transaction creation error' do
      svc = subject.create account, {}
      svc.should_not be_valid
    end
  end

  describe '#update' do
    let :transaction do
      valid! fixture(:transaction, account)
    end

    it 'should update a transaction' do
      svc = subject.update transaction, {
        amount: 234
      }

      svc.error.should be_blank
      transaction.amount.should == 234
    end

    it 'should update a transaction to remove all categories' do
      c1 = valid! Fixtures[:category].build(user, { name: 'XYZ' })

      transaction.categories = [ c1 ]
      transaction.save

      svc = subject.update transaction, { category_ids: [] }

      svc.should be_valid
      svc.output.categories.include?(c1).should be_false
      svc.output.categories.should == []
    end

    it "should update a transaction's categories" do
      c1 = valid! Fixtures[:category].build(user, { name: 'XYZ' })

      svc = subject.update transaction, { category_ids: [ c1.id ] }
      svc.should be_valid
      svc.output.categories.include?(c1).should be_true
    end

    it 'should update a transaction to disassociate a payment method' do
      transaction.payment_method = valid! Fixtures[:payment_method].build(user)
      transaction.save

      svc = subject.update transaction, { payment_method_id: nil }

      svc.should be_valid
      svc.output.payment_method.should == nil
    end

    it 'should report errors' do
      svc = subject.update transaction, {
        amount: 0
      }

      expect(svc).not_to be_valid
      expect(svc.error).not_to be_blank
      expect(svc.error.as_json).to have_key(:amount)
      expect(svc.error.as_json[:amount][0]).to match(/BAD_AMOUNT/)
    end
  end

  describe '#destroy' do
    it 'should destroy a transaction' do
      transaction = valid! fixture(:transaction, account)
      svc = subject.destroy transaction

      svc.error.should be_blank
    end
  end

  describe '#transfer' do
    let :source do
      valid! fixture(:transaction, account, {
        type: 'Expense',
        amount: 10,
        currency: 'USD'
      })
    end

    let :other_account do
      valid! fixture(:account, user)
    end

    it 'should create an Income counterpart for an Expense transaction' do
      svc = subject.transfer(account, other_account, { amount: 10, currency: 'USD' })
      svc.should be_valid

      transfer = svc.output
      expect(transfer.new_record?).to eq(false)

      expect(account.expenses.count).to eq(1)
      expect(other_account.incomes.count).to eq(1)

      source = account.expenses.first
      counterpart = other_account.incomes.first

      transfer.source.should == source
      transfer.target.should == counterpart

            account.reload.balance.to_f.should == -10
      other_account.reload.balance.to_f.should == 10
    end

    it 'should report errors' do
      svc = subject.transfer account, other_account, { amount: 0 }

      svc.should_not be_valid
      svc.error.should_not be_blank

      expect(svc.error.as_json).to have_key(:amount)
      expect(svc.error.as_json[:amount][0]).to match(/BAD_AMOUNT/)
    end
  end
end