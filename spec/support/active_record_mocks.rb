# Courtesy of Jordon Bedwell:
#
# https://envygeeks.com/blog/mocking-activerecord-to-test-concerns
module RSpec
  module Helpers
    module ActiveRecordMocks
      def mock_active_record_model(name, &block)
        create_temp_table(name, &block)

        Object.const_set("#{name}".camelize, Class.new(ActiveRecord::Base)).class_eval do
          self.table_name = "__#{name}"
        end
      end

      def create_temp_table(table, &block)
        ActiveRecord::Migration.suppress_messages do
          ActiveRecord::Migration.create_table "__#{table}", :temporary => true do |t|
            block.call(t)
          end
        end

        after :all do
          ActiveRecord::Migration.suppress_messages do
            ActiveRecord::Migration.drop_table "__#{table}"
          end
        end
      end
    end
  end
end

RSpec.configure do |config|
  config.extend RSpec::Helpers::ActiveRecordMocks
end