describe AttachmentService do
  let :user do
    valid! fixture(:user)
  end

  let :account do
    user.default_account
  end

  let :attachable do
    valid! fixture :transaction, account
  end

  describe '#create' do
    it 'should create an attachment' do
      svc = subject.create attachable, {
        item: File.open(file_fixture('attachment0.txt'))
      }

      svc.should be_valid
      svc.output.should == attachable.attachments.last
    end

    # it 'should catch an attachment creation error' do
    #   svc = subject.create attachable, {}
    #   svc.should_not be_valid
    # end
  end

  describe '#destroy' do
    it 'should destroy an attachment' do
      attachment = valid! fixture(:attachment, attachable)
      svc = subject.destroy attachment

      svc.error.should be_blank
    end

    it 'should delete the associated file on removal' do
      attachment = valid! fixture :attachment, attachable

      path = attachment.item.path

      svc = subject.destroy attachment
      svc.error.should be_blank

      File.exists?(path).should_not be_true
    end
  end
end