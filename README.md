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

## Plugin