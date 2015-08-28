class ChampGGParser < SetGenerator
  def getChampionBuild(champKey, type) 
    page = Nokogiri::HTML(open("http://champion.gg/champion/#{champKey}"))

    if type == 'mostFrequent'
      @item_set["title"] = "Most Frequent #{champKey} Build"
      createItemBlock('Most Frequent Starting Build', getStartingItems(page, type))
      createItemBlock('Most Frequent Core Build', getCoreBuildItems(page, type))
    else
      @item_set["title"] = "Highest Winrate #{champKey} Build"
      createItemBlock('Highest Winrate Starting Build', getStartingItems(page, type))
      createItemBlock('Highest Winrate Core Build', getCoreBuildItems(page, type))
    end

    createItemBlock('Trinkets', ['3361', '3362', '3363', '3364'])

    createItemBlock('Consumables', ['2003', '2004', '2043', '2044', '2041', '2138', '2137', '2140', '2139'])

    return @item_set
  end

  private

  def getCoreBuildItems(page, type)
    buildIndex = getBuildIndex(type)

    coreBuildContainer = page.at('div:contains("Most Frequent Core Build")').parent

    coreBuild = coreBuildContainer.css('.build-wrapper')[buildIndex].css('a')
    coreBuildItems = []
    coreBuild.each do |item|
      itemID = getItemId(item.css('img').attr('src').value)
      coreBuildItems.push(itemID)
    end

    return coreBuildItems
  end

  def getStartingItems(page, type)
    buildIndex = getBuildIndex(type) + 2

    startingBuildContainer = page.at('div:contains("Most Frequent Starters")').parent

    startingBuild = startingBuildContainer.css('.build-wrapper')[buildIndex].css('a')
    startingBuildItems = []
    startingBuild.each do |item|
      itemID = getItemId(item.css('img').attr('src').value)
      startingBuildItems.push(itemID)
    end

    ['3340', '3341', '3342'].each do |trinket|
      startingBuildItems.push(trinket)
    end

    return startingBuildItems
  end

  def getBuildIndex(type)
    buildIndex = 0

    if type == 'mostFrequent'
      buildIndex = 0
    else
      buildIndex = 1
    end

    return buildIndex
  end

  def getItemId(uri)
    uriParsed = URI.parse(uri)

    return File.basename(uriParsed.path, ".*")
  end
end