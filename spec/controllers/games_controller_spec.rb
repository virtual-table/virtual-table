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
    let(:random_game) { create :game, author: gm_user }
    before do
      login_as user
    end

    it 'shows the games that the user is part of' do
      get :show, params: { id: game_with_player.id }

      expect(assigns(:game)).to match(game_with_player)
    end

    it 'does not show the games that the user is not part of' do
      get :show, params: { id: random_game.id }

      expect(assigns(:game)).to_not match(random_game)
    end
  end
end
