class ItemParser
  attr_reader :item_json

  def initialize(itemJSON)
    @item_json = itemJSON
  end

  # Currently unused function for retrieving array all item tags
  def getTags()
    dataHash = @item_json['data']
    tagSet = Set.new

    dataHash.each do |itemId, item|
      item['tags'].each do |tag|
        tagSet.add(tag)
      end
    end

    return tagSet.to_a
  end

  # Returns data portion of Riot's static data endpoint for items
  def getItems()
    return mergeWithAPI(@item_json)['data']
  end

  private

  # Function for merging current API data with efficiency statistics
  def mergeWithAPI(items)
    file = File.read(Dir.pwd + '/lib/item-efficiency-combined.json')
    item_efficiency_combined = JSON.parse(file)

    new_item_data = {}

    items["data"].each do |id, item|
      if !item_efficiency_combined[id].nil?
        new_item = item.merge(item_efficiency_combined[id])
      else
        new_item = item
      end
      new_item_data[id] = new_item
    end

    items["data"] = new_item_data

    return items
  end
end
