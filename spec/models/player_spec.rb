require 'rails_helper'

RSpec.describe Player, type: :model do
  subject(:player) { build :player }

  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }

  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:role).in_array(['gm', 'player']) }
  end

  describe 'relations' do
    it { is_expected.to belong_to(:game) }
    it { is_expected.to belong_to(:user) }
  end

  describe '#name' do
    it "returns the users name" do
      user   = build :user,   name: 'Matt'
      player = build :player, user: user
      
      expect(player.name).to eql 'Matt'
    end
  end
end
