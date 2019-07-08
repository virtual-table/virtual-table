class PasswordResetsController < ApplicationController
  def new
  end
  
  def create
    @user = User.find_by email: email_param
    
    if @user.present?
      @user.create_reset_token
      AccountMailer.with(user: @user).forgot_password.deliver_now
      
      flash[:notice] = t('.forgot_password_mail_sent')
      redirect_to root_url
    else
      flash.now[:alert] = t('.user_not_found')
      render :new
    end
  end
  
  def edit
    @user = User.find_by reset_token: params[:token]
    
    unless @user.present?
      flash[:alert] = t('.reset_token_expired')
      redirect_to forgot_password_url
    end
  end
  
  def update
    @user = User.find_by reset_token: params[:token]
    
    unless @user.present?
      flash[:alert] = t('.reset_token_expired')
      redirect_to forgot_password_url
    end
    
    if @user.update(user_params)
      cookies.encrypted[:user_id] = @user.id
      flash[:notice] = t('.password_reset')
      redirect_to root_url
    else
      flash.now[:alert] = t('.password_reset_failed')
      render :edit
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end
  
  def email_param
    params[:email]
  end
end
