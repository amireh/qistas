class CreateAccessTokens < ActiveRecord::Migration
  def change
    create_table :access_tokens do |t|
      t.string :digest
      t.string :udid
      t.integer :user_id

      t.timestamps

      t.index :digest, unique: true
      t.index :udid, unique: false
      t.index :user_id, unique: false
      t.foreign_key :users
    end
  end
end
