class DashboardController < ApplicationController
  
  before_action :require_user
  
  def show
    @players   = current_user.players
    @compendia = current_user.compendia
  end
end
