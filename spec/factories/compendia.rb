FactoryBot.define do
  factory :compendium do
    title { FFaker::Book.title }
    association :author, factory: :user

    factory :compendium_with_pages do
      transient do
        pages_count { 3 }
      end

      after(:build) do |compendium, evaluator|
        compendium.pages = build_list :page, evaluator.pages_count, compendium: compendium
      end
    end
  end
end
