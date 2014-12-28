class UserMailer < ActionMailer::Base
  include Resque::Mailer
  add_template_helper(MailHelper)

  layout 'mail'

  def reset_password(user_id)
    @user = User.find(user_id)
    mail(to: @user.email, subject: 'Reset your Salati password')
  end

  def verify_email(user_id)
    @user = User.find(user_id)
    @notice = @user.notices.where({ cause: 'email_verification' }).last
    mail(to: @user.email, subject: 'Verify your Salati account')
  end

  def transaction_report(user_id)
    @user = User.find(user_id)
    @transactions = Transaction.where(account_id: @user.accounts.map(&:id)).occurred_in(Time.now.beginning_of_month, Time.now.end_of_month)

    mail(to: @user.email, subject: "#{Time.now.strftime('%M')} Activity")
  end
end