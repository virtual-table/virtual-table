# Preview all emails at http://localhost:3000/rails/mailers/account_mailer
class AccountMailerPreview < ActionMailer::Preview
  def forgot_password
    AccountMailer.with(user: User.first).forgot_password
  end
end
