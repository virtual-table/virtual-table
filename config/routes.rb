Rails.application.routes.draw do
  root to: 'dashboard#show'
  
  get    'login'  => 'sessions#new',     as: :login
  post   'login'  => 'sessions#create'
  delete 'logout' => 'sessions#destroy', as: :logout
  
  get  'rolls' => 'rolls#new',   as: :new_roll
  post 'rolls' => 'rolls#create'
  
  resources :users
  resources :games
  
  resources :compendia do
    scope module: 'compendia' do
      resources :maps, only: %i[new create]
      resources :pages do
        resources :contents, controller: 'page_contents'
      end
    end
  end
  
  resources :maps, except: %i[new create] do
    scope module: 'maps' do
      resources :backgrounds
      resources :characters
      resources :floors
      resources :doors
      resources :rooms
    end
  end
  
  resources :play, controller: :game_sessions, only: %i[index show]
  
  resources :dice_rolls, only: %i[index new create show]
end
