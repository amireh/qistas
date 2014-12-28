describe TransactionSerializer do
  let :account do
    valid! fixture(:user).default_account
  end

  let :payment_method do
    valid! fixture(:payment_method, account.user)
  end

  let :transaction do
    valid! fixture :transaction, account, {
      payment_method_id: payment_method.id
    }
  end

  subject { TransactionSerializer.new transaction }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:transaction][:id].should == "#{transaction.id}"
    output[:transaction][:note].should == transaction.note
    output[:transaction][:amount].should == transaction.amount
    output[:transaction][:currency].should == transaction.currency
    output[:transaction][:currency_rate].should == transaction.currency_rate
    output[:transaction][:occurred_on].should == transaction.occurred_on
    output[:transaction][:splits].should == transaction.splits
  end

  hypermedia_test -> {
    {
      href: "/accounts/#{account.id}/transactions/#{transaction.id}",
    }
  }
end