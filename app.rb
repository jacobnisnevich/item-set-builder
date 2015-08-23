require 'sinatra'
require 'json'
require 'httparty'

set :port, '80'

require File.expand_path('../lib/item-set-builder.rb', __FILE__)

itemAPI = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?locale=en_US&itemListData=all&api_key=' + ENV["LOL_KEY"]
champAPI = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=' + ENV["LOL_KEY"]

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/getTags' do
  response = HTTParty.get(itemAPI)
  itemParser = ItemParser.new(response.parsed_response)
  itemParser.getTags.to_json
end

get '/getItems' do
  response = HTTParty.get(itemAPI)
  itemParser = ItemParser.new(response.parsed_response)
  itemParser.getItems.to_json
end

get '/getChamps' do
  response = HTTParty.get(champAPI)
  response.parsed_response['data'].to_json
end

post '/uploadJSON' do
  params[:files][0][:tempfile].read.to_json
end
