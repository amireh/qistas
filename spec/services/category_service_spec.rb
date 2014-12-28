describe CategoryService do
  let :user do
    valid! fixture(:user)
  end

  before do
    user.categories.destroy
  end

  describe '#create' do
    it 'should create a category' do
      svc = subject.create user, json_fixture('category.json')
      svc.should be_valid
      svc.output.should == user.categories.last
    end

    it 'should catch a category creation error' do
      svc = subject.create user, { name: 'fo' }
      svc.should_not be_valid
    end
  end

  describe '#update' do
    let :category do
      valid! fixture(:category, user)
    end

    it 'should update a category' do
      svc = subject.update category, {
        name: 'Test Category'
      }

      svc.error.should be_blank
      category.name.should == 'Test Category'
    end

    it 'should report errors' do
      svc = subject.update category, {
        name: ''
      }

      svc.should_not be_valid
      svc.error.should_not be_blank
    end
  end

  describe '#destroy' do
    it 'should destroy a category' do
      category = valid! fixture(:category, user)
      svc = subject.destroy category

      svc.error.should be_blank
    end
  end
end