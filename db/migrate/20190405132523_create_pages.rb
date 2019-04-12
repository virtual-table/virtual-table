class CreatePages < ActiveRecord::Migration[6.0]
  def change
    create_table :pages do |t|
      t.string     :title
      t.string     :type,       default: 'Page'
      t.integer    :position
      t.belongs_to :compendium, foreign_key: true
      t.belongs_to :parent,     foreign_key: { to_table: :pages }
      t.timestamps
    end
  end
end
