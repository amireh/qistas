describe RecurringSerializer do
  let :user do
    valid! fixture(:user)
  end

  let :account do
    user.default_account
  end

  let :payment_method do
    valid! fixture :payment_method, user
  end

  let :recurring do
    valid! fixture :recurring, account, json_fixture('recurring_daily.json').merge({
      payment_method_id: payment_method.id
    })
  end

  subject { RecurringSerializer.new recurring }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:recurring][:id].should == "#{recurring.id}"
    output[:recurring][:name].should == recurring.name
    output[:recurring][:amount].should == recurring.amount
    output[:recurring][:flow_type].should == recurring.flow_type
    output[:recurring][:active].should == recurring.active
    output[:recurring][:frequency].should == recurring.frequency
    output[:recurring][:every].should == recurring.every
    output[:recurring][:weekly_days].should == recurring.weekly_days
    output[:recurring][:monthly_days].should == recurring.monthly_days
    output[:recurring][:yearly_months].should == recurring.yearly_months
    output[:recurring][:yearly_day].should == recurring.yearly_day
    output[:recurring][:currency].should == recurring.currency
    output[:recurring][:created_at].should == recurring.created_at
    output[:recurring][:updated_at].should == recurring.updated_at
    output[:recurring][:payment_method_id].should == "#{recurring.payment_method_id}"
    output[:recurring][:account_id].should == "#{recurring.account_id}"
    output[:recurring][:category_ids].should == recurring.categories.map(&:id).map(&:to_s)
    output[:recurring][:attachments].map { |a| a[:id] }.should == recurring.attachments.map(&:id).map(&:to_s)
  end

  hypermedia_test -> {
    {
      href: "/accounts/#{account.id}/recurrings/#{recurring.id}",
    }
  }
end