class ItemParser
  attr_reader :item_json

  def initialize(itemJSON)
    @item_json = itemJSON
  end

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

  def getItems()
    dataHash = @item_json['data']
  end
end
