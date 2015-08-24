require 'json'

file = File.read('../item-efficiency-raw.json')
hash_array = JSON.parse(file)
useless_stats = ["AP", "MP", "AD", "LS", "HP", "AR", "MR", "Crit", "AS", "BHR", "BMR", "SV", "ArPen", "MPen", "CDR", "MS(%)", "MS", "Notes"]

hash_array.each do |item| 
  useless_stats.each do |stat|
    item.delete(stat)
  end
end

File.open('../item-efficiency-nodupes-lessstats.json', 'w') do |file|
  file.write(hash_array.to_json)
end
