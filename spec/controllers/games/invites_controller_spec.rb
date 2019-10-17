require 'rails_helper'

RSpec.describe Games::InvitesController, type: :controller do
  describe "DELETE #destroy" do
    let(:player)    { create :user }
    let(:player_gm) { create :user }
    let(:game)      { create :game }
    
    it "generates a new invitation code while logged in as author" do
      login_as game.author
      
      expect {
        delete :destroy, params: { id: game.id }
      }.to change {
        game.reload.invite_code
      }
    end
    
    it "does not generate a new invitation code while logged in as player without gm role" do
      login_as player 
      
      game.players.create user: player, role: 'player'
      
      expect {
        delete :destroy, params: { id: game.id }
      }.to_not change {
        game.reload.invite_code
      }
    end
    
    it "generates a new invitation code while logged in as player with gm role" do
      login_as player_gm 
      
      game.players.create user: player_gm, role: 'gm'
      
      expect {
        delete :destroy, params: { id: game.id }
      }.to change {
        game.reload.invite_code
      }
    end
  end
  
  describe "GET #update" do
    let!(:user) { create :user }
    let(:game)  { create :game }
    
    context 'when logged in' do
      before { login_as user }
      
      context 'with the correct invite code' do
        it "adds the user as a player to the game" do
          expect {
            get :update, params: { id: game.id, code: game.invite_code }
          }.to change {
            game.players.count
          }.by +1
          
          expect(game.users).to include user
        end
        
        it "redirects to game page" do
          get :update, params: { id: game.id, code: game.invite_code }
          
          expect(response).to redirect_to(game_url(game))
        end
      end
      
      context 'with the wrong invite code' do
        it "doesn't add the user as a player to the game" do
          expect {
            get :update, params: { id: game.id, code: game.invite_code.reverse }
          }.to_not change {
            game.players.count
          }
        end
      end
    end
    
    context 'when logged out' do
      it "redirects to login page" do
        get :update, params: { id: game.id, code: game.invite_code }
        expect(response).to redirect_to(login_url)
      end
      
      context 'with the correct invite code' do
        it "stores the pending invite in a cookie" do
          get :update, params: { id: game.id, code: game.invite_code }
        
          expect(response.cookies['game_invite_code']).to eql game.invite_code
          expect(response.cookies['game_invite_id']).to   eql game.id.to_s
        end
      end
      
      context 'with the wrong invite code' do
        it "doesn't store the pending invite in a cookie" do
          get :update, params: { id: game.id, code: game.invite_code.reverse }
        
          expect(response.cookies['game_invite_code']).to be_nil
          expect(response.cookies['game_invite_id']).to   be_nil
        end
      end
    end
  end
end
