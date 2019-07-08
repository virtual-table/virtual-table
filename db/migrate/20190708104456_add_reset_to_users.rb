class AddResetToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :reset_token,   :string
    add_column :users, :reset_send_at, :datetime
  end
end
