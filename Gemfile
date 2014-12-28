source 'http://rubygems.org'

gem 'rails', '4.0.5'
gem 'uuid'
gem 'pg'
gem 'enumerize', '=0.7.0'
gem 'active_model_serializers', "~> 0.8.0"
gem 'addressable'

group :doc do
  gem 'redcarpet'
  gem 'github-markup'
  gem 'yard', '=0.8.7', require: false
  gem 'yard-appendix', '>=0.1.8', require: false
  gem 'yard-api', git: 'git@github.com:amireh/yard-api.git'
  gem 'yard-api-slatelike', git: 'git@github.com:amireh/yard-api-slatelike.git'
end

group :development, :test do
  gem 'rspec-rails', '~> 2.14.1'
  gem 'rack-test', '~> 0.6.2'
  gem 'shoulda-matchers'
  gem 'byebug'
end

group :development do
  gem 'ruby-prof'
end

gem 'omniauth', '~> 1.2'
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'
gem 'moneta', :require => 'rack/session/moneta'
gem 'rack-cors', :require => 'rack/cors'
gem 'cancan'

platforms :ruby_21 do
  gem 'bigdecimal', '>= 1.2.4'
end

gem 'redis', '~> 3.0.7', :require => 'redis'
gem 'resque', '~> 1.25'
gem 'resque_mailer', '~> 2.2.6'
gem 'foreman'
gem 'kaminari', '=0.15.1'
gem 'puma', '~> 2.7.1'
gem 'newrelic_rpm', '=3.8.1.221'
gem 'foreigner'