class CreateMaps < ActiveRecord::Migration[6.0]
  def change
    create_table :maps do |t|
      t.belongs_to :game, index: true, foreign_key: true
      t.string :title
      t.timestamps
    end
  end
end
