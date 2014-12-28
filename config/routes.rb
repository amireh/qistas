Salati::Application.routes.draw do
  scope controller: :authentication do
    scope '/api/v1/sessions' do
      get '/', action: :show
      post '/', action: :create
      put '/', action: :refresh
      delete '/', action: :destroy
      delete '/:sink', action: :destroy
    end

    get '/auth/failure', to: 'authentication#oauth_failure'
    get '/auth/:provider/callback', to: 'authentication#authorize_by_oauth'
  end

  scope "/api/v1" do
    scope '/access_tokens', controller: :access_tokens do
      get '/', action: :index, as: :user_access_tokens
      post '/', action: :create
      get '/:udid', action: :show, as: :user_access_token
      delete '/:udid', action: :destroy
    end

    scope '/users', controller: :users do
      post '/', action: :create
      get '/reset_password', action: :reset_password, as: :user_reset_password
      post '/change_password', action: :change_password, as: :user_change_password
      get '/:user_id', action: :show, as: :user
      patch '/:user_id', action: :update
      delete '/:user_id', action: :destroy
      delete '/:user_id/links', action: :unlink, as: :user_unlink_provider
      get '/:user_id/verify_email', action: :verify_email, as: :user_verify_email

      scope '/:user_id/notices', controller: :notices do
        get '/:token', action: :accept, as: :user_notice_accept
      end
    end

    scope '/prayers', controller: :prayers do
      get '/', action: :index, as: :user_prayers
      post '/', action: :create
      get '/:prayer_id', action: :show
      patch '/:prayer_id', action: :update
      delete '/:prayer_id', action: :destroy
    end

    match '*path' => 'application#rogue_route', via: :all
    match '/' => 'application#rogue_route', via: :all
  end

  root 'ui#index'

  match '*path' => 'ui#index', via: :all
  match '/' => 'ui#index', via: :all
end
