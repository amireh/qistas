class CreatePrayers < ActiveRecord::Migration
  def change
    create_table :prayers do |t|
      t.string :type
      t.datetime :date
      t.integer :score, default: 0

      t.boolean :on_time
      t.boolean :in_congregation
      t.boolean :in_mosque
      t.boolean :with_dhikr
      t.boolean :with_sunnah
      t.boolean :with_preceding_sunnah
      t.boolean :with_full_preceding_sunnah
      t.boolean :with_subsequent_sunnah
      t.boolean :with_sunnah_on_time
      t.boolean :in_last_third

      t.references :user
      t.foreign_key :users
      t.index [ :user_id, :date, :type ]

      t.timestamps
    end
  end
end
