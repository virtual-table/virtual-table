FactoryBot.define do
  factory :page do
    title { FFaker::Book.title }
    association :compendium, factory: :compendium
  end
end
