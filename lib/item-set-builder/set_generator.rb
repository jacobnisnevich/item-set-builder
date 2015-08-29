# Base class for both ChampGGParser and StarterPresets

class SetGenerator
  attr_reader :item_set

  def initialize()
    @item_set = {}
    @item_set["title"] = ""
    @item_set["type"] = "custom"
    @item_set["map"] = "SR"
    @item_set["mode"] = "CLASSIC"
    @item_set["priority"] = false
    @item_set["sortrank"] = 0
    @item_set["blocks"] = []
  end

  def createItemBlock(blockName, blockItems)
    block = {}

    block["type"] = blockName
    block["items"] = []

    blockItems.each do |blockItem|
      itemSlot = {}

      itemSlot["id"] = blockItem
      itemSlot["count"] = 1

      block["items"].push(itemSlot)
    end

    @item_set["blocks"].push(block)
  end
end