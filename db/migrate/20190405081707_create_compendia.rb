class CreateCompendia < ActiveRecord::Migration[6.0]
  def change
    create_table :compendia do |t|
      t.string     :title
      t.boolean    :public, default: false
      t.belongs_to :author, foreign_key: { to_table: :users }
      t.timestamps
    end
  end
end
