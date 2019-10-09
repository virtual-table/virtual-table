class UsersController < ApplicationController
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
    
    if @user.save
      @user.send_activation_email
      session[:user_id] = @user.id
      #flash[:notice] = t('.user_created')
      flash[:info] = "Check your email to activate your account."
      redirect_to root_url
    else
      flash.now.alert = t('.user_invalid')
      render :new
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(%i[
      name
      email
      password
      password_confirmation
    ])
  end
  
end
