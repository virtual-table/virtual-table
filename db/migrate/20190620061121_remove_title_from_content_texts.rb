class RemoveTitleFromContentTexts < ActiveRecord::Migration[6.0]
  def change
    Content::Text.find_each do |text|
      if text.title?
        text.update_column :description, "<h1>#{text.title}</h1>#{text.description}"
      end
    end
    
    remove_column :content_texts, :title
  end
end
