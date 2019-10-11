class AccountActivationsController < ApplicationController
  
  before_action :load_user, only: %i[edit create]
  
  before_action :check_expiration, only: %i[edit]
  
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
      user.reset_activation_token
      user.send_activation_email
      
      flash.now[:alert] = t('.check_activation_email')
      render :activate
    else
      flash.now[:alert] = t('.error_resending_activation_link')
      render :activate
    end
  end
  
  private
  
  def load_user
    @user = User.find_by(email: params[:email].downcase)
  end
  
  def check_expiration
    if @user.activation_expired?
      flash[:danger] = t('.activation_link_expired')
      redirect_to account_activation_path(user.id)
    end
  end
end
