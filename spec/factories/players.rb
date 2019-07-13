FactoryBot.define do
  factory :player do
    game
    user
    role { 'player' }
  end
  
  factory :gm, parent: :player do
    role { 'gm' }
  end
end
