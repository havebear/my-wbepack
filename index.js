import fs from 'fs'
import path from 'path'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import ejs from 'ejs'
import { transformFromAst } from 'babel-core'
import { jsonLoader } from './json-loader.js'
import { ChangeOutputPath } from './change-output-path.js'
import { SyncHook } from 'tapable'

let id = 0

/** 配置 */
const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: jsonLoader
      }
    ]
  },
  plugins: [
    new ChangeOutputPath()
  ]
}

const hooks = {
  emitFile: new SyncHook(['context'])
}

// console.log(traverse)

/**
 * 创建资源
 * 1. 获取文件内容
 * 2. 获取依赖关系
 */
function createAsset (filePath) {

  // 获取文件内容
  let source = fs.readFileSync(filePath, { encoding: 'utf-8' })

  // console.log(source)

  /** initLoader */
  const loaders = webpackConfig.module.rules
  const loaderContext = {
    addDeps (dep) {
      console.log(dep)
    }
  }

  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      if (Array.isArray(use)) {
        [ ...use.reverse ].resolve.forEach(fn => {
          source = fn.call(loaderContext, source)
        })
      } else {
        source = use.call(loaderContext, source)
      }
    }
  })
  
  /**
   * 获取依赖关系
   * 1. 正则
   * 2. AST 抽象语法树 (本次使用)
   */
  // 生成 AST
  const ast = parser.parse(source, { sourceType: 'module' })
  // console.log(ast)

  const deps = []

  // 遍历 AST
  traverse.default(ast, {
    ImportDeclaration ({ node }) {
      // node.source.value 文件内容中引入的文件路径
      // console.log(node.source.value)
      deps.push(node.source.value)
    }
  })

  // 把代码中的 esm（import） 转为 cjs（require）
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })

  // console.log(code)

  return {
    filePath,
    code,
    deps,
    mapping: {},
    id: id++
  }
}

// const asset = createAsset()
// console.log(asset)

/**
 * 生成图
 */
function createGraph () {
  // 入口文件
  const mainAsset = createAsset('./example/main.js')

  // 遍历图（队列的方式遍历 - 广度优先）
  const queue = [ mainAsset ]

  for (const asset of queue) {
    asset.deps.forEach(relativePath => {
      const temp = createAsset(path.resolve('./example', relativePath))
      asset.mapping[relativePath] = temp.id
      queue.push(temp)
    })
  }

  return queue
}

function initPlugins () {
  const plugins = webpackConfig.plugins

  plugins.forEach(plugin => plugin.apply(hooks))
}

initPlugins()

// const graph = createGraph()
// console.log(graph)

/**
 * 根据图生成代码
 * @param {array}} graph 
 */
function build (graph) {

  const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' })
  // 模板数据
  const data = graph.map(({ id, code, mapping }) => {
    return {
      id,
      code,
      mapping
    }
  })
  const code = ejs.render(template, { data })

  let outputPath = './dist/bundle.js'

  const pluginContext = {
    changeOutputPath (path) {
      outputPath = path
    }
  }

  // console.log(data)
  // 发射事件
  hooks.emitFile.call(pluginContext)

  fs.writeFileSync(outputPath, code)
  
  // console.log(template)
}

build(createGraph())
