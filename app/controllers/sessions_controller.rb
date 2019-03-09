class SessionsController < ApplicationController
  def new
  end
  
  def create
    user = User.find_by email: login_params[:email]
    
    if user&.authenticate(login_params[:password])
      cookies.encrypted[:user_id] = user.id
      redirect_to root_url, notice: t('.session_created')
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
