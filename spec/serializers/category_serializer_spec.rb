describe CategorySerializer do
  let :user do
    fixture :user
  end

  let :category do
    valid! fixture(:category, user)
  end

  subject { CategorySerializer.new category }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:category][:id].should == "#{category.id}"
    output[:category][:name].should == category.name
    output[:category][:icon].should == category.icon
    output[:category][:created_at].should == category.created_at
    output[:category][:updated_at].should == category.updated_at
  end

  hypermedia_test -> {
    {
      href: "/users/#{user.id}/categories/#{category.id}"
    }
  }

  describe 'stringifying ids' do
    it 'should stringify [:id]' do
      output = subject.as_json.with_indifferent_access
      output[:category][:id].should == "#{category.id}"
    end
  end
end