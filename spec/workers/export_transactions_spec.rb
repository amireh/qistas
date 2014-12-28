require 'spec_helper'

describe Workers::ExportTransactions do
  let(:user) { valid! fixture(:user) }
  let(:account) { user.default_account }

  it 'should work' do
    attachment = valid! user.data_exports.create({ tag:  ClientMessage::ExportTransactions })
    attachment.create_progress!

    Pibi::Messenger.should_receive(:publish) do |user_id, message, params|
      user_id.should == user.id
      message.should == ClientMessage::ExportTransactions
      params[:attachment_id].should == "#{attachment.id}"
      params[:progress_id].should == "#{attachment.progress.id}"
      params[:download_url].should match(/test.localhost.*attachments.*csv\?\d+$/)
    end

    subject.class.perform({
      user_id: user.id,
      attachment_id: attachment.id,
      account_ids: [ account.id ]
    }.stringify_keys)

    attachment.reload
    attachment.item.should be_present
    attachment.item.path.should be_present
  end

  it '#generate_filename' do
    from, to = *[Time.new(2014, 5, 16), Time.new(2014, 5, 30)]
    subject.class.generate_filename(from, to, 'csv').should == 'Pibi Transactions 16-05-2014 - 30-05-2014.csv'
  end
end