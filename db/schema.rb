# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_18_111609) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "chat_messages", force: :cascade do |t|
    t.bigint "session_id", null: false
    t.bigint "author_id"
    t.text "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_id"], name: "index_chat_messages_on_author_id"
    t.index ["session_id"], name: "index_chat_messages_on_session_id"
  end

  create_table "compendia", force: :cascade do |t|
    t.string "title"
    t.boolean "public", default: false
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "description"
    t.index ["author_id"], name: "index_compendia_on_author_id"
  end

  create_table "content_images", force: :cascade do |t|
    t.string "alt_text"
    t.text "caption"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "content_texts", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "description"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at", precision: 6
    t.datetime "updated_at", precision: 6
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "game_compendia", force: :cascade do |t|
    t.bigint "game_id", null: false
    t.bigint "compendium_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["compendium_id"], name: "index_game_compendia_on_compendium_id"
    t.index ["game_id"], name: "index_game_compendia_on_game_id"
  end

  create_table "game_sessions", force: :cascade do |t|
    t.bigint "author_id", null: false
    t.bigint "game_id", null: false
    t.text "subject"
    t.string "mode"
    t.string "current_context_type"
    t.bigint "current_context_id"
    t.bigint "current_map_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_id"], name: "game_session_author"
    t.index ["current_context_type", "current_context_id"], name: "game_session_context"
    t.index ["current_map_id"], name: "game_session_map"
    t.index ["game_id"], name: "game_session_game"
  end

  create_table "games", force: :cascade do |t|
    t.string "title"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "description"
    t.string "invite_code"
    t.index ["author_id"], name: "index_games_on_author_id"
  end

  create_table "map_area_pages", force: :cascade do |t|
    t.bigint "area_id"
    t.bigint "page_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["area_id"], name: "index_map_area_pages_on_area_id"
    t.index ["page_id"], name: "index_map_area_pages_on_page_id"
  end

  create_table "map_areas", force: :cascade do |t|
    t.bigint "floor_id"
    t.string "short_code"
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "bounds"
    t.integer "x", default: 0, null: false
    t.integer "y", default: 0, null: false
    t.integer "z", default: 0, null: false
    t.index ["floor_id"], name: "index_map_areas_on_floor_id"
  end

  create_table "map_backgrounds", force: :cascade do |t|
    t.bigint "floor_id"
    t.boolean "visible", default: true
    t.integer "width"
    t.integer "height"
    t.integer "x", default: 0
    t.integer "y", default: 0
    t.integer "z", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["floor_id"], name: "index_map_backgrounds_on_floor_id"
  end

  create_table "map_characters", force: :cascade do |t|
    t.string "name"
    t.bigint "floor_id"
    t.boolean "visible", default: true
    t.integer "width"
    t.integer "height"
    t.integer "x", default: 0
    t.integer "y", default: 0
    t.integer "z", default: 0
    t.integer "light_radius", default: 20
    t.integer "dim_light_radius", default: 40
    t.integer "light_angle", default: 360
    t.integer "line_of_sight_angle", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "light_color", default: "#fffcbb"
    t.index ["floor_id"], name: "index_map_characters_on_floor_id"
  end

  create_table "map_doors", force: :cascade do |t|
    t.integer "origin_x"
    t.integer "origin_y"
    t.integer "destination_x"
    t.integer "destination_y"
    t.boolean "closed", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "floor_id"
    t.index ["floor_id"], name: "index_map_doors_on_floor_id"
  end

  create_table "map_floors", force: :cascade do |t|
    t.bigint "map_id"
    t.string "title"
    t.integer "columns", default: 30
    t.integer "rows", default: 24
    t.integer "scale", default: 5
    t.integer "scale_unit"
    t.string "background_color", default: "#ffffff"
    t.boolean "grid", default: true
    t.string "grid_color", default: "#c0c0c0"
    t.float "grid_opacity", default: 0.5
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "level", default: 0
    t.boolean "global_illumination", default: true
    t.string "grid_type", default: "square"
    t.bigint "page_id"
    t.index ["map_id"], name: "index_map_floors_on_map_id"
    t.index ["page_id"], name: "index_map_floors_on_page_id"
  end

  create_table "map_walls", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "path"
    t.bigint "floor_id"
    t.index ["floor_id"], name: "index_map_walls_on_floor_id"
  end

  create_table "maps", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "page_id"
    t.bigint "compendium_id"
    t.index ["compendium_id"], name: "index_maps_on_compendium_id"
    t.index ["page_id"], name: "index_maps_on_page_id"
  end

  create_table "page_contents", force: :cascade do |t|
    t.bigint "page_id"
    t.string "content_type"
    t.bigint "content_id"
    t.integer "position"
    t.boolean "visible", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["content_type", "content_id"], name: "index_page_contents_on_content_type_and_content_id"
    t.index ["page_id"], name: "index_page_contents_on_page_id"
  end

  create_table "pages", force: :cascade do |t|
    t.string "title"
    t.string "type", default: "Page"
    t.integer "position"
    t.bigint "compendium_id"
    t.bigint "parent_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["compendium_id"], name: "index_pages_on_compendium_id"
    t.index ["parent_id"], name: "index_pages_on_parent_id"
  end

  create_table "players", force: :cascade do |t|
    t.bigint "game_id"
    t.bigint "user_id"
    t.string "role"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "session_id"
    t.index ["game_id"], name: "index_players_on_game_id"
    t.index ["session_id"], name: "index_players_on_session_id"
    t.index ["user_id"], name: "index_players_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "roles", array: true
    t.string "reset_token"
    t.datetime "reset_send_at"
    t.string "activation_digest"
    t.boolean "activated", default: false
    t.datetime "activated_at"
    t.datetime "activation_send_at"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "chat_messages", "game_sessions", column: "session_id"
  add_foreign_key "chat_messages", "users", column: "author_id"
  add_foreign_key "compendia", "users", column: "author_id"
  add_foreign_key "game_compendia", "compendia"
  add_foreign_key "game_compendia", "games"
  add_foreign_key "game_sessions", "games"
  add_foreign_key "game_sessions", "maps", column: "current_map_id"
  add_foreign_key "game_sessions", "users", column: "author_id"
  add_foreign_key "games", "users", column: "author_id"
  add_foreign_key "map_area_pages", "map_areas", column: "area_id"
  add_foreign_key "map_areas", "map_floors", column: "floor_id"
  add_foreign_key "map_backgrounds", "map_floors", column: "floor_id"
  add_foreign_key "map_characters", "map_floors", column: "floor_id"
  add_foreign_key "map_doors", "map_floors", column: "floor_id"
  add_foreign_key "map_floors", "maps"
  add_foreign_key "map_floors", "pages"
  add_foreign_key "map_walls", "map_floors", column: "floor_id"
  add_foreign_key "maps", "compendia"
  add_foreign_key "maps", "pages"
  add_foreign_key "page_contents", "pages"
  add_foreign_key "pages", "compendia"
  add_foreign_key "pages", "pages", column: "parent_id"
  add_foreign_key "players", "game_sessions", column: "session_id"
  add_foreign_key "players", "games"
  add_foreign_key "players", "users"
end
