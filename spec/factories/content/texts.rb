FactoryBot.define do
  factory :content_text, class: 'Content::Text' do
    description { FFaker::Lorem.paragraph }
    page_content
  end
end
