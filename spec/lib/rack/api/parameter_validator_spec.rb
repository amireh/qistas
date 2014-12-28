describe Rack::API::ParameterValidator do
  include_examples 'routing specs'

  it 'should run validators on parameter parsing' do
    class Rack::API::ParameterValidators::BananaValidator < Rack::API::ParameterValidator
      def validate(*args)
      end
    end

    validator_klass = Rack::API::ParameterValidators::BananaValidator
    validator_klass.any_instance.should_receive(:validate)

    Rack::API.trigger :parameter_parsed, 'banana', {
      banana: 123
    }, { type: :banana }

    Rack::API::ParameterValidators.send(:remove_const, 'BananaValidator')
  end

  it "should run the validator's coerce if viable" do
    class Rack::API::ParameterValidators::FragValidator < Rack::API::ParameterValidator
      def validate(*args)
      end

      def coerce(value, definition)
        value.to_s
      end
    end

    validator_klass = Rack::API::ParameterValidators::FragValidator

    data = { frag: 123 }.with_indifferent_access

    validator_klass.any_instance.should_receive(:validate)
    validator_klass.any_instance.should_receive(:coerce).and_call_original

    Rack::API.trigger :parameter_parsed, :frag, data, {
      type: :frag,
      coerce: true
    }

    data[:frag].should == '123'

    Rack::API::ParameterValidators.send(:remove_const, 'FragValidator')
  end
end