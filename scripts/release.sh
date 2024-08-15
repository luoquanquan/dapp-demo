#!/usr/bin/env bash

package_name="`date +%Y%m%d%H%M`-dapp-demo"
version="`date +%Y-%m-%d\ %H:%M:%S`"


echo "Start compile $version"

git add .
git commit -m"init $version"

# 编译
export REACT_APP_PACKAGE_VERSION=$version
node scripts/build.js

echo "End compile $version"

# 缓存编译结果
git stash -u

# 切换到目标分支
git checkout release

# 移除之前的 docs
rm -rf docs/
git add .
git commit -m'Delete old files'

# 取出新的编译结果
git stash pop

# 打压缩包, 供下载使用
# mv docs $package_name
# mkdir $package_name/dapp-demo
# mv $package_name/static $package_name/dapp-demo/static
# zip -r ./$package_name.zip $package_name

# 打完压缩包之后改回原来的名字
# mv $package_name docs
# mv $package_name.zip docs
# mv docs/dapp-demo/static docs/static
git add .
git commit -m "Deploy for $version"

echo "Start push $version"

git push
git checkout main

git push
echo "Complete $version"

# clean
rimraf docs
