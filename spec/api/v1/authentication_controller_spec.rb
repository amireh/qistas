require 'spec_helper'

describe 'Authentication API', type: :api do
  it 'should allow me to sign in using BasicAuth' do
    valid! fixture(:user)

    sign_in @user

    rc = get '/api/v1/sessions'
    rc.status.to_i.should == 200
  end

  it 'should give me a session cookie' do
    valid! fixture(:user)

    sign_in @user
    rc = get '/api/v1/sessions'
    rc.header['Set-Cookie'].should be_present
    rc.header['Set-Cookie'].should match /salati.session/
  end

  it 'should deny access' do
    rc = get '/api/v1/sessions'
    rc.status.should == 401
  end

  context "OAuth" do
    let :user_params do
      json_fixture('user.json')
    end

    before do
    end

    def oauth_signup(provider, params = {})
      OmniAuth.config.add_mock provider.to_sym, user_params.merge(params.merge({
        provider: provider
      }))

      get "/auth/#{provider}"

      follow_redirect!

      yield last_response if block_given?
    end

    def oauth_signin(provider, user)
      get "/auth/#{provider}", {
        uid: user.uid,
        provider: provider.to_sym
      }.to_json

      follow_redirect!

      yield last_response if block_given?
    end

    it "Authenticating for the first time" do
      oauth_signup("developer") do |response|
        response.location.should =~ /success/
      end
    end

    it "Bad auth hash" do
      oauth_signup("developer", { email: nil }) do |response|
        response.location.should =~ /failure/
      end

      oauth_signup("developer", { email: '' }) do |response|
        response.location.should =~ /failure/
      end
    end

    it "Signing in using a 3rd-party account" do
      oauth_signup("developer") do |response|
        response.location.should =~ /success/

        User.count.should == 2

        oauth_signup("developer") do |response|
          response.location.should =~ /success/

          User.count.should == 2
        end
      end
    end

    describe "Conflict with an existing user" do
      it 'should implicitly link against the existing Pibi user' do
        valid! fixture(:user)

        oauth_signup("developer", { email: @user.email }) do |response|
          response.location.should =~ /success/

          oauth_user = User.find_by({ provider: "developer" })
          oauth_user.link.should == @user
        end
      end
    end

    it "Linking an account" do
      @user = valid! fixture(:user)
      sign_in @user

      oauth_signup("developer") do |response|
        response.location.should =~ /success/

        oauth_user = User.find_by({ provider: "developer" })
        oauth_user.link.should == @user
      end
    end

    it "Signing in using a linked account" do
      valid! fixture(:user)
      sign_in @user

      oauth_signup("developer") do |response|
        response.location.should =~ /success/

        oauth_user = User.find_by({ provider: "developer" })
        oauth_user.link.should == @user

        sign_out

        api { get "/api/v1/sessions" }.should fail(401, 'Unauthorized')

        oauth_signin("developer", oauth_user) do |response|
          response.location.should =~ /success/

          # we need to stamp the cookie manually
          cookie = last_response.header["Set-Cookie"]
          header "Cookie", cookie

          api { get "/api/v1/sessions" }.should succeed
        end
      end
    end

    context "OAuth from an external referer" do
      it "Getting redirected after a successful sign-up" do
        oauth_signup("developer") do |response|
          response.location.should =~ /success/
          response.redirect?.should be_true
        end
      end

      it "Getting redirected after a successful sign-in" do
        oauth_signup("developer") do |response|
          response.location.should =~ /success/
          response.redirect?.should be_true

          oauth_signup("developer") do |response|
            response.location.should =~ /success/
            response.redirect?.should be_true
          end
        end
      end

      it "Getting redirected with an error" do
        oauth_signup("developer", { email: nil, uid: nil }) do |response|
          response.location.should =~ /failure/
          response.redirect?.should be_true
          response.location.should match(/internal_error/)
        end

        oauth_signup("developer", { email: nil, uid: nil }) do |response|
          response.location.should =~ /failure/
          response.redirect?.should be_true
          response.location.should match(/internal_error/)
        end
      end
    end # OAuth from an external referer
  end # OAuth
end