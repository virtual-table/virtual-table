FactoryBot.define do
  factory :chat_message do
    session { nil }
    author { nil }
    body { "MyText" }
  end
end
