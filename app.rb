require 'sass'
require 'compass'
require 'sinatra/base'

class App < Sinatra::Base

  configure do
    Compass.configuration do |config|
      config.project_path = File.dirname(__FILE__)
      config.sass_dir = 'stylesheets'
    end

    set :scss, Compass.sass_engine_options
    set :views, "views"
  end

  get '/' do
    File.read(File.join('public', 'show_selector.html'))
  end

  get '/stylesheets/:name.css' do
    content_type 'text/css', :charset => 'utf-8'
    scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options )
  end

  run! if app_file == $0

end
