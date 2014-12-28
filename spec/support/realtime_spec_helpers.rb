module RSpec
  class RTMessageInterceptor
    include Singleton

    attr_reader :messages

    def initialize
      reset
    end

    def track(user_id, code, params, options={})
      @messages << {
        user_id: user_id,
        code: code,
        params: params,
        options: options
      }
    end

    def reset
      @messages = []
    end
  end
end

RSpec.configure do |config|
  config.before :each do
    publish = Algol::Messenger.method(:publish)

    Algol::Messenger.stub(:publish) do |*args|
      RSpec::RTMessageInterceptor.instance.track(*args)
      publish.call(*args)
    end
  end

  config.after :each do
    RSpec::RTMessageInterceptor.instance.reset
  end
end
