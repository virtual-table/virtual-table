require 'rails_helper'

RSpec.describe Game, type: :model do
  subject(:game) { build :game }
  
  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }
  
  describe 'callbacks' do
    context 'on create' do
      it 'adds the author as a GM' do
        expect { game.save }.to change { Player.count }.by +1
        
        player = game.players.first
        expect(player.user).to eql game.author
        expect(player.role).to eql 'gm'
      end
    end
    
    context 'on save' do
      it 'generates an invite code' do
        game.save
        expect(game.invite_code).to be_present
      end
      
      it "doesn't overwrite an existing invite code" do
        game.invite_code = 'invite_code'
        game.save
        expect(game.invite_code).to eql 'invite_code'
      end
    end
  end
end
