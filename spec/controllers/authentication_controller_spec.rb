require 'rails_helper'

RSpec.describe AuthenticationController, type: :controller do
  describe 'GET #new' do
    before do
      get :new
    end

    it 'renders the login page' do
      expect(response).to render_template('new')
    end
  end

  describe 'POST #create' do
    let(:username) { FFaker::Internet.email    }
    let(:password) { FFaker::Internet.password }

    let!(:user) { create :user, email: username, password: password }

    context 'with a correct email and password' do
      before do
        post :create, params: {
          login: { email: username, password: password }
        }
      end

      context 'with an activated account' do
        let!(:user) { create :activated_user, email: username, password: password }

        it 'sets the user ID in a cookie' do
          expect(response.cookies['user_id']).to be_present
        end

        it 'redirects to the homepage' do
          expect(response).to redirect_to(root_url)
        end

        it 'notifies the user that they are logged in' do
          expect(flash[:notice]).to include I18n.t('authentication.create.session_created', user: user.name)
        end
      end

      context 'with an unactivated account' do
        it 'does not set a user ID in a cookie' do
          expect(response.cookies['user_id']).to eql nil
        end

        it 'redirects to the account activation page' do
          expect(response).to redirect_to(account_activation_url(user.id))
        end

        it 'notifies the user that they need to activate their account' do
          expect(flash[:alert]).to include I18n.t('authentication.create.activate_account')
        end
      end
    end

    %i[email password].each do |invalid_attribute|
      context "with an incorrect #{invalid_attribute}" do
        before do
          post :create, params: {
            login: { email: username, password: password }.merge(invalid_attribute => 'this is invalid')
          }
        end

        it 'does not set a user ID in a cookie' do
          expect(response.cookies['user_id']).to eql nil
        end

        it 'notifies the user that they entered invalid credentials' do
          expect(flash[:alert]).to include I18n.t('authentication.create.credentials_invalid_html')
        end

        it 'renders the login page' do
          expect(response).to render_template('new')
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when logged in' do
      let(:user) { create :user }

      before do
        login_as user
        delete :destroy
      end

      it 'unsets the user_id cookie' do
        expect(response.cookies['user_id']).to eql nil
      end

      it 'notifies the user that they are logged out' do
        expect(flash[:notice]).to include I18n.t('authentication.destroy.session_destroyed')
      end

      it 'redirects to the homepage' do
        expect(response).to redirect_to(root_url)
      end
    end

    context 'when logged out' do
      before do
        delete :destroy
      end

      it 'redirects to the homepage' do
        expect(response).to redirect_to(root_url)
      end
    end
  end
end
