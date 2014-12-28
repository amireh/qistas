class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :provider
      t.string :uid
      t.string :name
      t.string :email
      t.string :password
      t.integer :link_id, index: true, allow_nil: true
      t.text :preferences
      t.string :reset_password_token
      t.boolean :email_verified

      t.timestamps

      t.index [ :provider, :email, :password ], unique: true
      t.index [ :provider, :uid ], unique: true
      t.index [ :provider, :email ], unique: true
    end
  end
end
