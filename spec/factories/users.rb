FactoryBot.define do
  factory :user do
    name     { FFaker::Name.name         }
    email    { FFaker::Internet.email    }
    password { FFaker::Internet.password }
    password_confirmation { password }
    
    factory :activated_user do
      activated    { true         }
      activated_at { Time.now.utc }
    end
  end
end
