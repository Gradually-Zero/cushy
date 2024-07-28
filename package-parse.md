```jsonc
{
  "@headlessui/react": "^2.0.4",
  // mdxjs 的 webpack 解析 loader
  "@mdx-js/loader": "^3.0.1",
  // mdxjs 的 react 上下文
  "@mdx-js/react": "^3.0.1",
  // postcss 插件
  "@tailwindcss/nesting": "0.0.0-insiders.565cd3e",
  "@theguild/remark-npm2yarn": "^0.3.0",
  // postcss 插件
  "autoprefixer": "^10.4.19",
  // 跨平台的文件监听
  "chokidar": "^3.6.0",
  // 构建 className 字符串的
  "clsx": "^2.1.1",
  // 优化命令行
  "commander": "^12.1.0",
  "css-loader": "^7.1.2",
  // fs 扩展，增加非常有用的工具函数 copy pathExists remove
  "fs-extra": "^11.2.0",
  // 将 webpack 生成的文件以标签的形式注入到 html 文件中
  "html-webpack-plugin": "^5.6.0",
  // Node.js 的运行时 Typescript 和 ESM 支持。
  "jiti": "^1.21.6",
  // 校验数据
  "joi": "^17.13.1",
  "katex": "^0.16.11",
  "mini-css-extract-plugin": "^2.9.0",
  "postcss": "^8.4.39",
  "postcss-cli": "^11.0.0",
  "postcss-import": "^16.1.0",
  "postcss-lightningcss": "^1.0.0",
  "postcss-loader": "^8.1.1",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  // 控制文档头，优化 SEO
  "react-helmet-async": "^2.0.5",
  "react-router": "^6.23.1",
  "react-router-dom": "^6.23.1",
  "rehype-katex": "^7.0.0",
  "remark-gfm": "^4.0.0",
  "remark-math": "^6.0.0",
  "style-loader": "^4.0.0",
  "swc-loader": "^0.2.6",
  "tailwindcss": "^3.4.4",
  // typescript importedHelper 需要使用，降低编译后代码的数量，起到压缩代码体积的作用。
  "tslib": "^2.6.3",
  "webpack": "^5.92.0",
  "webpack-dev-server": "^5.0.4",
  "webpack-merge": "^5.10.0",
  "webpackbar": "^6.0.1"
}
```

## math

remark-math — remark 插件，支持 markdown 中的数学语法

rehype-katex — rehype 插件，使用 KaTeX 在 HTML 中呈现数学

remark-gfm

@theguild/remark-npm2yarn

remark-math

katex

rehype-katex

rehype-pretty-code

rehype-raw

## ps

`@tailwindcss/nesting` 这是一个 PostCSS 插件，它包装 postcss-nested 或 postcss-nesting 并充当兼容层，以确保您选择的嵌套插件正确理解自定义语法，如 @apply 和 @screen。

`autoprefixer` PostCSS 插件用于解析 CSS 并使用 Can I Use 中的值将浏览器厂商前缀添加到 CSS 规则。Autoprefixer 将使用基于当前浏览器流行度和属性支持的数据为您应用前缀。
