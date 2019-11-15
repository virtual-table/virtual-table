require 'rails_helper'

RSpec.describe "Game invites", type: :feature do
  let(:game) { create :game }
  let(:user) { create :activated_user }
  before { ActionMailer::Base.deliveries = [] }

  scenario "Unregistered player visits game invite url" do
    visit(join_game_path(game.id, game.invite_code))

    assert_current_path(login_path)
    expect(Capybara.current_session.driver.request.cookies.[]('game_invite_id')).not_to be_nil
    expect(Capybara.current_session.driver.request.cookies.[]('game_invite_code')).not_to be_nil


    click_link('Sign Up')
    assert_current_path(new_user_path)


    fill_in('user_name', with: 'TestUser')
    fill_in('user_email', with: 'user@test.testing')
    fill_in('user_password', with: 'password123')
    fill_in('user_password_confirmation', with: 'password123')

    click_on('Submit')

    activation_email = ActionMailer::Base.deliveries.first
    activation_link = activation_email.parts.second.body.raw_source.match(/href="(?<url>.+?)">/)[:url]

    visit(activation_link)

    assert_current_path(root_path)
    expect(page).to have_content 'Games'
    expect(page).to have_content 'Compendia'
  end

  scenario "Logged out player is invited" do
    visit(join_game_path(game.id, game.invite_code))

    assert_current_path(login_path)

    fill_in('login_email', with: user.email)
    fill_in('login_password', with: user.password)

    click_button('Login')

    assert_current_path(root_path)
  end

  scenario "logged in player is invited" do
    visit(root_path)

    fill_in('login_email', with: user.email)
    fill_in('login_password', with: user.password)

    click_button('Login')

    assert_current_path(root_path)

    visit(join_game_path(game.id, game.invite_code))

    assert_current_path(game_path(game.id))
  end
end 