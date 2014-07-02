require 'sass'
require 'compass'
require 'sinatra/base'
require 'omniauth'
require 'omniauth-google-oauth2'
require 'omniauth-facebook'
require 'haml'
require 'json'
require 'sequel'

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

  DB = Sequel.connect(ENV['DATABASE_URL'])

  # get connection to database
  def selection_data
    dataset ||= DB[:selections]
  end

  def data_for_uid(uid)
    rows = selection_data.where(:uid => uid)
    if rows.empty?
      return nil
    else
      return rows.first[:json]
    end
  end

  # OAuth
  use OmniAuth::Builder do
    provider :google_oauth2, ENV["GOOGLE_KEY"], ENV["GOOGLE_SECRET"]
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

  # home page - single page app
  get '/' do
    response.set_cookie("user_name", session["user_name"])
    response.set_cookie("logged_in", session["logged_in"])
    if session["logged_in"]
      response.set_cookie("uid", session["uid"])

      has_data = !data_for_uid(session["uid"]).nil?
      response.set_cookie("has_data", has_data)
    end
    
    haml :app
  end

  # template files
  get '/views/:page.html' do |page|
    haml page.to_sym
  end

  # directive scripts
  get '/directives/:directive.html' do |directive|
    haml "directives/#{directive}".to_sym
  end

  # fetch data for logged-in user
  get '/user_data/:id' do |id|
    content_type 'json'

    unless id == session["uid"]
      # users are not allowed to grab another user's data
      return
    end

    data = data_for_uid(id)
  end

  # save data for logged-in user
  put '/user_data/:id' do |id|

    unless id == session["uid"]
      # users are only allowed to update their own data
      redirect('/')
    end

    data = request.body.read

    response.set_cookie("has_data", true)
    if data_for_uid(id).nil?
      # no existing entry for user - need to insert
      selection_data.insert(:uid => id, :json => data)
    else
      # entry already exists for user - need to overwrite
      selection_data.where(:uid => id).update(:json => data)
    end

    # return newly-stored data
    data_for_uid(id)
  end

  # logout user
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

	get '*' do
    redirect('/')
	end

  run! if app_file == $0

end
