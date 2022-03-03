/*
 * @Author: BGG
 * @Date: 2022-03-03 15:13:33
 * @LastEditors: BGG
 * @LastEditTime: 2022-03-03 15:21:57
 * @Description:  JSON Loader
 */

export function jsonLoader (source) {

  return `export default ${JSON.stringify(source)}`
}
