describe Rack::API::Parameters do
  include_examples 'routing specs'

  context 'defining parameters' do
    context 'required parameters' do
      it 'should define a required group parameter' do
        pending 'nested parameter groups'

        app.post '/' do
          api_required!({
            id: nil,
            project: {
              name: nil
            }
          })

          api.parameters.to_json
        end

        rc = api_call post '/', { id: 123, project: { name: 'adooga' } }
        rc.should succeed
        rc.body.should == {
          id: 123,
          project: {
            name: 'adooga'
          }
        }.with_indifferent_access
      end

      it 'should reject when missing a required group parameter' do
        router.post '/' do
          parameter :id, required: true
          parameter 'project.name', type: :string, required: true
        end

        rc = api_call post '/', { id: 123 }
        rc.should fail(400, 'missing name')
      end

      it 'should define required parameters using list style' do
        router.post '/' do
          requires [ :id, :name ]
        end

        post '/'
        last_response.status.should == 400
        last_response.body.should match(/missing required parameter :id/i)

        post '/', { id: 10 }
        last_response.status.should == 400
        last_response.body.should match(/missing required parameter :name/i)
      end

      it 'should define a single required parameter' do
        router.get '/' do
          parameter :id, required: true
        end

        get '/'
        last_response.status.should == 400
        last_response.body.should match(/Missing required parameter :id/)
      end
    end

    context 'optional parameters' do
      it 'should define an optional parameter' do
        router.get '/' do
          parameter :id
          render json: api.parameters
        end

        rc = api_call get '/'
        rc.should succeed
        rc.body.should == {}
      end

      it 'should define optional parameters using list style' do
        router.post '/' do
          accepts :id, :name

          render json: api.parameters
        end

        rc = api_call post '/', { id: 5, name: 'test' }
        rc.should succeed
        rc.body.should == { id: 5, name: 'test' }.with_indifferent_access
      end
    end
  end

  it "should reject a request missing a required parameter" do
    router.get '/' do
      requires :id
    end

    rc = api_call get '/'
    rc.should fail(400, 'missing required parameter')
  end

  it "should accept a request satisfying required parameters" do
    router.get '/' do
      requires :id

      render json: api.parameters
    end

    rc = api_call get '/', { id: 5 }
    rc.should succeed
    rc.body.should == { id: "5" }.with_indifferent_access
  end

  it "should accept a request not satisfying optional parameters" do
    router.get '/' do
      requires :id
      accepts :name

      render json: api.parameters
    end

    rc = api_call get '/', { id: 5 }
    rc.should succeed
  end

  it "should apply parameter conditions" do
    router.get '/' do
      parameter :name, validator: lambda { |v|
        unless /ahmad/.match v
          "Unexpected name."
        end
      }

      render json: api.parameters
    end

    rc = api_call get '/', { name: 'foobar' }
    rc.should fail(400, 'unexpected name')

    rc = api_call get '/', { name: 'ahmad' }
    rc.should succeed
  end

  it "should pick parameters" do
    router.get '/' do
      accepts :name

      render json: api.parameters
    end

    rc = api_call get '/', {
      name: 'foobar',
      some: 'thing'
    }

    rc.body.should == {
      name: 'foobar'
    }.with_indifferent_access
  end

  it 'should conflict with route parameters' do
    router.post '/chickens/:chicken_id' do
      parameter :chicken_id, type: :string
      render json: api.parameters
    end

    rc = api_call post '/chickens/12', { chicken_id: 'keeek' }
    rc.should succeed(200)
    rc.body[:chicken_id].should == '12'
  end
end