# USAGE

## develop

### 依赖安装

- `npm run install-dep`

### 开发

直接在 main 分支就写代码就完事儿, 没有分支管理, 怎么简单怎么写.

PS: 需要关注下响应式, 因为测试 dapp 移动端钱包也会用到

## release

### 授权编译脚本

执行 `chmod -R a+x scripts/release.sh` 给编译脚本执行的权限

### 部署

开发完成并 `git commit` 之后, 执行 `npm run release` 即可, 测试页面会自动部署. 剩下的都不用管了 ~
