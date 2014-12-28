# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Currency.first_or_create({
  name: 'USD',
  symbol: '$',
  rate: 1.0
})

if Rails.env == 'test'
  Currency.create({
    name: 'JOD',
    symbol: 'JOD',
    rate: 0.7
  })
end

if Rails.env == 'development'
  UserService.new.create({
    id: 1,
    name: "Mysterious Mocker",
    email: "test@pibiapp.com",
    provider: "pibi",
    password: "test123",
    password_confirmation: "test123"
  })
end