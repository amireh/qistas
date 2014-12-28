require 'support/serializing_specs'

describe AttachmentSerializer do
  let :user do
    fixture :user
  end

  let :attachable do
    valid! fixture(:transaction, user.default_account)
  end

  let :attachment do
    attachment = valid! fixture :attachment, attachable
    attachment.create_progress!
    attachment
  end

  subject { AttachmentSerializer.new attachment }

  it 'should render' do
    output = subject.as_json.with_indifferent_access

    output[:attachment][:id].should == "#{attachment.id}"
    output[:attachment][:file_name].should == attachment.item_file_name
    output[:attachment][:file_size].should == attachment.item_file_size
    output[:attachment][:created_at].should == attachment.created_at
  end

  hypermedia_test -> {
    {
      href: "/attachments/#{attachment.id}",
      item: attachment.item.url(attachment.item.default_style, timestamp: false)
    }
  }
end