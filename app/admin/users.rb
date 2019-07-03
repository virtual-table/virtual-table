ActiveAdmin.register User do
  permit_params :name,
                :email,
                :password,
                :password_confirmation,
                roles: []
  
  form do |f|
    f.inputs 'Details' do
      f.inputs :name
    end
    
    f.inputs 'Authentication' do
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    
    f.inputs 'Authorization' do
      f.input :roles, as: :check_boxes, collection: User::ROLES
    end
    
    f.actions
  end
end
