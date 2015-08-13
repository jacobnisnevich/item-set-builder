require 'sinatra'
require 'json'

require File.expand_path('../lib/item-set-builder.rb', __FILE__)

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/getTags' do
  file = File.read('lib\item.json')
  hash = JSON.parse(file)
  itemParser = ItemParser.new(hash)
  itemParser.getTags().to_json()
end

get '/getItems' do
  file = File.read('lib\item.json')
  hash = JSON.parse(file)
  itemParser = ItemParser.new(hash)
  itemParser.getItems().to_json()
end
