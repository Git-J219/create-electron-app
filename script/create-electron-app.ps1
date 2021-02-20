if($args.Count -lt 1){
    echo Usage: create-electron-app `<name`> [`<readable name`>]
    exit
}

if($args.Count -gt 2){
    echo More arguments than 2 (did you forget `"`"?)
    exit
}

if($args.Count -eq 2){
    node.exe $PSScriptRoot\..\cea.js $args[0] $args[1]
}else{
    node.exe $PSScriptRoot\..\cea.js $args[0] $args[0]
}
