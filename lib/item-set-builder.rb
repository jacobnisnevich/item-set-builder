require 'json'
require 'yaml'
require 'lol'
require 'set'

[
  "item_parser.rb",
  "set_parser.rb"
].each do |file_name|
  require File.expand_path("../item-set-builder/#{file_name}", __FILE__)
end
