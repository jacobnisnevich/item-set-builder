require 'json'
require 'yaml'
require 'lol'
require 'set'
require 'nokogiri'
require 'open-uri'

[
  "item_parser.rb",
  "set_parser.rb",
  "championgg_parser"
].each do |file_name|
  require File.expand_path("../item-set-builder/#{file_name}", __FILE__)
end
