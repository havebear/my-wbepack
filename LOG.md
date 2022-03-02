## 日志

### Node 开启 ESM 支持

在 package.json 中新增：

``` json
"type": "module"
```

### 同步获取文件

``` js
import fs from 'fs'

fs.readFileSync('./example/main.js')
// 文件的二进制流
fs.readFileSync('./example/main.js', { encoding: 'utf-8' })
// 文件的 utf-8 文本
```

### 获取依赖

- 正则
- AST（抽象语法树）

### 通过 AST 获取依赖

[在线调试](https://astexplorer.net/)

通过 @babel/parser 生成 AST

通过 @babel/traverse 遍历 AST


