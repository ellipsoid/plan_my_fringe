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

ActiveRecord::Schema.define(version: 20130802013240) do

  create_table "showings", force: true do |t|
    t.integer  "show_id"
    t.integer  "time_slot_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "showings", ["id"], name: "index_showings_on_id"
  add_index "showings", ["show_id"], name: "index_showings_on_show_id"
  add_index "showings", ["time_slot_id"], name: "index_showings_on_time_slot_id"

  create_table "shows", force: true do |t|
    t.string   "title"
    t.integer  "venue_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "shows", ["id"], name: "index_shows_on_id"
  add_index "shows", ["venue_id"], name: "index_shows_on_venue_id"

  create_table "time_slots", force: true do |t|
    t.datetime "datetime"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "time_slots", ["id"], name: "index_time_slots_on_id"

  create_table "venues", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "venues", ["id"], name: "index_venues_on_id"

end
