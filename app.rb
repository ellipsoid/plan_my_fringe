require 'sass'
require 'compass'
require 'sinatra/base'
require 'omniauth'
require 'omniauth-google'
require 'haml'

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
  end

  # OAuth Callbacks
  get '/auth/:provider/callback' do
    session["logged_in"] = true
    session["user_name"] = request.env['omniauth.auth'].info.name
    redirect('/')
  end

  get '/' do
    user_name = session["user_name"] || "Guest"
    haml :app, :locals => { user_name: user_name }
    #File.read(File.join('public', 'show_selector.html'))
  end

  get '/views/home.html' do
    haml :home
  end

  # CSS
  get '/stylesheets/:name.css' do
    content_type 'text/css', :charset => 'utf-8'
    scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options )
  end

  run! if app_file == $0

end
