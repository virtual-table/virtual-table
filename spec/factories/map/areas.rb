FactoryBot.define do
  factory :map_area, class: 'Map::Area' do
    floor factory: :map_floor
  end
end
