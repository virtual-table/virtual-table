RSpec::Matchers.define :be_persistable do
  match do |subject|
    # Make sure the subject is valid and expect that we can persist it:
    subject.valid? && subject.save && subject.persisted?
  end
  
  failure_message do
    "expected that we would be able to save: #{subject.inspect}" +
    (subject.valid? ? nil : "\nValidation errors: #{subject.errors.inspect}")
  end
  
  failure_message_when_negated do
    "expected that we would not be able to save: #{subject.inspect}"
  end
  
  description do
    "be persistable"
  end
end
