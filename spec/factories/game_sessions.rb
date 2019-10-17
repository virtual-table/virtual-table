FactoryBot.define do
  factory :game_session do
    association :game
    author { game.author }
    sequence(:subject) { |n| "#{n.ordinalize} Session" }
  end
end
