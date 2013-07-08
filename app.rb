require 'sinatra/base'


class App < Sinatra::Base

  get '/' do
    File.read(File.join('public', 'show_selector.html'))
  end

  run! if app_file == $0

end
