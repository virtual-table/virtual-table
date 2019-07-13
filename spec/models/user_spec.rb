require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { build :user }
  
  it { is_expected.to be_valid }
  
  it 'can be saved' do
    user.save!
    expect(user.persisted?).to be true
  end
  
  describe '#join!' do
    subject(:user) { create :user }
    let(:game)     { create :game }
    
    context "for a game the user hasn't played" do
      it 'creates a player for the given game' do
        expect { user.join! game }.to change { Player.where(game: game).count }.by +1
      end
      
      it 'gives the created player the "player" role' do
        player = user.join! game
        expect(player.role).to eql 'player'
      end
    end
    
    context "for a game the user is a player of" do
      before do
        create :player, user: user, game: game
      end
      
      it "doesn't create a new player" do
        expect { user.join! game }.to_not change { Player.count }
      end
    end
    
    context "for a game the user is a GM of" do
      before do
        create :gm, user: user, game: game
      end
      
      it "doesn't create a new player" do
        expect { user.join! game }.to_not change { Player.count }
      end
    end
  end
end
