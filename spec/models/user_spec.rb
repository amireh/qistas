describe User do
  let :user_data do
    json_fixture 'user.json'
  end

  it { should have_many(:access_tokens) }
  it { should have_many(:links).class_name('User') }
  it { should belong_to(:link).class_name('User') }

  it 'should create a user' do
    u = User.new(user_data)
    u.should be_valid
  end

  it 'should encrypt the password' do
    u = User.create(user_data)
    u.valid?
    u.password.should == User.encrypt(user_data[:password])
  end

  describe 'validations' do
    it 'should reject short passwords' do
      u = User.new(user_data.merge({
        password: 'foo',
        password_confirmation: 'foo'
      }))
      u.valid?.should be_false
      u.error_messages.first.should match(/must be at least/)

      u.save.should be_false
    end

    it 'should require passwords to match' do
      u = User.new(user_data.merge({ password: 'foobar123', password_confirmation: 'asdf1234' }))
      u.valid?.should be_false
      u.error_messages.first.should match(/must match/)

      u.save.should be_false
    end

    it 'should require a password confirmation' do
      u = valid! fixture :user
      u.update({
        password: 'asdf1234',
        password_confirmation: ''
      }).should be_false
      u.error_messages.first.should match(/must confirm/)
    end

    it 'should require the current password' do
      u = valid! fixture :user
      u.update({
        password: 'asdf1234',
        password_confirmation: 'asdf1234'
      }).should be_false
      u.error_messages.first.should match(/current password you entered is wrong/)
    end

    it 'should require a password' do
      u = User.new(user_data.merge({ password: '', password_confirmation: '' }))
      u.valid?.should be_false
      u.error_messages.first.should match(/must provide/)

      u.save.should be_false
    end

    it 'should update the password' do
      u = valid! fixture :user
      u.update({
        current_password: 'helloWorld123',
        password: 'asdf1234',
        password_confirmation: 'asdf1234'
      })
      u.error_messages.should == []
    end

    it 'should require an email address' do
      u = User.new(user_data.merge({ email: '' }))
      u.valid?.should be_false
      u.error_messages.first.should match(/need your email/)

      u.save.should be_false
    end

    it 'should require a name' do
      u = User.new(user_data.merge({name: ''}))
      u.valid?.should be_false
      u.error_messages.first.should match(/need your name/)
    end

    it 'should reject an invalid email' do
      u = User.new(user_data.merge({ email: 'domdombaz' }))
      u.valid?.should be_false
      u.error_messages.first.should match(/look like an email/)

      u.save.should be_false
    end

    it 'should require an email to be untaken' do
      user1 = valid! fixture(:user)
      user2 = invalid! User.create(user_data)
      user2.error_messages.first.should match(/already an account registered/i)
    end

    it 'should accept a taken email in a different provider scope' do
      valid! fixture(:user)
      valid! fixture(:user, { provider: 'developer' })
    end
  end

  describe 'Links' do
    it 'should link a user to a master' do
      master = valid! fixture(:user)
      slave  = valid! fixture(:user, { provider: 'developer' })

      slave.link.should be_false
      slave.linked_to?(master).should be_false

      slave.link_to(master)

      slave.linked_to?(master).should be_true
      master.linked_to?(slave).should be_true
    end

    it 'should query a link using a provider string' do
      master = valid! fixture(:user)
      slave  = valid! fixture(:user, { provider: 'developer' })

      slave.link.should be_false
      slave.linked_to?(master).should be_false

      slave.link_to(master)

      slave.linked_to?(master.provider).should be_true
      master.linked_to?('developer').should be_true
    end

    it 'should destroy its links' do
      master = valid! fixture(:user)
      slave  = valid! fixture(:user, { provider: 'developer' })

      slave.link_to(master)

      master.destroy.should be_true
      expect { slave.reload }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'should detach from master when destroyed' do
      master = valid! fixture(:user)
      slave  = valid! fixture(:user, { provider: 'developer' })

      slave.link_to(master)

      master.links.count.should == 1
      slave.destroy.should be_true
      master.links.count.should == 0
    end

    it 'should link a user and its linked slaves to a master one' do
      master = valid! fixture(:user)
      slave  = valid! fixture(:user, { provider: 'developer' })
      cousin = valid! fixture(:user, { provider: 'facebook' })

      cousin.link_to(slave).should be_true
      cousin.linked_to?(slave).should be_true

      # link the slave to the master
      slave.linked_to?(master).should be_false
      slave.link_to(master).should be_true
      slave.linked_to?(master).should be_true

      # distant slave should be linked to the master now too
      cousin.linked_to?(master).should be_true
      cousin.linked_to?(slave).should be_false

      # master should be linked to both
      master.linked_to?(slave).should be_true
      master.linked_to?(cousin).should be_true
    end
  end

  describe 'Preferences' do
    it 'should add to the current prefs' do
      user = User.create(user_data)

      expect(user).to receive(:accept_preferences).twice.and_call_original

      user.update({
        preferences: {
          favorite_fruit: 'apple'
        }
      })

      user.preferences.should == {
        favorite_fruit: 'apple'
      }.with_indifferent_access

      user.update({
        preferences: {
          favorite_vegetable: 'lettuce'
        }
      })

      user.preferences.should == {
        favorite_fruit: 'apple',
        favorite_vegetable: 'lettuce'
      }.with_indifferent_access
    end
  end
end
