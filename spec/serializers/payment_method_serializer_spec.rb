describe PaymentMethodSerializer do
  let :user do
    fixture :user
  end

  let :payment_method do
    valid! fixture :payment_method, user
  end

  subject { PaymentMethodSerializer.new payment_method }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:payment_method][:id].should == "#{payment_method.id}"
    output[:payment_method][:name].should == payment_method.name
    output[:payment_method][:color].should == payment_method.color
    output[:payment_method][:default].should == payment_method.default
  end

  hypermedia_test -> {
    {
      href: "/users/#{user.id}/payment_methods/#{payment_method.id}",
    }
  }
end