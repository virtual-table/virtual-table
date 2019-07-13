FactoryBot.define do
  factory :compendium do
    title { FFaker::Book.title }
    association :author, factory: :user
  end
end
