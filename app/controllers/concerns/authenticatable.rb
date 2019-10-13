module Authenticatable
  extend ActiveSupport::Concern
  
  included do
    helper_method :logged_in?
    helper_method :current_user
  end
  
  def log_in(user)
    @current_user = user
    cookies.encrypted[:user_id] = user.id
  end
  
  def log_out
    @current_user = nil
    cookies.delete(:user_id)
  end
  
  def current_user
    @current_user ||= User.find(cookies.encrypted[:user_id]) if cookies.encrypted[:user_id]
  end
  
  def logged_in?
    !!current_user
  end
  
  def require_admin
    return false unless require_user
    
    unless current_user.roles.include?('admin')
      flash[:alert] = t('.admin_required')
      redirect_to login_url
      return false
    end
  end
  
  def require_user
    if !logged_in?
      flash[:alert] = t('.user_required')
      redirect_to login_url
      return false
    end
    
    true
  end
end
