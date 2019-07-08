Rails.application.routes.draw do
  ActiveAdmin.routes(self)
  
  root to: 'dashboard#show'
  
  get    'login'  => 'sessions#new',     as: :login
  post   'login'  => 'sessions#create'
  delete 'logout' => 'sessions#destroy', as: :logout
  
  get  'forgot_password' => 'password_resets#new', as: :forgot_password
  post 'forgot_password' => 'password_resets#create'
  
  resources :users
  resources :games
  
  resources :compendia do
    scope module: 'compendia' do
      resources :maps, only: %i[new create]
      resources :pages do
        resources :contents, controller: 'page_contents'
      end
      put 'pages' => 'pages#update_all', as: :update_pages
      get 'page_contents/new' => 'page_contents#new', as: :new_page_content
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
