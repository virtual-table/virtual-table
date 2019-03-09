Rails.application.routes.draw do
  root to: 'users#new'
  resources :users
end
