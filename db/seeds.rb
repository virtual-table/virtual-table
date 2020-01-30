# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

pw_digest = User.digest('Test1234')
admin = User.create!(name: 'TestAdmin', email: 'admin@test.eet', password_digest: pw_digest, activated: true)

for i in 1..5 do
  name = 'Gmuser' + i.to_s
  title = 'Compendium ' + i.to_s
  email = 'gm' + i.to_s + '@mine.test'
  user = User.create!(name: name, email: email, password_digest: pw_digest, activated: true)
  user.save
  compendium = Compendium.create!(title: title, public: true, author_id: user.id)

  for i in 1..5 do
    title = 'Game ' + i.to_s
    compendium.save
    compendium.games.create!(title: title, author_id: user.id)
  end
end
