require './app.rb'
require './env.rb' if File.exists?('./env.rb')

run App
