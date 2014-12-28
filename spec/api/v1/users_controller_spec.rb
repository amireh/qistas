describe UsersController do
  let :user_data do
    json_fixture('user.json')
  end

  def fill_form(params = {}, &block)
    rc = api_call post '/api/v1/users', user_data.merge(params)

    unless params.empty?
      rc.should fail(400, '.*')
    end

    yield rc if block_given?
  end

  scenario 'Signing up with correct info' do
    fill_form do |rc|
      rc.should succeed
    end
  end

  it 'Signing up with no name' do
    fill_form({ name: '' }) do |rc|
      rc.should fail(400, 'need your name')
    end
  end

  scenario "Signing up with no email" do
    fill_form({ email: '' }) do |rc|
      rc.should fail(400, 'need your email')
    end
  end

  scenario "Signing up with an invalid email" do
    fill_form({ email: 'this is no email' }) do |rc|
      rc.should fail(400, 'look like an email')
    end
  end

  scenario "Signing up with a taken email" do
    user = valid! fixture(:user)

    fill_form({ email: user.email }) do |rc|
      rc.should fail(400, 'already registered')
    end
  end

  scenario "Signing up without a password" do
    fill_form({ password: '' }) do |rc|
      rc.should fail(400, 'must provide password')
    end
  end

  scenario "Signing up with mis-matched passwords" do
    fill_form({ password: 'barfoo123' }) do |rc|
      rc.should fail(400, 'must match')
    end
  end

  scenario "Signing up with a password too short" do
    fill_form({ password: 'bar', password_confirmation: 'bar' }) do |rc|
      rc.should fail(400, 'be at least characters long')
    end
  end

  scenario "Reading my data" do
    user = valid! fixture(:user)
    sign_in user

    rc = api_call get "/api/v1/users/#{user.id}"
    rc.should succeed

    rc.body["id"].to_i.should == user.id
    rc.body["email"].should == user.email
  end

  scenario "Reading someone else's data" do
    user1 = valid! fixture(:user)
    user2 = valid! fixture(:user, {
      email: 'foo@bar.com'
    })

    sign_in user1

    rc = api_call get "/api/v1/users/#{user2.id}"
    rc.should fail(403, 'do not have access')
  end

  describe '[PATCH] /users/:user_id (#update)' do
    before do
      @user = valid! fixture(:user)
      sign_in @user
    end

    scenario 'Updating my data' do
      rc = api_call patch "/api/v1/users/#{@user.id}", {
        name: 'Adooken'
      }

      rc.should succeed
      rc.body['name'].should == 'Adooken'
    end

    scenario 'Failing to update my data' do
      rc = api_call patch "/api/v1/users/#{@user.id}", {
        password: 'foobar987'
      }

      rc.should fail(400, '.*')
    end
  end

  describe '[DELETE] /users/:user_id (#destroy)' do
    before do
      @user = valid! fixture :user
      sign_in @user
    end

    scenario "I unregister" do
      rc = api_call delete "/api/v1/users/#{@user.id}"
      rc.should succeed

      expect { @user.reload }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe '[DELETE] /users/:user_id/links (#unlink)' do
    scenario "I unlink my Facebook account" do
      user = valid! fixture :user

      fb_user = valid! fixture :user, { provider: 'facebook' }
      fb_user.link_to user

      sign_in user

      rc = api_call delete "/api/v1/users/#{user.id}/links?provider=facebook"
      rc.should succeed(204)

      fb_user.reload.linked_to?(user).should be_false
      user.reload.linked_to?(fb_user).should be_false
    end

    scenario "I attempt to unlink an unlinked account" do
      user = valid! fixture :user

      sign_in user

      rc = api_call delete "/api/v1/users/#{user.id}/links?provider=facebook"
      rc.should fail(400, 'not linked to')
    end
  end

  describe 'resetting password' do
    after do
      ActionMailer::Base.deliveries.clear
    end

    scenario "I reset my password by providing my email" do
      user = valid! fixture :user

      expect {
        rc = api_call get "/api/v1/users/reset_password?email=#{user.email}"
        rc.should succeed
      }.to change { ActionMailer::Base.deliveries.size }.by(1)
    end
  end

  describe '[POST] /users/change_password (#change_password)' do
    scenario 'I change my password using a token' do
      user = valid! fixture :user
      user.generate_reset_password_token

      rc = api_call post "/api/v1/users/change_password", {
        reset_password_token: user.reset_password_token,
        password: 'foobar123',
        password_confirmation: 'foobar123'
      }

      rc.should succeed
    end

    it 'should 404 if token is invalid' do
      rc = api_call post "/api/v1/users/change_password", {
        reset_password_token: 'what',
        password: 'foobar123',
        password_confirmation: 'foobar123'
      }

      rc.should fail(404, /Not Found/)
    end
  end
end