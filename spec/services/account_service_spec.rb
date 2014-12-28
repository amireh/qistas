describe AccountService do
  let :user do
    valid! fixture(:user)
  end

  before do
    user.accounts.destroy
  end

  describe '#create' do
    it 'should create an account' do
      svc = subject.create user, json_fixture('account.json')
      svc.should be_valid
      svc.output.should == user.accounts.last
    end

    it 'should catch an account creation error' do
      svc = subject.create user, { label: 'foo', currency: 'ZXC' }
      svc.should_not be_valid
    end
  end

  describe '#update' do
    let :account do
      valid! fixture(:account, user)
    end

    it 'should update an account' do
      svc = subject.update account, {
        label: 'Test Account'
      }

      svc.error.should be_blank
      account.label.should == 'Test Account'
    end

    it 'should report errors' do
      svc = subject.update account, {
        label: ''
      }

      svc.should_not be_valid
      svc.error.should_not be_blank
    end
  end

  describe '#destroy' do
    it 'should destroy an account' do
      account = valid! fixture(:account, user)
      svc = subject.destroy account

      svc.error.should be_blank
    end
  end
end