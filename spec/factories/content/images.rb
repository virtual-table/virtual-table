FactoryBot.define do
  factory :content_image, class: 'Content::Image' do
    file { Rack::Test::UploadedFile.new('spec/fixtures/files/dice.jpg', 'image/jpg') }
    page_content
  end
end
