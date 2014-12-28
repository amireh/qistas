describe JournalSerializer do
  let :user do
    fixture :user
  end

  let :journal do
    user.journals.new({ records: [] }).tap do |journal|
      journal.id = 1
      journal.commit
      journal.save
    end
  end

  subject { JournalSerializer.new journal }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:processed].should == []
    output[:dropped].should == []
  end

  hypermedia_test -> {
    {
      href: "/users/#{user.id}/journals/#{journal.id}",
      user: "/users/#{user.id}"
    }
  }
end