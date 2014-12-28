describe RecurringService do
  let :user do
    valid! fixture(:user)
  end

  let :account do
    user.default_account
  end

  before do
    account.recurrings.destroy
  end

  describe '#create' do
    it 'should create a recurring' do
      svc = subject.create account, json_fixture('recurring.json')
      svc.should be_valid
      svc.output.should == account.recurrings.last
    end

    it 'should create a recurring with a payment method' do
      pm = valid! Fixtures[:payment_method].build(user, { name: 'XYZ' })
      svc = subject.create account, json_fixture('recurring.json').merge({
        payment_method_id: pm.id
      })

      svc.should be_valid
      svc.output.payment_method.should == pm
    end

    it 'should create a recurring with a bunch of categories' do
      c1 = valid! Fixtures[:category].build(user, { name: 'XYZ' })
      c2 = valid! Fixtures[:category].build(user, { name: 'ABC' })

      svc = subject.create account, json_fixture('recurring.json').merge({
        category_ids: [ c1, c2 ].map(&:id)
      })

      svc.should be_valid
      svc.output.categories.include?(c1).should be_true
      svc.output.categories.include?(c2).should be_true
    end

    it 'should catch a recurring creation error' do
      svc = subject.create account, {}
      svc.should_not be_valid
    end
  end

  describe '#update' do
    let :recurring do
      valid! fixture(:recurring, account)
    end

    it 'should update a recurring' do
      svc = subject.update recurring, {
        amount: 234
      }

      svc.error.should be_blank
      recurring.amount.should == 234
    end

    it 'should update a recurring to remove all categories' do
      c1 = valid! Fixtures[:category].build(user, { name: 'XYZ' })

      recurring.categories = [ c1 ]
      recurring.save

      svc = subject.update recurring, { category_ids: [] }

      svc.should be_valid
      svc.output.categories.include?(c1).should be_false
      svc.output.categories.should == []
    end

    it "should update a recurring's categories" do
      c1 = valid! Fixtures[:category].build(user, { name: 'XYZ' })

      svc = subject.update recurring, { category_ids: [ c1.id ] }
      svc.should be_valid
      svc.output.categories.include?(c1).should be_true
    end

    it 'should update a recurring to disassociate a payment method' do
      recurring.payment_method = valid! Fixtures[:payment_method].build(user)
      recurring.save

      svc = subject.update recurring, { payment_method_id: nil }

      svc.should be_valid
      svc.output.payment_method.should == nil
    end

    it 'should report errors' do
      svc = subject.update recurring, {
        amount: 0
      }

      svc.should_not be_valid
      svc.error.should_not be_blank
    end
  end

  describe '#destroy' do
    it 'should destroy a recurring' do
      recurring = valid! fixture(:recurring, account)
      svc = subject.destroy recurring

      svc.error.should be_blank
    end
  end
end