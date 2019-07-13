FactoryBot.define do
  factory :game do
    title  { FFaker::Book.title }
    author { create :user       }
  end
end
