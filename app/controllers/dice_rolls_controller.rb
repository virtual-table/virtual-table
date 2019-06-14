class DiceRollsController < ApplicationController
  def index
    params[:roll] = '(Test) 1d4 + 1d6 + 1d8 + 1d10 + 1d12'
    params[:seed] = random_seed
    create
  end
  
  def create
    @roll = params[:roll].presence
    @seed = params[:seed].presence || random_seed
    
    if valid_roll?(@roll)
      with_random_seed @seed do
        @dice   = DiceBag::Roll.new(@roll)
        @result = @dice.result
      end
      
      render :show
    else
      flash.now[:error] = t('.invalid_roll')
      render :new
    end
  end
  
  private
  
  def with_random_seed(seed, &block)
    srand seed.to_i
    yield
  ensure
    srand
  end
  
  def random_seed
    Random.rand(1_000_000_000)
  end
  helper_method :random_seed
  
  def valid_roll?(roll)
    roll.present?
  end
end
