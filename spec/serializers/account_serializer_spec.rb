require 'support/serializing_specs'

describe AccountSerializer do
  let :user do
    fixture :user
  end

  let :account do
    user.default_account
  end

  subject { AccountSerializer.new account }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:account][:id].should == "#{account.id}"
    output[:account][:label].should == account.label
    output[:account][:created_at].should == account.created_at
    output[:account][:updated_at].should == account.updated_at
  end

  hypermedia_test -> {
    {
      href: "/users/#{user.id}/accounts/#{account.id}",
      transactions: "/accounts/#{account.id}/transactions",
      recurrings: "/accounts/#{account.id}/recurrings"
    }
  }
end