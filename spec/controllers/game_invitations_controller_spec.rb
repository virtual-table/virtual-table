require 'rails_helper'

RSpec.describe GameInvitationsController, type: :controller do

  describe "GET #create" do
    let(:game) { create :game }

    it "generates a new invitation code" do
      login_as game.author
      
      expect {
        post :create, params: { id: game.id }
      }.to change {
        game.reload.invite_code
      }
    end
  end

  describe "GET edit" do    
    let!(:user) { create :user }
    let(:game) { create :game }

    it "redirects to login page when user is not logged in" do
      #test if redirected to login page when user clicks invite and is not loged in or registered
      get :edit, params: { id: game.id }

      expect(response.cookies['game_invite_code']).to be_present
      expect(response.cookies['game_invite_id']).to be_present
      expect(response).to redirect_to(root_url)
    end

    it "redirects to game page after user logged in" do
      #test redirect to game page after clicking invite and registering a new accountf.check_box 
      login_as user
      get :edit, params: { id: game.id }
    
      expect(response.cookies['game_invite_code']).to eql nil
      expect(response.cookies['game_invite_id']).to eql nil
      expect(response).to redirect_to(game_url(game.id))
    end

    it "Adds the user as a player to the game" do
      login_as user 

      expect {
        get :edit, params: { id: game.id }
      }.to change{
          game.reload.players
      }
    end
  end 
  
end
