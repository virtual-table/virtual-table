require 'rails_helper'

RSpec.describe "AccountActivations", type: :feature do
     scenario "User registration, logout and login" do
      visit(root_url)

      click_link('Signup')
      assert_current_path(new_user_path)

      fill_in('user_name', with: 'TestUser')
      fill_in('user_email', with: 'user@test.testing')
      fill_in('user_password', with: 'password123')
      fill_in('user_password_confirmation', with: 'password123')
 
      click_on('Submit')

      assert_current_path(login_path)

      email = ActionMailer::Base.deliveries.first
      activation_link = email.parts.second.body.raw_source.match(/href="(?<url>.+?)">/)[:url]

      visit(activation_link)

      assert_current_path(root_path)
      expect(page).to have_content 'Games'
      expect(page).to have_content 'Compendia'

      click_link('Logout')

      assert_current_path(login_path)

      fill_in('login_email', with: 'user@test.testing')
      fill_in('login_password', with: 'password123')

      click_on('Submit')

      assert_current_path(root_path)
    end
end 