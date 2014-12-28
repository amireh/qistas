describe PaymentMethodService do
  let :user do
    valid! fixture(:user)
  end

  before do
    user.payment_methods.destroy
  end

  describe '#create' do
    it 'should create a payment method' do
      svc = subject.create user, json_fixture('payment_method.json')
      svc.should be_valid
      svc.output.should == user.payment_methods.last
    end

    it 'should catch a payment_method creation error' do
      svc = subject.create user, {}
      svc.should_not be_valid
    end
  end

  describe '#update' do
    let :payment_method do
      valid! fixture(:payment_method, user)
    end

    it 'should update a payment method' do
      svc = subject.update payment_method, {
        name: 'Test PM'
      }

      svc.error.should be_blank
      payment_method.name.should == 'Test PM'
    end

    it 'should report errors' do
      svc = subject.update payment_method, {
        name: ''
      }

      svc.should_not be_valid
      svc.error.should_not be_blank
    end
  end

  describe '#destroy' do
    it 'should destroy a payment method' do
      payment_method = valid! fixture(:payment_method, user)
      svc = subject.destroy payment_method

      svc.error.should be_blank
    end
  end
end