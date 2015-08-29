javaPath = ""
closurePath = ""
closureStylesPath = ""

if ARGV[0] == "jacob"
  javaPath = "C:/Program Files (x86)/Java/jre1.8.0_45/bin/java.exe" 
  closurePath = "C:/Tools/closure-compiler/compiler.jar"
  closureStylesPath = "C:/Tools/closure-compiler/closure-stylesheets.jar"
elsif ARGV[0] == "jason"
  javaPath = "/usr/bin/java" 
  closurePath = "/Users/jasonyang/Desktop/compiler.jar"
  closureStylesPath = "/Users/jasonyang/Desktop/closure-stylesheets.jar"
end

version = "0.2.1"

combinedJSOutputPath = "public/js/bildr.js"
minifiedJSOutputPath = "public/js/bildr-min-#{version}.js"

combinedCSSOutputPath = "public/styles/bildr.css"
minifiedCSSOutputPath = "public/styles/bildr-min-#{version}.css"

jsFiles = [
  "public/js/src/globals.js",
  "public/js/src/item-block.js",
  "public/js/src/buttons.js",
  "public/js/src/drag-and-drop.js",
  "public/js/src/items-and-set.js"
]

cssFiles = [
  "public/styles/src/all-items.css",
  "public/styles/src/filter.css",
  "public/styles/src/item-blocks.css",
  "public/styles/src/menu.css",
  "public/styles/src/modals.css",
  "public/styles/src/presets.css",
  "public/styles/src/set-info.css",
  "public/styles/src/styles.css",
  "public/styles/src/tabs.css"
]

# Concatenating Files

combinedJSFileContent = ""
combinedCSSFileContent = ""

jsFiles.each do |filePath|
  fileContents = File.read(filePath)
  combinedJSFileContent = combinedJSFileContent + "\n" + fileContents
end

cssFiles.each do |filePath|
  fileContents = File.read(filePath)
  combinedCSSFileContent = combinedCSSFileContent + "\n" + fileContents
end

File.open(combinedJSOutputPath, 'w') { |file| file.write(combinedJSFileContent) }
File.open(combinedCSSOutputPath, 'w') { |file| file.write(combinedCSSFileContent) }

# Minifying Files

`"#{javaPath}" -jar "#{closurePath}" --js "#{combinedJSOutputPath}" --js_output_file "#{minifiedJSOutputPath}"`
`"#{javaPath}" -jar "#{closureStylesPath}" --allow-unrecognized-functions "#{combinedCSSOutputPath}" > "#{minifiedCSSOutputPath}`

# Delete combined files

File.delete(combinedJSOutputPath)
File.delete(combinedCSSOutputPath)

puts "Built " + minifiedJSOutputPath
puts "Built " + minifiedCSSOutputPath
