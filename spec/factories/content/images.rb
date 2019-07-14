FactoryBot.define do
  factory :content_image, class: 'Content::Image' do
    file { file_fixture('dice.jpg') }
  end
end
