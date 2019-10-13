module LoginAsHelper
  def login_as(user)
    if defined?(controller)
      controller.log_in(user)
      request.cookies['user_id'] = cookies['user_id']
    else
      raise "Can't login '#{user.email}' because I don't know how."
    end
  end
end

RSpec.configure do |config|
  config.include LoginAsHelper
end
