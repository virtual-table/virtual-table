require 'rails_helper'

RSpec.describe "Sessions", type: :feature do
  let(:user) { create :activated_user }
  let(:user_inactive) { create :user }

  scenario "Activated User login" do 
    visit(root_path)
    assert_current_path(login_path)

    fill_in('login_email', with: user.email)
    fill_in('login_password', with: user.password)

    click_on('Submit')

    assert_current_path(root_path)
  end

  scenario "Inactive user login" do
    visit(root_path)
    assert_current_path(login_path)

    fill_in('login_email', with: user_inactive.email)
    fill_in('login_password', with: user_inactive.password)

    click_on('Submit')

    assert_current_path( account_activation_path(user_inactive.id) )
  end

  scenario "User logout" do
    visit(root_path)
    assert_current_path(login_path)

    fill_in('login_email', with: user.email)
    fill_in('login_password', with: user.password)

    click_on('Submit')

    assert_current_path(root_path)

    click_link('Logout')

    assert_current_path(login_path)
  end

end 