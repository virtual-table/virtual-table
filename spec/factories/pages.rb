# frozen_string_literal: true

FactoryBot.define do
  factory :page do
    title { FFaker::Book.title }
    association :compendium, factory: :compendium

    factory :page_with_children do
      transient do
        children_count { 4 }
      end

      after(:build) do |parent_page, evaluator|
        parent_page.children = build_list :page, evaluator.children_count, parent: parent_page
      end
    end
  end
end
