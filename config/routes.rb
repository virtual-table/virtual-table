Rails.application.routes.draw do
  ActiveAdmin.routes(self)
  
  root to: 'dashboard#show'
  
  get    'login'  => 'authentication#new',     as: :login
  post   'login'  => 'authentication#create'
  delete 'logout' => 'authentication#destroy', as: :logout
  
  get  'forgot_password' => 'password_resets#new', as: :forgot_password
  post 'forgot_password' => 'password_resets#create'
  
  get   'reset_password/:token' => 'password_resets#edit', as: :reset_password
  patch 'reset_password/:token' => 'password_resets#update'
  
  resources :users
  
  resources :games do
    scope module: 'games' do
      member do
        post   'invite'     => 'invite_mail#create', as: :send_invite_mail
        delete 'invite'     => 'invites#destroy',    as: :regenerate_invite
        get    'join/:code' => 'invites#update',     as: :join
      end
    end
  end
  
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
      resources :areas
      resources :backgrounds
      resources :characters
      resources :floors
      resources :doors
    end
  end
  
  resources :play, controller: :game_sessions, only: %i[index show]
  
  resources :dice_rolls, only: %i[index new create show]
  
  resources :account_activations, only: %i[edit create show]
end
