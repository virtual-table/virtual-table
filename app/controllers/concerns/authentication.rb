module Authentication
  extend ActiveSupport::Concern
  
  included do
    helper_method :logged_in?
    helper_method :current_user
  end
  
  def current_user
    @current_user ||= User.find(cookies.encrypted[:user_id]) if cookies.encrypted[:user_id]
  end
  
  def logged_in?
    !!current_user
  end
  
  def require_user
    if !logged_in?
      flash[:alert] = "You need to be logged in."
      redirect_to login_url
      return false
    end
  end
  
end
