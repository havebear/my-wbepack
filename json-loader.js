/*
 * @Author: BGG
 * @Date: 2022-03-03 15:13:33
 * @LastEditors: BGG
 * @LastEditTime: 2022-03-03 15:37:39
 * @Description:  JSON Loader
 */

export function jsonLoader (source) {

  this.addDeps('json-loader')

  return `export default ${JSON.stringify(source)}`
}
