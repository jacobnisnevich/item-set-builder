require 'json'

def mergeWithFiles()
  file = File.read('../item.json')
  items = JSON.parse(file)

    file = File.read('../item-efficiency-combined.json')
    item_efficiency_combined = JSON.parse(file)

    new_item_data = {}

    items["data"].each do |id, item|
      new_item = item.merge(item_efficiency_combined[id])
      new_item_data[id] = new_item
    end

    items["data"] = new_item_data

  File.open('../item.json', 'w') do |file|
    file.write(items.to_json)
  end
end

def mergeWithAPI(items)
  file = File.read('../item-efficiency-combined.json')
  item_efficiency_combined = JSON.parse(file)

  new_item_data = {}

  items["data"].each do |id, item|
    new_item = item.merge(item_efficiency_combined[id])
    new_item_data[id] = new_item
  end

  items["data"] = new_item_data

  return items
end
