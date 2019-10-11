require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { build :user }
  
  it { is_expected.to be_valid }
  it { is_expected.to be_persistable }
  
  describe 'callbacks' do
    context 'on create' do
      it 'generates a reset_token' do
        user.save
        expect(user.reset_token).to be_present
      end
    end
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
  
  describe '#create_reset_token' do
    it 'generates a new reset_token' do
      user.reset_token = 'abcdefghijklmn'
      
      user.create_reset_token
      
      expect(user.reset_token).to be_present
      expect(user.reset_token).to_not eql 'abcdefghijklmn'
    end
    
    it 'updates reset_send_at to the current time' do
      user.create_reset_token
      expect(user.reset_send_at).to be_within(1.second).of Time.now
    end
    
    it 'returns the token' do
      token = user.create_reset_token
      expect(token).to eql user.reset_token
    end
  end

  describe '#reset_activation_token' do 
    it 'generates new activation token' do
      user.activation_token = 'abcdefghijklmnopqrstuvwxyzx'
      
      user.reset_activation_token
      expect(user.activation_token).to_not eql 'abcdefghijklmnopqrstuvwxyzx'
    end

    it 'generates new user activation digest' do
      user.activation_digest = 'abcdefghijklmnopqrstuvwxyzx'
      
      user.reset_activation_token
      expect(user.activation_digest).to_not eql 'abcdefghijklmnopqrstuvwxyzx'
    end

    it 'generates correct digest from token' do
      user.reset_activation_token
      expect(BCrypt::Password.new(user.activation_digest).is_password?(user.activation_token)).to eql true
    end
  end

end
