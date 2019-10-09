class AccountActivationsController < ApplicationController
  def edit
    user = User.find_by(email: params[:email].downcase)
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      user.activate
      cookies.encrypted[:user_id] = user.id
      flash[:success] = t('.account_activated')
      redirect_to root_url
    else
      flash[:danger] = t('.invalid_activation_link')
      redirect_to root_url
    end
  end
end
