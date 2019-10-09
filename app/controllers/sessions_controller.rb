class SessionsController < ApplicationController
  def new
  end
  
  def create
    user = User.find_by(email: login_params[:email].downcase)
    
    if user&.authenticate(login_params[:password])
      if user.activated?
        log_in user
        redirect_to root_url, notice: t('.session_created')
      else
        flash.now.alert = t('.check_activation_email')
        render :new
      end
    else
      flash.now.alert = t('.session_invalid')
      render :new
    end
  end
  
  def destroy
    cookies.delete(:user_id)
    redirect_to root_url, notice: t('.session_destroyed')
  end
  
  def login_params
    params.require(:login).permit(%i[
      email
      password
    ])
  end
end
