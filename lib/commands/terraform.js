var command = require('lib/command')

module.exports = {
  apply: command(function (module, args, callback) {
    var terraform = require('lib/terraform')(module)
    terraform.apply(args, callback)
  })
}
