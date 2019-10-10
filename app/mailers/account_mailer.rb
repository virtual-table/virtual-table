class AccountMailer < ApplicationMailer
  def forgot_password
    @user = params[:user]
    mail to: @user.email, subject: t('.forgot_password.subject')
  end

  def account_activation(user)
    @user = user
    mail to: @user.email, subject: t('.account_activation.subject')
  end 
end
