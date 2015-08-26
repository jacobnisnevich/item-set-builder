Split-Path $MyInvocation.MyCommand.Path | Set-Location

$javaPath           = "C:\Program Files (x86)\Java\jre1.8.0_45\bin\java.exe" 
$closurePath        = "C:\Tools\closure-compiler\compiler.jar"

$version = "0.1.1"

$combinedOutputPath = "public\js\bildr.js"
$minifiedOutputPath = "public\js\bildr-min-$version.js"

New-Item $combinedOutputPath -type file -force | out-null
New-Item $minifiedOutputPath -type file -force | out-null

$files =
"public\js\src\globals.js",
"public\js\src\item-block.js",
"public\js\src\buttons.js",
"public\js\src\drag-and-drop.js",
"public\js\src\items-and-set.js"

# Concatenating Files

foreach($file in $files){
    Write-Host $file
    $item = Get-Item $file
    $fileContent = Get-Content $item
    Add-Content $combinedOutputPath $fileContent
}

# Minifying Files

& $javaPath -jar $closurePath --js $combinedOutputPath --js_output_file $minifiedOutputPath
echo "Built $minifiedOutputPath"
