describe JournalService do

  context "Validation" do
    let :user do
      User.new(json_fixture('user.json').merge({ id: 10 }))
    end

    before :each do
      Journal.any_instance.stub(:save).and_return do |instance|
        journal = user.journals.last

        if journal.present? && journal.valid?
          journal.id = user.journals.length + 1
          journal.user = user
          true
        else
          false
        end
      end
    end

    it "bad record set" do
      svc = subject.create user, 123
      svc.should_not be_valid
      svc.error[:records].first.should match /Record listing must be of type Array/
    end

    it "bad record" do
      svc = subject.create user, [ [] ]
      svc.should_not be_valid
      svc.error[:records].first.should match /Record must be of type Hash/
    end

    it "bad scope" do
      records = [{
        path: "/foobar/#{user.id}/hello"
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /unknown scope/i
    end

    it "bad scope identifier" do
      records = [{
        path: '/users/asdf/accounts'
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /no such resource/i
    end

    it "bad collection" do
      User.should_receive(:find_by_id).with("#{user.id}").and_return(user)

      records = [{
        path: "/users/#{user.id}/hello",
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /no such collection/i
    end

    it "bad operations" do
      records = [{
        path: "/users/#{user.id}/accounts",
        operations: []
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /operations must be of type hash/i
    end

    it "an unknown operation" do
      records = [{
        path: "/users/#{user.id}/accounts",
        operations: {
          foobar: []
        }
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /unrecognized operation/i
    end

    it "bad operation entries" do
      records = [{
        path: "/users/#{user.id}/accounts",
        operations: {
          create: {}
        }
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /operation entries must be of type Array/i
    end

    it "a bad operation entry" do
      records = [{
        path: "/users/#{user.id}/accounts",
        operations: {
          create: [ true ]
        }
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /operation entry must be of type Hash/i
    end

    it "an operation entry missing a required key" do
      # User.should_receive(:find_by_id).with(user.id).and_return(user)
      records = [{
        path: "/users/#{user.id}/accounts",
        operations: {
          create: [{
          }]
        }
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /operation entry is missing required key: id/i
    end

    it "a bad operation entry data" do
      records = [{
        path: "/users/#{user.id}/accounts",

        operations: {
          create: [{
            id: 1,
            data: []
          }]
        }
      }]

      svc = subject.create user, records
      svc.should_not be_valid
      svc.error[:records].first.should match /operation entry data must be of type Hash/i
    end
  end

  context 'Committing' do
    let :user do
      valid! fixture(:user)
    end

    let :account do
      user.accounts.first
    end

    def get(set, path)
      @journal.output.send(set).detect { |e| e[:path] == path }.tap do |entry|
        entry.should be_present, <<-MSG
          Expected an entry with path #{path} to exist in the #{set} set.

          Records: #{@journal.output.to_json}
        MSG
      end
    end

    def compare(a, b)
      a.to_json.should == b.to_json
    end

    def assert_empty(set)
      @journal.output.send(set).should == []
    end

    def assert_entry(set, path, value)
      compare(get(set, path).except(:path), value)
    end

    def assert_shadow(path, shadow_id, resource_id)
      entry = get(:processed, path)[:operations][:create]
      entry.detect { |resource| resource[:id] == "#{resource_id}" }.tap do |resource_entry|
        resource_entry.should be_present, <<-MSG
          Expected shadowed resource at #{path} to be mapped from #{shadow_id}
          to #{resource_id}.

          Records: #{@journal.output.to_json}
        MSG

        resource_entry[:shadow_id].should == shadow_id if shadow_id.present?
      end
    end

    def assert_create(set, path, options)
      id, shadow_id = options[:id], options[:shadow_id]

      entry = get(set, path)[:operations][:create]
      entry.detect do |resource|
        resource[:id] == id || resource[:shadow_id] == shadow_id
      end.tap do |resource_entry|
        resource_entry.should be_present
        resource_entry[:id].should == id if id.present?
        resource_entry[:shadow_id].should == shadow_id if shadow_id.present?

        if options[:error].present?
          assert_has_error(resource_entry, options[:error])
        end
      end
    end

    def assert_update(set, path, options)
      id = options[:id]

      entries = get(set, path)[:operations][:update]
      entries.detect { |resource| resource[:id] == "#{id}" }.tap do |resource_entry|
        resource_entry.should be_present

        if set == :dropped && options[:error]
          assert_has_error(resource_entry, options[:error])
        end
      end
    end

    def assert_delete(set, path, options)
      id, error = options[:id], options[:error]

      entries = get(set, path)[:operations][:delete]
      entries.detect { |resource| resource[:id] == "#{id}" }.tap do |resource_entry|
        resource_entry.should be_present

        if set == :dropped && error.present?
          assert_has_error(resource_entry, options[:error])
        end
      end
    end

    def assert_has_error(entry, error)
      entry.as_json['error'].tap do |journal_error|
        if error.is_a?(String)
          journal_error.should have_key('messages')
          journal_error['messages'][0].should match(error)
        else
          journal_error.should == error.as_json
        end
      end
    end

    # track the service's output (the journal) in @journal for helpers
    before do
      original_create = subject.method(:create)
      subject.stub(:create) { |*args|
        original_create.call(*args).tap do |svc|
          @journal = svc.output
        end
      }
    end

    it "does nothing" do
      svc = subject.create user, []
      svc.should be_valid
    end

    it 'drops entries for resources I do not have access to' do
      other_user = valid! fixture(:user, { email: 'someone@else.com' })
      category = valid! fixture(:category, other_user, { name: 'Food' })
      payment_method = valid! fixture(:payment_method, other_user)

      svc = subject.create user, [{
        path: "/users/#{other_user.id}/categories",
        operations: {
          create: [{
            id: 'c1234',
            data: {
              name: 'Foo'
            }
          }],
          update: [{
            id: category.id,
            data: {
              name: 'Disco'
            }
          }]
        }
      }, {
        path: "/users/#{other_user.id}/payment_methods",
        operations: {
          delete: [{
            id: payment_method.id
          }]
        }
      }]

      svc.should be_valid

      assert_create :dropped, "/users/#{other_user.id}/categories", {
        id: 'c1234',
        error: Journal::EC_UNAUTHORIZED
      }

      assert_update :dropped, "/users/#{other_user.id}/categories", {
        id: category.id,
        error: Journal::EC_UNAUTHORIZED
      }

      assert_delete :dropped, "/users/#{other_user.id}/payment_methods", {
        id: payment_method.id,
        error: Journal::EC_UNAUTHORIZED
      }

      other_user.categories.find_by(name: 'Foo').should == nil
      category.reload.name.should == 'Food'
      expect { payment_method.reload }.not_to raise_error(ActiveRecord::RecordNotFound)
    end

    context 'User journalling' do
      it 'should not create a user' do
        svc = subject.create user, [{
          path: '/users',
          operations: {
            create: [{
              id: 'c1234',
              data: {
                name: "Kaboom"
              }
            }]
          }
        }]

        svc.should_not be_valid
        svc.error[:records].first.should match(
          /do not support the operation create/i
        )
      end

      it 'should update a user' do
        svc = subject.create user, [{
          path: "/users",
          operations: {
            update: [{
              id: user.id,
              data: {
                name: 'Kaboom'
              }
            }]
          }
        }]

        svc.should be_valid

        assert_empty :dropped
        assert_entry :processed, "/users", {
          operations: {
            update: [{ id: "#{user.id}" }]
          }
        }

        user.reload.name.should == 'Kaboom'
      end

      it 'should update a user preference' do
        svc = subject.create user, [{
          path: "/users",
          "operations" => {
            "create" => [],
            "update" => [{
                "id" => user.id,
                "data" => {
                  "preferences" => {
                    "theme" => "saucywood"
                  }
                }
              }],
            "delete" => []
          }
        }]

        svc.should be_valid

        assert_empty :dropped
        assert_entry :processed, "/users", {
          operations: {
            update: [{ id: "#{user.id}" }]
          }
        }

        user.reload.preferences.fetch(:theme).should == 'saucywood'
      end
    end

    context 'Account journalling' do
      it 'should create an account' do
        svc = subject.create user, [{
          path: "/users/#{user.id}/accounts",
          operations: {
            create: [{
              id: 'c1234',
              data: {
                label: 'Household'
              }
            }]
          }
        }]

        svc.should_not be_valid
        svc.error[:records].first.should match(
          /do not support the operation create/i
        )
      end

      it 'should update an account' do
        svc = subject.create user, [{
          path: "/users/#{user.id}/accounts",
          operations: {
            update: [{
              id: account.id,
              data: {
                label: 'The Bananas In Pijamas'
              }
            }]
          }
        }]
        svc.should be_valid

        assert_empty :dropped
        assert_entry :processed, "/users/#{user.id}/accounts", {
          operations: {
            update: [{ id: "#{account.id}" }]
          }
        }

        account.reload.label.should == 'The Bananas In Pijamas'
      end

      it 'should catch an updating error' do
        svc = subject.create user, [{
          path: "/users/#{user.id}/accounts",
          operations: {
            update: [{
              id: account.id,
              data: {
                label: nil
              }
            }]
          }
        }]
        svc.should be_valid

        assert_empty :processed
        assert_update :dropped, "/users/#{user.id}/accounts", {
          id: "#{account.id}",
          error: '[ACC_MISSING_LABEL]'
        }
      end

      it 'should delete an account' do
        records = [{
          path: "/users/#{user.id}/accounts",
          operations: {
            delete: [{
              id: account.id
            }]
          }
        }]

        svc = subject.create user, records
        svc.should_not be_valid
        svc.error[:records].first.should match(
          /do not support the operation delete/i
        )
      end
    end

    context 'Category journalling' do
      it 'should create a user category' do
        svc = subject.create user, [{
          path: "/users/#{user.id}/categories",
          operations: {
            create: [{
              id: 'c1234',
              data: {
                name: 'Household',
                icon: 'house'
              }
            }]
          }
        }]

        svc.should be_valid

        assert_empty :dropped
        assert_create :processed, "/users/#{user.id}/categories", {
          shadow_id: 'c1234'
        }

        category = user.categories.find_by({ name: 'Household' })
        category.should be_present

        assert_shadow "/users/#{user.id}/categories", 'c1234', category.id
      end

      it 'should update a user category' do
        category = valid! fixture :category, user

        svc = subject.create user, [{
          path: "/users/#{user.id}/categories",
          operations: {
            update: [{
              id: category.id,
              data: {
                name: 'The Bananas In Pijamas'
              }
            }]
          }
        }]

        svc.should be_valid

        assert_update :processed, "/users/#{user.id}/categories", {
          id: category.id
        }

        category.reload
        category.name.should == 'The Bananas In Pijamas'
      end

      it 'should delete a user category' do
        category = valid! fixture :category, user

        svc = subject.create user, [{
          path: "/users/#{user.id}/categories",
          operations: {
            delete: [{
              id: category.id
            }]
          }
        }]

        svc.should be_valid

        assert_empty :dropped
        assert_delete :processed, "/users/#{user.id}/categories", {
          id: category.id
        }

        expect { category.reload }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'PaymentMethod journalling' do
      it 'should create a user payment_method' do
        svc = subject.create user, [{
          path: "/users/#{user.id}/payment_methods",
          operations: {
            create: [{
              id: 'c1234',
              data: {
                name: 'Household',
                color: '00ff00'
              }
            }]
          }
        }]

        svc.should be_valid

        assert_empty :dropped
        assert_create :processed, "/users/#{user.id}/payment_methods", {
          shadow_id: 'c1234'
        }

        payment_method = user.payment_methods.find_by({ name: 'Household' })
        payment_method.should be_present

        assert_shadow "/users/#{user.id}/payment_methods", 'c1234', payment_method.id
      end

      it 'should update a user payment_method' do
        payment_method = valid! fixture :payment_method, user

        svc = subject.create user, [{
          path: "/users/#{user.id}/payment_methods",
          operations: {
            update: [{
              id: payment_method.id,
              data: {
                name: 'The Bananas In Pijamas'
              }
            }]
          }
        }]
        svc.should be_valid

        assert_empty :dropped
        assert_update :processed, "/users/#{user.id}/payment_methods", {
          id: payment_method.id
        }

        payment_method.reload
        payment_method.name.should == 'The Bananas In Pijamas'
      end

      it 'should delete a user payment_method' do
        payment_method = valid! fixture :payment_method, user

        svc = subject.create user, [{
          path: "/users/#{user.id}/payment_methods",
          operations: {
            delete: [{
              id: payment_method.id
            }]
          }
        }]

        svc.should be_valid

        assert_empty :dropped
        assert_delete :processed, "/users/#{user.id}/payment_methods", {
          id: payment_method.id
        }

        expect { payment_method.reload }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'Transaction journalling' do
      let :account do
        user.default_account
      end

      it 'should create an account transaction' do
        records = [{
          path: "/accounts/#{account.id}/transactions",
          operations: {
            create: [{
              "id" => 'c1234',
              "data" => {
                "type" => "expense",
                "amount" => 15.0
              }
            }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_empty :dropped
        assert_create :processed, "/accounts/#{account.id}/transactions", {
          shadow_id: 'c1234'
        }

        transaction = account.transactions.last
        transaction.should be_present

        assert_shadow "/accounts/#{account.id}/transactions", 'c1234', transaction.id
      end

      it 'should report a creation error' do
        records = [{
          path: "/accounts/#{account.id}/transactions",

          operations: {
            create: [{
              id: 'c1234',
              data: {
                type: 'foobar',
                amount: 15.0
              }
            }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_empty :processed
        assert_create :dropped, "/accounts/#{account.id}/transactions", {
          id: 'c1234',
          error: 'Unrecognized transaction type.'
        }
      end

      it 'should update a transaction' do
        transaction = valid! fixture :transaction, account

        records = [{
          path: "/accounts/#{account.id}/transactions",

          operations: {
            update: [{
              id: transaction.id,
              data: {
                amount: 25.0
              }
            }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_empty :dropped
        assert_update :processed, "/accounts/#{account.id}/transactions", {
          id: transaction.id
        }

        transaction.reload
        transaction.amount.should == 25.0
      end

      it 'should report an updating error' do
        transaction = valid! fixture :transaction, account

        records = [{
          path: "/accounts/#{account.id}/transactions",

          operations: {
            update: [{
              id: transaction.id,
              data: {
                amount: -1
              }
            }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_empty :processed
        assert_update :dropped, "/accounts/#{account.id}/transactions", {
          id: transaction.id,
          error: '[TX:BAD_AMOUNT]'
        }
      end

      it 'should delete a transaction' do
        transaction = valid! fixture :transaction, account

        records = [{
          path: "/accounts/#{account.id}/transactions",

          operations: {
            delete: [{
              id: transaction.id
            }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_empty :dropped
        assert_delete :processed, "/accounts/#{account.id}/transactions", {
          id: transaction.id
        }

        expect { transaction.reload }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it 'should drop deleting a non-existent transaction' do
        records = [{
          path: "/accounts/#{account.id}/transactions",

          operations: {
            delete: [{
              id: 'foobar'
            }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_empty :processed
        assert_delete :dropped, "/accounts/#{account.id}/transactions", {
          id: 'foobar',
          error: Journal::EC_RESOURCE_NOT_FOUND
        }
      end

      it 'should delete a transaction only once' do
        transaction = valid! fixture :transaction, account
        records = [{
          path: "/accounts/#{account.id}/transactions",

          operations: {
            delete: [{ id: transaction.id }, { id: transaction.id }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_delete :processed, "/accounts/#{account.id}/transactions", {
          id: transaction.id
        }

        assert_delete :dropped, "/accounts/#{account.id}/transactions", {
          id: transaction.id,
          error: Journal::EC_RESOURCE_NOT_FOUND
        }
      end
    end

    context 'Mixed' do
      it 'should update a user, a category, and a transaction' do
        records = [
          {
            path: "/users/#{user.id}/accounts/#{account.id}/transactions",
            operations: {
              create: [{
                id: 'c1234',
                data: {
                  type: 'expense',
                  amount: 15.0,
                  category_ids: [ 'c111' ]
                }
              }, {
                id: 'c5555',
                data: {
                  type: 'income',
                  amount: 20,
                  category_ids: [ 'c111' ]
                }
              }]
            }
          }, {
            path: "/users",
            operations: {
              update: [{
                id: user.id,
                data: {
                  name: 'Kaboom'
                }
              }]
            }
          }, {
            path: "/users/#{user.id}/categories",
            operations: {
              create: [{
                id: 'c111',
                data: {
                  name: 'Test Category'
                }
              }]
            }
          }
        ]

        svc = subject.create user, records
        svc.should be_valid

        assert_empty :dropped

        assert_update :processed, "/users", { id: user.id }
        assert_create :processed, "/users/#{user.id}/categories", {
          shadow_id: 'c111'
        }

        assert_create :processed, "/users/#{user.id}/accounts/#{account.id}/transactions", {
          shadow_id: 'c1234'
        }
        assert_create :processed, "/users/#{user.id}/accounts/#{account.id}/transactions", {
          shadow_id: 'c5555'
        }

        user.reload
        user.name.should == 'Kaboom'

        category = user.categories.find_by(name: 'Test Category')
        category.should be_present

        assert_shadow "/users/#{user.id}/categories", 'c111', category.id

        expense = account.expenses.first
        expense.should be_present
        assert_shadow "/users/#{user.id}/accounts/#{account.id}/transactions", 'c1234', expense.id

        income = account.incomes.first
        income.should be_present
        assert_shadow "/users/#{user.id}/accounts/#{account.id}/transactions", 'c5555', income.id

        expense.categories.map(&:id).should == [ category.id ]
        income.categories.map(&:id).should == [ category.id ]
        category.transactions.map(&:id).should include(income.id)
        category.transactions.map(&:id).should include(expense.id)
        category.transactions.length.should == 2
      end

      it 'should drop a record that references an invalid resource' do
        records = [{
          path: "/users/#{user.id}/accounts/#{account.id}/transactions",
          operations: {
            create: [{
              id: 'c1',
              data: {
                amount: 10,
                category_ids: [ 'b1' ]
              }
            }]
          }
        }, {
          path: "/users/#{user.id}/categories",
          operations: {
            create: [{
              id: 'b1',
              data: {}
            }]
          }
        }]

        svc = subject.create user, records
        svc.should be_valid

        assert_create :dropped, "/users/#{user.id}/categories", {
          id: 'b1',
          error: {
            status: 'error',
            messages: [
              '[CGRY_MISSING_NAME] You must provide a name for the category!',
              '[CGRY_NAME_TOO_SHORT] A category must be at least 3 characters long.'
            ],
            field_errors: {
              name: [
                '[CGRY_MISSING_NAME] You must provide a name for the category!',
                '[CGRY_NAME_TOO_SHORT] A category must be at least 3 characters long.'
              ]
            }
          }
        }

        assert_create :dropped, "/users/#{user.id}/accounts/#{account.id}/transactions", {
          id: 'c1',
          error: Journal::EC_REFERENCE_NOT_FOUND
        }
      end
    end
  end
end