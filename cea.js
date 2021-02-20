const child_process = require('child_process');
const fs = require('fs-extra');
const path = require('path');


const deps = [
    "electron-squirrel-startup"
];

const devDeps = [
    "@electron-forge/cli",
    "electron"
];

const dir = process.argv[2];
const pName = process.argv[3];



if (!/^[a-z0-9-~][a-z0-9-._~]*$/.test(dir)) {
    throw new Error("Directory name did not match rules");
}

const packageJson = {
    "name": dir,
    "productName": pName,
    "version": "1.0.0",
    "description": "My Electron application description",
    "main": "src/index.js",
    "scripts": {
        "start": "electron-forge start"
    },
    "author": "Git-J219",
    "keywords": [],
    "license": "MIT",
    "config": {
        "forge": {
            "packagerConfig": {
                "icon": "src/icons/icon",
                "appCopyright": `Copyright (c) ${new Date().getFullYear()} Git-J219, All rights reserved`
            }
        }
    }
}


if (!dir) {
    throw new Error('Please specify directory');
}

if (!pName) {
    throw new Error('Please specify product name');
}

if (fs.existsSync(path.join(process.cwd(), dir))) {
    throw new Error('Directory exist');
}
console.log('copying template');
fs.copySync(path.join(__dirname, "template"), path.join(process.cwd(), dir))


process.chdir(path.join(process.cwd(), dir));
console.log('writing package.json');
fs.writeJSONSync(path.join(process.cwd(), "package.json"), packageJson, { spaces: 4 });

console.log('installing deps');
child_process.execSync(`npm i ${deps.join(' ')}`, {stdio: 'inherit'});
console.log('installing devDeps');
child_process.execSync(`npm i ${devDeps.join(' ')} --save-dev`, {stdio: 'inherit'});

console.log('git repo init')
child_process.execSync(`git init`, {stdio: 'inherit'});
console.log('comiting new files');

child_process.execSync(`git add *`, {stdio: 'inherit'});

child_process.execSync(`git commit -m "Initial Commit"`, { stdio: 'inherit' });
console.log("completed");
