# Script for merging item efficiency statistics with their appropriate ids

require 'json'

file = File.read('../id-to-name.json')
id_to_name = JSON.parse(file)

file = File.read('../item-efficiency-nodupes.json')
item_efficiency = JSON.parse(file)

item_efficiency_combined = {}

id_to_name.each do |id, name|
  item = {}

  matching_items = item_efficiency.select {|item| item["Item"].to_s().start_with?(name)}

  if matching_items.empty?
    item["base"] = true
  else
    item["base"] = false
    item["cases"] = []
    matching_items.each do |matching_item_case| 
      item_case = {}

      if matching_item_case["Item"].scan(/\(([^\)]+)\)/).empty?
        item_case_name = "Bought"
      else
        item_case_name = matching_item_case["Item"].scan(/\(([^\)]+)\)/)[0][0].capitalize
      end

      item_case[item_case_name] = {}
      item_case[item_case_name]["Case Name"] = item_case_name
      item_case[item_case_name]["Efficiency"] = matching_item_case["Efficiency"]
      item_case[item_case_name]["Gold Value"] = matching_item_case["Gold Value"]
      item_case[item_case_name]["Gold Efficiency Ratio"] = matching_item_case["Gold Efficiency Ratio"]

      item["cases"].push(item_case)
    end
  end
  item_efficiency_combined[id] = { "efficiency": item }
end

File.open('../item-efficiency-combined.json', 'w') do |file|
  file.write(item_efficiency_combined.to_json)
end
