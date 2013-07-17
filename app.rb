require 'sass'
require 'compass'
require 'sinatra/base'
require 'omniauth'
require 'omniauth-google'
require 'omniauth-facebook'
require 'haml'
require 'json'

# this probably shouldn't need to be here, but ENV variables were 
# not being loaded correctly from config.ru
require './env.rb' if File.exists?('./env.rb')

class App < Sinatra::Base

  configure do
    Compass.configuration do |config|
      config.project_path = File.dirname(__FILE__)
      config.sass_dir = 'stylesheets'
    end

    set :scss, Compass.sass_engine_options
    set :views, "views"
    set :sessions, true
    set :session_secret, ENV["SESSION_SECRET"]
  end

  # OAuth
  use OmniAuth::Builder do
    provider :google, ENV["GOOGLE_KEY"], ENV["GOOGLE_SECRET"]
    provider :facebook, ENV["FACEBOOK_KEY"], ENV["FACEBOOK_SECRET"]
  end

  # OAuth Callbacks
  get '/auth/:provider/callback' do |provider|
    session["logged_in"] = true

    user_name = request.env['omniauth.auth'].info.name
    session["user_name"] = user_name

    uid = provider + "-" + request.env['omniauth.auth'].uid
    session["uid"] = uid
    redirect('/')
  end

  get '/' do
    response.set_cookie("user_name", session["user_name"])
    response.set_cookie("logged_in", session["logged_in"])
    if session["logged_in"]
      response.set_cookie("uid", session["uid"])
    end
    
    haml :app
  end

  get '/views/home.html' do
    haml :home
  end

  get '/user_data/:id' do |id|
    content_type 'json'

    unless id == session["uid"]
      # users are not allowed to grab another user's data
      return
    end

    data = IO.read("user_data/#{id}.json")
  end

  put '/user_data/:id' do |id|

    unless id == session["uid"]
      # users are only allowed to update their own data
      redirect('/')
    end

    data = request.body.read
    puts "\nData: #{data.inspect}\n"
    File.open("user_data/#{id}.json", 'w') do |file|
      file.write(data)
    end
  end

  post '/logout' do
    #data = JSON.parse(request.body)
    session.clear
    response.delete_cookie("user_name")
    response.delete_cookie("uid")
    response.set_cookie("logged_in", false)
  end

  # CSS
  get '/stylesheets/:name.css' do
    content_type 'text/css', :charset => 'utf-8'
    scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options )
  end

  run! if app_file == $0

end
