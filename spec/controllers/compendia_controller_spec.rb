require 'rails_helper'

RSpec.describe CompendiaController, type: :controller do
  let!(:author_user) { create :activated_user }
  let!(:user) { create :activated_user }
  let!(:compendium) { create :compendium, author: author_user }


  describe 'GET index' do
    let(:random_compendium) { create :compendium }

    it 'shows compendia user is author of' do
      login_as author_user
      get :index

      expect(assigns(:compendia)).to_not be_nil
      expect(assigns(:compendia)).to include(compendium)
    end

    it 'does not show other authors compendia' do
      login_as author_user
      get :index

      expect(assigns(:compendia)).to_not include random_compendium
    end
  end

  describe 'GET show' do
    let(:player_user) { create :activated_user }
    let(:player){ create :player, user: user }
    let!(:game) { create :game }
    let(:simple_user) { create :activated_user }

    it 'shows compendia to the current author' do
      login_as author_user
      get :show, params: { id: compendium.id }

      expect(assigns(:pages)).to_not be_nil
      expect(assigns(:pages)).to match(compendium.pages)
      expect(assigns(:maps)).to_not be_nil
      expect(assigns(:maps)).to match(compendium.maps)
      expect(response).to render_template :show
    end

    it 'does not show the compendia to non author or player' do
      login_as simple_user
      get :show, params: { id: compendium.id }

      expect(response).to redirect_to(login_url)
    end
  end

  describe 'POST edit' do

  end
end
