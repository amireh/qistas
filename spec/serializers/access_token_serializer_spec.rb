require 'support/serializing_specs'

describe AccessTokenSerializer do
  let :user do
    fixture :user
  end

  let :access_token do
    user.access_tokens.create({ udid: 'helloWorld' })
  end

  subject { AccessTokenSerializer.new access_token }

  it 'should render' do
    output = subject.as_json.with_indifferent_access
    output[:access_token][:udid].should == access_token.udid
    output[:access_token][:digest].should == access_token.digest
  end
end