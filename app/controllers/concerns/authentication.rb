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
  
  # TODO: Replace with check for actual admin status:
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
  
  def require_player
    if !current_player
      flash[:alert] = t('.player_required')
      redirect_to games_url
      return false
    end
    
    true
  end

  # Logs in the given user.
  def log_in(user)
    #session[:user_id] = user.id
    cookies.encrypted[:user_id] = user.id
  end  
end
