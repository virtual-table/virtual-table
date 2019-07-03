class CreateContentImages < ActiveRecord::Migration[6.0]
  def change
    create_table :content_images do |t|
      t.string :alt_text
      t.text :caption

      t.timestamps
    end
  end
end
