require 'sinatra'

get '/' do
  File.read(File.join('public', 'show_selector.html'))
end
