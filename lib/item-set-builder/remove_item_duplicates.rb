# Script for parsing raw item efficiency stats and removing duplicates

require 'json'

file = File.read('../item-efficiency-raw.json')
hash = JSON.parse(file)

no_dupes_hash = hash.uniq do |item| 
  item["Item"]
end

File.open('../item-efficiency-nodupes.json', 'w') do |file|
  file.write(no_dupes_hash.to_json)
end
