describe BudgetSerializer do
  let :user do
    fixture :user
  end

  let :budget do
    valid! fixture(:budget, user)
  end

  subject { BudgetSerializer.new budget }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:budget][:id].should == "#{budget.id}"
    output[:budget][:name].should == budget.name
    output[:budget][:icon].should == budget.icon
    output[:budget][:created_at].should == budget.created_at
  end

  it 'should include transactions when options[:include_ids] is on' do
    transaction = valid! fixture(:transaction, user.default_account, { type: 'Income' })

    output = described_class.new(budget, {
      scope: {
        options: {
          include_ids: true
        }
      }
    }).as_json.with_indifferent_access

    output[:budget][:transaction_ids].should be_present
    output[:budget][:transaction_ids].should include("#{transaction.id}")
  end

  it 'should not include transactions by default' do
    transaction = valid! fixture(:transaction, user.default_account, { type: 'Income' })

    output = subject.as_json.with_indifferent_access

    output[:budget][:transaction_ids].should_not be_present
  end
end