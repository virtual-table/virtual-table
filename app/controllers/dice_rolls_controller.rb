class DiceRollsController < ApplicationController
  def index
    params[:roll] = '(Attack) 1d20+15'
    create
  end
  
  def create
    @roll = params[:roll].presence
    
    if valid_roll?(@roll)
      @dice   = DiceBag::Roll.new(@roll)
      @result = @dice.result
      render :show
    else
      flash.now[:error] = t('.invalid_roll')
      render :new
    end
  end
  
  private
  
  def valid_roll?(roll)
    roll.present?
  end
end
