bin 提供 cushy 命令

scripts 是捆绑过程中的一个 task. 复制文件 例如：packages\cushy\lib\webpack\templates

commands 提供不同操作命令

client 渲染端

webpack 捆绑相关

server 处理端

webpack 缓存目录 `packages\example\node_modules\.cache\webpack\cushy-client-development`

---

tslib 作用

typescript 如果启用了 importHelpers 选项，这些辅助函数将从 tslib 中被导入。 你需要确保 tslib 模块在运行时可以被导入。 这只影响模块，全局脚本文件不会尝试导入模块。

[typescript 之 tslib 是什么，你需要它吗](https://juejin.cn/post/7136104350912348174)

---

dev 流程

commands\dev.ts

读取 cushy.config 配置

合并 cushy.config 和 webpack 配置

根据合并后的配置生成编译器对象 compiler

配置 WebpackDevServer config

根据 devServerConfig 和 compiler 生成 devServer

启动 devServer

## tsconfig

文件含有 `.` `client.theme` 解析会有问题，client.theme 文件夹下的文件并没受到，tsconfig.client.json 配置。

## tailwindcss

[sanity#3884#issuecomment](https://github.com/sanity-io/sanity/issues/3884#issuecomment-1450403244)
[tailwindcss#6393#issuecomment](https://github.com/tailwindlabs/tailwindcss/issues/6393#issuecomment-1080723375)

## remark-gfm

[mdxjs#Migrating from v1 to v2](https://mdxjs.com/migrating/v2/)
[mdxjs#discussioncomment](https://github.com/orgs/mdx-js/discussions/2218#discussioncomment-4627849)

## 组成

bundler :

1. 构建编译 cushy. 现在由 tsc 完成
2. 编译构建 markdown site

command : 执行 cushy
server : tool for cushy
client : site for markdown
