describe Rack::API::Resources do
  include_examples 'routing specs'

  before do
    router.get '/tests/resources/:test_resource_id' do
      required_resources :test_resource
      render json: {}
    end
  end

  it 'should locate a resource' do
    TestResource.should_receive(:find).and_return({})
    TestsController.any_instance.should_receive(:can?).and_return true

    rc = api_call get '/tests/resources/5'
    rc.should succeed
  end

  it "should reject a resource that couldn't be found" do
    TestResource.should_receive(:find).and_return(nil)

    rc = api_call get '/tests/resources/5'
    rc.should fail(404, /no such/i)
  end

  it "should reject when user has no access to the resources" do
    TestResource.should_receive(:find).and_return({})
    TestsController.any_instance.should_receive(:can?).and_return(false)

    rc = api_call get '/tests/resources/5'
    rc.should fail(403, /do not have access/i)
  end

  it "should locate a resource inside a container" do
    tests_collection = double('test')
    user = double('user')

    TestsController.any_instance.stub(:can?).and_return true

    User.should_receive(:find).and_return user
    user.should_receive(:tests).and_return tests_collection
    tests_collection.should_receive(:find).with(5).and_return({ found: true })

    router.get '/users/:user_id/tests/:test_id' do
      with :user, :test

      render json: @test
    end

    api_call get '/users/1/tests/5' do |rc|
      rc.should succeed
      rc.body.should == {
        found: true
      }.with_indifferent_access
    end
  end

end