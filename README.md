# MyWebpack

## 核心

### 思路

多个小模块打包成一个大模块。

### 流程（任务）

- 根据模块之间的依赖关系，生成图
- 根据图，生成对应脚本

### 生成图

>前提是获取模块内部的 **内容** 和 **依赖关系**，才能构建出一张图。

**获取内容：**

通过 fs 模块获取文件内容

``` js
import fs from 'fs'

const source = fs.readFileSync('./example/main.js', { encoding: 'utf-8' })
```

**获取依赖关系：**

根据文件内容生成 AST

``` js
import parser from '@babel/parser'

parser.parse(source, { sourceType: 'module' })
```

遍历 AST


``` js
// 遍历 AST
import traverse from '@babel/traverse'

traverse.default(ast, {
  ImportDeclaration ({ node }) {
    // node.source.value 文件内容中引入的文件路径
    // console.log(node.source.value)
    deps.push(node.source.value)
  }
})
```

生成图

### 生成脚本


## Loader

作用：让 webpack 处理非 js

## Plugin

原理：基于事件机制实现

>webpack 在不同的阶段会发出不同的事件，通过插件去监听对应的事件，拿到暴露给开发者的对象，然后通过该对象上的一些方法，改变打包行为

如何实现事件机制？

直接使用 webpack 底层实现了的事件库 - Tapable




