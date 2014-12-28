describe Rack::API::ParameterValidators::ArrayValidator do
  it 'should coerce [1,3]'
  it 'should coerce 1,3'
  it 'should coerce 1, 3'
  it 'should coerce foo, bar, zoo'
end