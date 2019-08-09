FactoryBot.define do
  factory :map_background, class: 'Map::Background' do
    image { Rack::Test::UploadedFile.new('spec/fixtures/files/dice.jpg', 'image/jpg') }
    floor factory: :map_floor
  end
end
