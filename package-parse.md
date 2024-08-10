```jsonc
{
  // React UI 组件
  "@headlessui/react": "^2.1.2",
  // mdxjs 的 webpack 解析 loader
  "@mdx-js/loader": "^3.0.1",
  // mdxjs 的 react 上下文
  "@mdx-js/react": "^3.0.1",
  // postcss 插件
  "@tailwindcss/nesting": "0.0.0-insiders.565cd3e",
  // remark 插件
  "@theguild/remark-npm2yarn": "^0.3.0",
  // postcss 插件
  "autoprefixer": "^10.4.20",
  // 跨平台的文件监听
  "chokidar": "^3.6.0",
  // 构建 className 字符串的
  "clsx": "^2.1.1",
  // 优化命令行
  "commander": "^12.1.0",
  "css-loader": "^7.1.2",
  "file-loader": "^6.2.0",
  // fs 扩展，增加非常有用的工具函数 copy pathExists remove
  "fs-extra": "^11.2.0",
  // 将 webpack 生成的文件以标签的形式注入到 html 文件中
  "html-webpack-plugin": "^5.6.0",
  // Node.js 的运行时 Typescript 和 ESM 支持。
  "jiti": "^1.21.6",
  // 校验数据
  "joi": "^17.13.3",
  "katex": "^0.16.11",
  "mini-css-extract-plugin": "^2.9.0",
  "postcss": "^8.4.41",
  "postcss-cli": "^11.0.0",
  "postcss-import": "^16.1.0",
  "postcss-lightningcss": "^1.0.0",
  "postcss-loader": "^8.1.1",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  // 控制文档头，优化 SEO
  "react-helmet-async": "^2.0.5",
  "react-router": "^6.26.0",
  "react-router-dom": "^6.26.0",
  "rehype-katex": "^7.0.0",
  "remark-gfm": "^4.0.0",
  "remark-math": "^6.0.0",
  "style-loader": "^4.0.0",
  "swc-loader": "^0.2.6",
  // css 框架
  "tailwindcss": "^3.4.7",
  // typescript importedHelper 需要使用，降低编译后代码的数量，起到压缩代码体积的作用。
  "tslib": "^2.6.3",
  "url-loader": "^4.1.1",
  "webpack": "^5.93.0",
  "webpack-dev-server": "^5.0.4",
  "webpack-merge": "^6.0.1",
  "webpackbar": "^6.0.1"
}
```

## markdown plugin

remark-gfm -- remark 插件，支持 GFM

remark-math -- remark 插件，支持 markdown 中的数学语法

katex -- 进行 TeX 数学渲染

rehype-katex -- rehype 插件，使用 KaTeX 在 HTML 中呈现数学

rehype-pretty-code

rehype-raw

### npm bash 命令

@theguild/remark-npm2yarn -- remark 插件，将 npm bash 命令转换为带有标签的 yarn/pnpm

## ps

`@tailwindcss/nesting` 这是一个 PostCSS 插件，它包装 postcss-nested 或 postcss-nesting 并充当兼容层，以确保您选择的嵌套插件正确理解自定义语法，如 @apply 和 @screen。

`autoprefixer` PostCSS 插件用于解析 CSS 并使用 Can I Use 中的值将浏览器厂商前缀添加到 CSS 规则。Autoprefixer 将使用基于当前浏览器流行度和属性支持的数据为您应用前缀。

## collect

@svgr/webpack 将 SVG 转换为 React 组件

## webpack

file-loader 将文件上的 import/require() 解析为 url，并将文件发送到输出目录。

url-loader 如果文件小于字节限制，则可以返回 DataURL。指定当目标文件的大小超出选项中设置的限制时使用的备用加载器（默认值 file-loader）。

在 webpack 5 之前，通常使用：

- [`raw-loader`](https://v4.webpack.js.org/loaders/raw-loader/) 将文件导入为字符串
- [`url-loader`](https://v4.webpack.js.org/loaders/url-loader/) 将文件作为 data URI 内联到 bundle 中
- [`file-loader`](https://v4.webpack.js.org/loaders/file-loader/) 将文件发送到输出目录

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

- `asset/resource` 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
- `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
- `asset/source` 导出资源的源代码。之前通过使用 `raw-loader` 实现。
- `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

当在 webpack 5 中使用旧的 assets loader（如 `file-loader`/`url-loader`/`raw-loader` 等）和 asset 模块时，你可能想停止当前 asset 模块的处理，并再次启动处理，这可能会导致 asset 重复，你可以通过将 asset 模块的类型设置为 `'javascript/auto'` 来解决。
