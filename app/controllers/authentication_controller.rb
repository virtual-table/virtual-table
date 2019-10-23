class AuthenticationController < ApplicationController
  def new
  end
  
  def create
    user = User.find_by(email: login_params[:email].downcase)
    
    if user&.authenticate(login_params[:password])
      if user.activated?
        log_in user
        redirect_to root_url, notice: t('.session_created')
      else
        flash.now[:alert] = t('.activate_account')
        redirect_to account_activation_url(user.id)
      end
    else
      flash.now[:alert] = t('.credentials_invalid')
      render :new
    end
  end
  
  def destroy
    log_out
    redirect_to root_url, notice: t('.session_destroyed')
  end
  
  def login_params
    params.require(:login).permit(%i[
      email
      password
    ])
  end
end
