class CreateChatMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_messages do |t|
      t.belongs_to :session, null: false, foreign_key: { to_table: 'game_sessions' }
      t.belongs_to :author,  null: true,  foreign_key: { to_table: 'users' }
      t.text :body
      t.timestamps
    end
  end
end
