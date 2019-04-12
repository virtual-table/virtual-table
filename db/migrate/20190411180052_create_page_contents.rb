class CreatePageContents < ActiveRecord::Migration[6.0]
  def change
    create_table :page_contents do |t|
      t.belongs_to :page,     foreign_key: true
      t.belongs_to :content,  polymorphic: true
      t.integer    :position
      t.boolean    :visible,  default: false
      t.timestamps
    end
  end
end
