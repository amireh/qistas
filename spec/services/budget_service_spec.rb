describe BudgetService do
  let :user do
    valid! fixture(:user)
  end

  describe '#create' do
    it 'should create a savings control budget' do
      svc = subject.create user, json_fixture('budget_savings_control.json').merge({
        account_id: user.default_account.id
      })
      svc.should be_valid
      svc.output.should == user.budgets.last
    end

    it 'should create a spendings control budget' do
      svc = subject.create user, json_fixture('budget_spendings_control.json').merge({
        account_id: user.default_account.id
      })
      svc.should be_valid
      svc.output.should == user.budgets.last
    end

    it 'should create a frequency control budget' do
      c = user.categories.create({ name: 'Shopping' })
      svc = subject.create user, json_fixture('budget_frequency_control.json').merge({
        category_ids: [ c.id ]
      })

      svc.should be_valid
      svc.output.should == user.budgets.last
      svc.output.categories.include?(c).should be_true
    end

    it 'should catch a budget creation error' do
      svc = subject.create user, {}
      svc.should_not be_valid
    end
  end

  # describe '#update' do
  #   let :budget do
  #     valid! fixture(:budget, user)
  #   end

  #   it 'should update a budget' do
  #     svc = subject.update budget, {
  #       name: 'Test Budget'
  #     }

  #     svc.error.should be_blank
  #     budget.name.should == 'Test Budget'
  #   end

  #   it 'should report errors' do
  #     svc = subject.update budget, {
  #       name: ''
  #     }

  #     svc.should_not be_valid
  #     svc.error.should_not be_blank
  #   end
  # end

  # describe '#destroy' do
  #   it 'should destroy a budget' do
  #     budget = valid! fixture(:budget, user)
  #     svc = subject.destroy budget

  #     svc.error.should be_blank
  #   end
  # end
end