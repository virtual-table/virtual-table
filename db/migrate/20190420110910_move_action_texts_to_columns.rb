class MoveActionTextsToColumns < ActiveRecord::Migration[6.0]
  def change
    add_column :compendia,     :description, :text
    add_column :games,         :description, :text
    add_column :content_texts, :description, :text
    
    connection.execute(%Q{
      SELECT *
      FROM action_text_rich_texts
      WHERE record_type IN(
        'Compendium',
        'Game',
        'Content::Text'
      )
    }).each do |row|
      model  = row['record_type'].safe_constantize
      record = model.find_by(id: row['record_id'])
      
      if record.present?
        record.update_column "#{row['name']}", row['body']
      end
    end
    
    drop_table :action_text_rich_texts
  end
end
