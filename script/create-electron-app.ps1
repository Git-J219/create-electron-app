if($args.Count -lt 1){
    echo "Usage: create-electron-app `<name`> [`<readable name`>]"
    exit
}

if($args.Count -gt 2){
    echo "More arguments than 2 `(did you forget `"`"?`)"
    exit
}

if($args[0] -match '^[a-z0-9-~][a-z0-9-._~]*$'){
if($args.Count -eq 2){
    node.exe $PSScriptRoot\..\cea.js $args[0] $args[1]
}else{
    node.exe $PSScriptRoot\..\cea.js $args[0] $args[0]
}
}else{
    echo "Name did not match rules:"
    echo "- allowed characters: a - z (small), 0 - 9, -, *, ~, ., _"
    echo "- . and _ are not allowed as character 1"
    exit
}
