require 'sinatra'

class App < Sinatra::Base

  get '/' do
    File.read(File.join('public', 'show_selector.html'))
  end

end
