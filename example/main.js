import { test, foo } from './foo.js'
import { bar } from './bar.js'
import data from './data.json'

foo()

bar()

console.log(test)

const { name, age } = JSON.parse(data)

console.log(name)
console.log(age)