#!/usr/bin/env bash

version="`date +%Y-%m-%d\ %H:%M:%S`"

echo "Start compile $version"

git add .
git commit -m"init $version"

# 编译
export REACT_APP_PACKAGE_VERSION=$version
node scripts/build.js

echo "End compile $version"

# cp ../public/tonconnect-manifest.json ../docs

git add .
git commit -m "Deploy for $version"

echo "Start push $version"

git push
echo "Complete $version"
