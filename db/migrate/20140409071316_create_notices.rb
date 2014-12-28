class CreateNotices < ActiveRecord::Migration
  def change
    create_table :notices do |t|
      t.string :token
      t.string :cause
      t.boolean :accepted, default: false
      t.references :user
      t.foreign_key :users

      t.timestamps
    end
  end
end
