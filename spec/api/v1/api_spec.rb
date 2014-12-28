describe 'API' do
  it 'should reject with 406 on non-JSON requests' do
    header 'Accept', 'text/plain'

    rc = get '/api/v1/sessions'
    rc.status.should == 406
  end

  xit 'should reject with 406 on non-API JSON requests' do
    header 'Accept', 'application/json'

    rc = get '/'
    rc.status.should == 406

    rc = get '/something'
    rc.status.should == 406
  end

  it 'should reject with 404 on rogue routes' do
    rc = get '/api/v1/'
    rc.status.should == 404

    rc = api_call get '/api/v1/asdjfalkjdshflkxzhckvjxczvlhzxlvkjh'
    rc.should fail 404, 'Not Found'
  end

  context 'Custom responses' do
    include_examples 'routing specs'

    it 'should render 204 No Content responses' do
      router.get '/api/v1' do
        no_content!
      end

      rc = get '/api/v1'
      rc.status.should == 204
      rc.body.should be_empty
    end
  end
end