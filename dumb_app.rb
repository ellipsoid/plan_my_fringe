require 'sinatra'

get '/' do
  File.read(File.join('public', 'example.html'))
end
