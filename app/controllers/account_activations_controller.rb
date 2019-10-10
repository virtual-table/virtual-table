class AccountActivationsController < ApplicationController

before_action :get_user, only: [:edit, :create]
before_action :check_expiration, only: [:edit]
  def show
    render :activate
  end 

  def edit
    user = User.find_by(email: params[:email].downcase)
    if user && !user.activated? && @user.authenticated?(:activation, params[:id])
        user.activate
        log_in user
        flash[:success] = t('.account_activated')
        redirect_to root_url
    else
      flash[:danger] = t('.invalid_activation_link')
      redirect_to root_url
    end
  end

  # Create a new activation link
  def create
    user = User.find_by(email: params[:email].downcase)
    if user && !user.activated?
      user.update_attribute(:activation_token, User.secure_token)
      user.update_attribute(:activation_digest, User.digest(user.activation_token))
      user.send_activation_email
      flash.now.alert = t('.check_activation_email')
      render :activate
    else
      flash[:alert] = t('.error_resending_activation_link')
      render :activate
    end
  end
  
  private
    

    def get_user
      @user = User.find_by(email: params[:email].downcase)
    end

    def check_expiration
      if @user.activation_expired?
        flash[:danger] = t('.activation_link_expired')
        redirect_to account_activation_path(user.id)
      end
    end 
end
