require 'rails_helper'

RSpec.describe GamesController, type: :controller do
  let!(:gm_user) { create :activated_user }
  let!(:user) { create :activated_user }
  let!(:game_with_player) { create :game, author: gm_user }
  let!(:second_game) { create :game, author: gm_user }
  let!(:user_player) { create :player, game: game_with_player, user: user }
  let!(:second_user_player) { create :player, game: second_game, user: user }
  let(:other_player) { create :player }

  describe 'GET #index' do

    before do
      login_as user
      get :index
    end

    it 'renders games current_user is part of' do
      user.players.each do |player|
        expect(assigns(:players)).to include(player)
      end
    end

    it 'does not render games current_user is not part of' do
      expect(assigns(:players)).to_not include other_player
    end
  end

  describe 'GET #show' do
    let(:gm_game) { create :game, author: gm_user }
    before do
      login_as user
    end

    it 'shows the game where the user has a player' do
      get :show, params: { id: game_with_player.id }

      expect(assigns(:game)).to match(game_with_player)
      expect(response).to_not redirect_to(login_url)
    end

    it 'does not show the game where the user does not have a player' do
      expect(get :show, params: { id: gm_game.id }).to redirect_to(login_url)
    end

    it 'does not show games that user is not author of' do
      expect(get :show, params: { id: gm_game.id }).to redirect_to(login_url)
    end

    it 'shows games where user is the author' do
      login_as gm_user
      get :show, params: { id: gm_game.id }

      expect(assigns(:game)).to match(gm_game)
      expect(response).to_not redirect_to(login_url)
    end
  end

  describe 'POST edit' do
    it 'lets author edit game' do
      login_as gm_user
      get :edit, params: { id: game_with_player.id }

      expect(assigns(:game)).to match(game_with_player)
    end
  
    it 'redirects non author users' do
      login_as user

      expect(get :edit, params: { id: game_with_player.id }).to redirect_to(login_url)
    end
  end
end
