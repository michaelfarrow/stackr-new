var _ = require('lodash')

module.exports = function (f) {
  return function () {
    var args = [].slice.call(arguments)
    if (!_.isFunction(args[args.length - 1])) {
      args.push(function (err) {
        if (err) {
          console.error(err)
          process.exit(1)
        }
      })
    }
    f.apply(this, args)
  }
}
