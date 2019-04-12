class CreateContentTexts < ActiveRecord::Migration[6.0]
  def change
    create_table :content_texts do |t|
      t.string :title

      t.timestamps
    end
  end
end
