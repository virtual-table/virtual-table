Rails.application.routes.draw do
  root to: 'games#index'
  
  get    'login'  => 'sessions#new',     as: :login
  post   'login'  => 'sessions#create'
  delete 'logout' => 'sessions#destroy', as: :logout
  
  resources :users
  resources :games
end
