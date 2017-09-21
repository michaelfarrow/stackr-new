var program = require('commander')
var _ = require('lodash')

console.clear = function () {
  return process.stdout.write('\033c');
}

var parse = program.parse
program.parse = function () {
  var res = parse.apply(this, arguments)
  this.options.forEach(function (option) {
    if (option.required && res[option.name()] === undefined) {
      res.optionMissingArgument(option)
    }
  })
  return res
}

program.exitWithError = function(message) {
  var args = [].slice.call(arguments)
  if (args.length == 1 && _.isError(args[0]) && args[0].message) args = [args[0].message]
  console.error.apply(console, args)
  process.exit(1)
}

program.argsToArray = function(args) {
  return [].slice.call(args)
}

module.exports = program
