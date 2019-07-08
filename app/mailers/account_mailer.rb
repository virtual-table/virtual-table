class AccountMailer < ApplicationMailer
  def forgot_password
    @user = params[:user]
    mail to: @user.email, subject: t('.forgot_password.subject')
  end
end
