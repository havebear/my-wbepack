/*
 * @Author: BGG
 * @Date: 2022-03-04 15:04:46
 * @LastEditors: BGG
 * @LastEditTime: 2022-03-04 15:16:09
 * @Description:  改变输出路径插件
 */

export class ChangeOutputPath {
  apply (hooks) {
    hooks.emitFile.tap('changeOutputPath', context => {
      console.log('changeOutputPath')
      context.changeOutputPath('./dist/custom.js')
    })
  }
}
