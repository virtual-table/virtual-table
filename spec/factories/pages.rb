FactoryBot.define do
  factory :page do
    title { FFaker::Book.title }
    association :compendium, factory: :compendium

    factory :page_with_children do
      transient do
        children_count { 4 }
      end

      after(:build) do |page, evaluator|
        page.children = build_list :page, evaluator.children_count
      end
    end
  end
end
