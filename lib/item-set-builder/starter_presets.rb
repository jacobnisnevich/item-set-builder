class StarterPresets < SetGenerator
  def getStarterPreset(presetName)
  	@item_set["title"] = presetName

  	file = File.read(Dir.pwd + '/lib/starter-presets.json')
    starter_presets = JSON.parse(file)

    createItemBlock(presetName + " Starters", starter_presets[presetName])

    return @item_set
  end
end