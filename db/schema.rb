# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141227153105) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "access_tokens", force: true do |t|
    t.string   "digest"
    t.string   "udid"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "access_tokens", ["digest"], name: "index_access_tokens_on_digest", unique: true, using: :btree
  add_index "access_tokens", ["udid"], name: "index_access_tokens_on_udid", using: :btree
  add_index "access_tokens", ["user_id"], name: "index_access_tokens_on_user_id", using: :btree

  create_table "notices", force: true do |t|
    t.string   "token"
    t.string   "cause"
    t.boolean  "accepted",   default: false
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "prayers", force: true do |t|
    t.string   "type"
    t.datetime "date"
    t.integer  "score",                      default: 0
    t.boolean  "on_time"
    t.boolean  "in_congregation"
    t.boolean  "in_mosque"
    t.boolean  "with_dhikr"
    t.boolean  "with_sunnah"
    t.boolean  "with_preceding_sunnah"
    t.boolean  "with_full_preceding_sunnah"
    t.boolean  "with_subsequent_sunnah"
    t.boolean  "with_sunnah_on_time"
    t.boolean  "in_last_third"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "prayers", ["user_id", "date", "type"], name: "index_prayers_on_user_id_and_date_and_type", using: :btree

  create_table "users", force: true do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "email"
    t.string   "password"
    t.integer  "link_id"
    t.text     "preferences"
    t.string   "reset_password_token"
    t.boolean  "email_verified"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["provider", "email", "password"], name: "index_users_on_provider_and_email_and_password", unique: true, using: :btree
  add_index "users", ["provider", "email"], name: "index_users_on_provider_and_email", unique: true, using: :btree
  add_index "users", ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true, using: :btree

  add_foreign_key "access_tokens", "users", name: "access_tokens_user_id_fk"

  add_foreign_key "notices", "users", name: "notices_user_id_fk"

  add_foreign_key "prayers", "users", name: "prayers_user_id_fk"

end
