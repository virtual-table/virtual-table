FactoryBot.define do
  factory :content_text, class: 'Content::Text' do
    description { FFaker::Lorem.paragraph }
  end
end
