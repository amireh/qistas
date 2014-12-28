describe UserSerializer do
  let :user do
    valid! fixture :user
  end

  subject { UserSerializer.new user }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:user][:id].should == "#{user.id}"
    output[:user][:email].should == user.email
    output[:user][:name].should == user.name
    output[:user][:preferences].should == user.preferences
  end

  it 'should include links' do
    slave = fixture :user, json_fixture('user.json').merge({ provider: 'facebook' })
    slave.link_to(user)

    output = subject.as_json.with_indifferent_access
    output[:user][:linked_providers].size.should == 1
    output[:user][:linked_providers].should include('facebook')
  end

  hypermedia_test -> {
    {
      href: "/users/#{user.id}",
      accounts: "/users/#{user.id}/accounts",
      categories: "/users/#{user.id}/categories",
      payment_methods: "/users/#{user.id}/payment_methods",
      journals: "/users/#{user.id}/journals",
      budgets: "/users/#{user.id}/budgets",
      export_transactions: "/exports/transactions",
      reset_password: "/users/reset_password",
      verify_email: "/users/#{user.id}/verify_email",
      cross_account_transactions: "/transactions",
      upcoming_recurrings: '/recurrings/upcoming',
      favorite_budgets: "/users/#{user.id}/budgets/favorites",
    }
  }

  describe 'stringifying ids' do
    it 'should stringify [:id]' do
      output = subject.as_json.with_indifferent_access
      output[:user][:id].should == "#{user.id}"
    end
  end
end