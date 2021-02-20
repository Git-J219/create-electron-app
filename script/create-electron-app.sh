if [ $# -lt 1 ]; then
    echo Usage: create-electron-app <name> [<readable name>]
    exit
fi

if [ $# -gt 2 ]; then
    echo More arguments than 2 (did you forget \"\"?)
    exit
fi
DIR=$(dirname `which $0`)
if [ $args.Count -eq 2 ]; then
    node $DIR/../cea.js $1 $2
else
    node $DIR/../cea.js $1 $1
fi
