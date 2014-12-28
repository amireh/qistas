require 'spec_helper'

describe AccessToken do
  before do
    # Fixtures.teardown
    @user = valid! fixture(:user)
  end

  after do
    @user.access_tokens.destroy
  end

  it 'should be created' do
    access_token = valid! @user.access_tokens.create({
      udid: UUID.generate
    })

    access_token.digest.should_not be_empty
  end

  it 'should be unique' do
    valid! @user.access_tokens.create({
      udid: '1234',
      digest: 'foobar'
    })

    invalid! @user.access_tokens.create({
      udid: '1234',
      digest: 'foobar'
    })
  end

  it 'should be unique per UDID' do
    udid = UUID.generate

    valid! @user.access_tokens.create({ udid: udid })
    invalid! token = @user.access_tokens.create({ udid: udid })

    token.error_messages.first.should match /already bound/
  end
end
