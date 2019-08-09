FactoryBot.define do
  factory :map do
    title { FFaker::Book.title }
    association :compendium, factory: :compendium
  end
end
