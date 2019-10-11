# Preview all emails at http://localhost:3000/rails/mailers/account_mailer
class AccountMailerPreview < ActionMailer::Preview
  def forgot_password
    AccountMailer.with(user: User.first).forgot_password
  end

  def account_activation
    user = User.first
    user.activation_token = User.secure_token
    AccountMailer.account_activation(user)
  end 
  
end
