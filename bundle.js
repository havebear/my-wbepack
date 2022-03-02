(function (modules) {
  function require (id) {
    const [ fn, mapping ] = modules[id]
    
    const module = {
      exports: {}
    }

    function localRequire (filePath) {
      const id = mapping[filePath]
      return require(id)
    }

    fn (localRequire, module, module.exports)

    return module.exports
  }

  require(1)
})({
  1: [
    function (require, module, exports) {
      function foo () {
        console.log('foo')
      }
  
      module.exports = {
        foo
      }
    },
    {}
  ],
  2: [
    function (require, module, exports) {
      function bar () {
        console.log('bar')
      }
  
      module.exports = {
        bar
      }
    },
    { './foo.js': 2 }
  ]
})
