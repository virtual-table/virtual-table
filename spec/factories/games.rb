FactoryBot.define do
  factory :game do
    title { FFaker::Book.title }
    association :author, factory: :user
  end
end
