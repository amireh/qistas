describe UserService do
  describe '#create' do
    it 'should create a user' do
      svc = subject.create json_fixture('user.json')
      svc.should be_valid
      svc.output.should == User.first
    end

    it 'should catch a user creation error' do
      svc = subject.create({})
      svc.should_not be_valid
    end

    it 'should equip the user with a starter emergency-control package' do
      svc = subject.create json_fixture('user.json')
      user = valid! svc.output
      user.accounts.pluck(:label).should include(UserService::EMERGENCY_ACCOUNT_LABEL)
      user.budgets.pluck(:name).should include(UserService::EMERGENCY_BUDGET_NAME)
    end

    it "should create a user with a default account" do
      svc = subject.create json_fixture('user.json')
      user = valid! svc.output
      user.accounts.length.should > 0
    end

    it "should create a user with a default payment method" do
      User.stub(default_payment_methods: [
        { name: 'Cash', color: 'FF0000', default: true },
        { name: 'Credit Card', color: 'FF0000', default: false },
        { name: 'Cheque', color: 'FF0000', default: false }
      ])

      svc = subject.create json_fixture('user.json')
      user = valid! svc.output

      # Cash, Cheque, and Credit Card
      user.payment_methods.length.should == 3

      # default payment method
      user.default_payment_method.should be_true
    end

  end

  describe '#find_or_create_from_oauth' do
    it 'should create a new user' do
      oauth_hash = OmniAuth::AuthHash.new({
        provider: 'facebook',
        uid: 1234,
        info: {
          name: 'Monkey Guru',
          email: 'monkey@guru.xyz'
        }
      })

      svc = subject.find_or_create_from_oauth('facebook', oauth_hash)
      svc.should be_valid

      user = svc.output
      user.should be_valid
      user.id.should be_present
      user.link.should_not be_present
      user.links.should_not be_empty
      user.linked_to?('facebook').should be_true
    end

    it 'should report a failure' do
      oauth_hash = OmniAuth::AuthHash.new({
        provider: 'facebook',
        uid: 1234,
        info: {
          name: 'Monkey Guru'
        }
      })

      svc = subject.find_or_create_from_oauth('facebook', oauth_hash)
      svc.should_not be_valid
      svc.error.to_json.should match /need your email/i
    end

    it 'should link to the current user' do
      pibi_user = valid! Fixtures[:user].build

      oauth_hash = OmniAuth::AuthHash.new({
        provider: 'facebook',
        uid: 1234,
        info: {
          name: 'Monkey Guru',
          email: 'monkey@guru.xyz'
        }
      })

      svc = subject.find_or_create_from_oauth('facebook', oauth_hash, pibi_user)
      svc.should be_valid

      user = svc.output
      user.should == pibi_user
      user.linked_to?('facebook').should be_true

      facebook_user = user.links.first
      facebook_user.id.should be_present
      facebook_user.link.should == pibi_user
    end

    it 'should link an existing user to a master if it is not linked' do
      pibi_user = valid! fixture(:user, email: 'monkey@guru.com')
      facebook_user = valid! fixture(:user, {
        email: 'monkey@guru.com',
        uid: 1234.to_s,
        provider: 'facebook'
      })

      oauth_hash = OmniAuth::AuthHash.new({
        provider: 'facebook',
        uid: 1234.to_s,
        info: {
          name: 'Monkey Guru',
          email: 'monkey@guru.com'
        }
      })

      svc = subject.find_or_create_from_oauth('facebook', oauth_hash, nil)
      svc.should be_valid

      svc.output.should == pibi_user.reload
      pibi_user.linked_to?('facebook').should be_true

      pibi_user.links.first.should == facebook_user.reload
      facebook_user.link.should == pibi_user
    end

    it 'should return an existing user' do
      oauth_hash = OmniAuth::AuthHash.new({
        provider: 'facebook',
        uid: 1234,
        info: {
          name: 'Monkey Guru',
          email: 'monkey@guru.xyz'
        }
      })

      svc = subject.find_or_create_from_oauth('facebook', oauth_hash)
      svc.error.should be_nil
      svc.should be_valid

      user = svc.output

      svc = subject.find_or_create_from_oauth('facebook', oauth_hash)
      svc.should be_valid

      same_user = svc.output
      same_user.should == user
    end
  end

  describe '#update' do
    it 'should change the password using a token' do
      user = valid! fixture(:user)
      user.generate_reset_password_token
      svc = subject.update(user, {
        reset_password_token: user.reset_password_token,
        password: 'foobar123',
        password_confirmation: 'foobar123'
      })

      svc.should be_valid
      user.password.should == User.encrypt('foobar123')
    end

    it 'should not change the password using a bad token' do
      user = valid! fixture(:user)
      user.generate_reset_password_token
      svc = subject.update(user, {
        reset_password_token: 'foobar',
        password: 'foobar123',
        password_confirmation: 'foobar123'
      })

      svc.should_not be_valid
      svc.error.to_json.should match /invalid.*token/i
    end
  end
end