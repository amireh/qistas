describe AccessTokensController do
  let :user do
    valid! fixture(:user)
  end

  after do
    user.access_tokens.destroy
  end

  scenario 'I request an access token' do
    sign_in user

    rc = api_call post "/api/v1/access_tokens", {
      udid: UUID.generate
    }

    rc.should succeed(200)
    rc.body['digest'].should be_present
  end

  scenario 'I fetch my access tokens' do
    sign_in user

    user.access_tokens.create({ udid: 'hello' })
    user.access_tokens.create({ udid: 'salam' })

    rc = api_call get '/api/v1/access_tokens'
    rc.should succeed
    rc.body.length.should == 2
  end

  scenario 'I fetch a single access token' do
    sign_in user

    access_token = user.access_tokens.create({ udid: 'hello' })

    rc = api_call get '/api/v1/access_tokens/hello'
    rc.should succeed
    rc.body.should be_present
    rc.body['digest'].should == access_token.digest
  end

  scenario 'I try to issue an access token, but I\'m not authorized' do
    rc = api_call post '/api/v1/access_tokens', { udid: UUID.generate }
    rc.should fail(401, '.*')
  end

  scenario 'I try to issue an access token, but one has already been issued' do
    sign_in user

    udid = UUID.generate

    rc = api_call post "/api/v1/access_tokens", { udid: udid }
    rc.should succeed(200)

    token = rc.body['digest']
    token.should_not be_empty

    rc = api_call post "/api/v1/access_tokens", { udid: udid }
    rc.should succeed(200)

    rc.body['digest'].should == token
  end

  scenario 'I login using an access token' do
    sign_in user

    rc = api_call post "/api/v1/access_tokens", { udid: UUID.generate }
    rc.should succeed(200)

    token = rc.body['digest']

    sign_out

    expect { api_call get '/api/v1/sessions' }.to fail(401, '.*')

    header 'X-Access-Token', token

    expect { api_call get '/api/v1/sessions' }.to succeed
  end

  scenario 'I revoke an access token' do
    sign_in user

    udid = UUID.generate

    rc = api_call post "/api/v1/access_tokens", { udid: udid }
    rc.should succeed(200)

    token = rc.body['digest']

    expect { api_call delete "/api/v1/access_tokens/#{udid}" }.to succeed(204)

    sign_out

    header 'X-Access-Token', token

    expect { api_call get '/api/v1/sessions' }.to fail(401, '.*')
  end
end