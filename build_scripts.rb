javaPath = ""
closurePath = ""

if ARGV[0] == "jacob"
  javaPath = "C:/Program Files (x86)/Java/jre1.8.0_45/bin/java.exe" 
  closurePath = "C:/Tools/closure-compiler/compiler.jar"
elsif ARGV[0] == "jason"
  javaPath = "/usr/bin/java" 
  closurePath = "/Users/jasonyang/Desktop/compiler.jar"
end

version = "0.2.1"

combinedOutputPath = "public/js/bildr.js"
minifiedOutputPath = "public/js/bildr-min-#{version}.js"

files = [
  "public/js/src/globals.js",
  "public/js/src/item-block.js",
  "public/js/src/buttons.js",
  "public/js/src/drag-and-drop.js",
  "public/js/src/items-and-set.js"
]

# Concatenating Files

combineFileContent = ""

files.each do |filePath|
  fileContents = File.read(filePath)
  combineFileContent = combineFileContent + "\n" + fileContents
end

File.open(combinedOutputPath, 'w') { |file| file.write(combineFileContent) }

# Minifying Files

`"#{javaPath}" -jar "#{closurePath}" --js "#{combinedOutputPath}" --js_output_file "#{minifiedOutputPath}"`

puts "Built " + minifiedOutputPath
