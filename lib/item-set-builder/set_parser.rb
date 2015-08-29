class SetParser
  attr_reader :set, :items

  def initialize(setObject, itemJSON)
    # Item set data from bildr
    @set = setObject
    # Item data from Riot API with efficiency stats embedded
    @items = itemJSON
  end

  # Function for generating Set Summary page on bildr
  def summary()
    summaryHash = {}
    summaryHash["title"] = @set["title"]

    totalCost = 0
    totalWorthLower = 0
    totalWorthUpper = 0

    itemTags = {}

    @set["blocks"].each do |index, itemBlock|
      if !itemBlock["items"].nil?
        itemBlock["items"].each do |index, item|
          itemID = item["id"]
          itemData = @items[itemID]

          # Fix for issue with Total Biscuit of Rejuvenation, which for some reason has no tags
          if !itemData["tags"].nil?
            itemData["tags"].each do |tag|
              if itemTags[tag].nil?
                itemTags[tag] = 1
              else
                itemTags[tag] = itemTags[tag] + 1
              end
            end
          end

          # If item is tagged as a "base" item its worth is guaranteed to be equal to its cost by definition
          if itemData["efficiency"]["base"] == true
            totalCost = totalCost + itemData["gold"]["base"]
            totalWorthLower = totalWorthLower + itemData["gold"]["base"]
            totalWorthUpper = totalWorthUpper + itemData["gold"]["base"]
          else
            totalCost = totalCost + itemData["gold"]["base"]

            itemCases = itemData["efficiency"]["cases"]

            # Used as base cases for determining best and worst case item worth
            bestCase = 0
            worstCase = Float::INFINITY

            itemCases.each do |itemCase|
              itemCaseWorth = itemCase[itemCase.keys[0]]["Gold Value"].to_i

              if itemCaseWorth > bestCase
                bestCase = itemCaseWorth
              end

              if itemCaseWorth < worstCase
                worstCase = itemCaseWorth
              end
            end

            totalWorthUpper = totalWorthUpper + bestCase
            totalWorthLower = totalWorthLower + worstCase
          end
        end
      end
    end

    summaryHash["totalCost"] = totalCost
    summaryHash["totalWorthLower"] = totalWorthLower
    summaryHash["totalWorthUpper"] = totalWorthUpper

    # Check for division by 0 errors
    if totalWorthLower > 0
      summaryHash["totalEfficiencyLower"] = totalWorthLower / totalCost.to_f
    else 
      summaryHash["totalEfficiencyLower"] = "NaN"
    end
    if totalWorthUpper > 0
      summaryHash["totalEfficiencyUpper"] = totalWorthUpper / totalCost.to_f
    else 
      summaryHash["totalEfficiencyUpper"] = "NaN"
    end

    summaryHash["tagDistribution"] = itemTags

    return summaryHash
  end
end
