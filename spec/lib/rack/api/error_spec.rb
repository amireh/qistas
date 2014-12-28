describe Rack::API::Error do

  it 'should represent a string message' do
    error = described_class.new(400, 'Something went wrong.')
    error.to_json.should == {
      status: 'error',
      messages: [ 'Something went wrong.' ],
      field_errors: {}
    }.to_json
  end
  it 'should represent a bunch of string messages' do
    error = described_class.new(400, [ 'Need an apple.', 'Need a banana.' ])
    error.as_json[:messages].sort.should == [ 'Need an apple.', 'Need a banana.' ].sort
  end

  it 'should represent an AR error map' do
    object = double('resource')
    object.stub(:errors).and_return({
      name: 'We need a name.'
    })

    error = described_class.new(400, object.errors)
    error.to_json.should == {
      status: 'error',
      messages: [ 'We need a name.' ],
      field_errors: {
        name: 'We need a name.'
      }
    }.to_json
  end

  it 'should represent a status error' do
    described_class.new(400).message.should =~ /Bad Request/
    described_class.new(204).message.should =~ /No Content/
    described_class.new(401).message.should =~ /Unauthorized/
    described_class.new(404).message.should =~ /Not Found/
  end

  it 'should represent a status error as JSON' do
    error = described_class.new(404)
    error.message.should =~ /Not Found/
    error.to_json.should == {
      status: 'error',
      messages: [ '[NOT_FOUND] Not Found' ],
      field_errors: {}
    }.to_json
  end

end