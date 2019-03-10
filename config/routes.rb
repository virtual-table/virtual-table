Rails.application.routes.draw do
  root to: 'games#index'
  
  get    'login'  => 'sessions#new',     as: :login
  post   'login'  => 'sessions#create'
  delete 'logout' => 'sessions#destroy', as: :logout
  
  resources :users
  resources :games do
    scope module: 'games' do
      resources :maps, only: %i[new create]
    end
  end
end
