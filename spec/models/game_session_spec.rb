require 'rails_helper'

RSpec.describe GameSession, type: :model do
  subject(:game) { build :game_session }
  
  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }
  
  describe 'validations' do
    it { is_expected.to validate_presence_of(:subject) }
  end
end
