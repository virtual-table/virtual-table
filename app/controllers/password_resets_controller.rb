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
  
  private
  
  def email_param
    params[:email]
  end
end
