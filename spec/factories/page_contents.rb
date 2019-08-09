FactoryBot.define do
  factory :page_content do
    association :page, factory: :page
  end
  
  factory :page_image_content, parent: :page_content do
    association :content, factory: :content_image
  end
  
  factory :page_text_content, parent: :page_content do
    association :content, factory: :content_text
  end
end
