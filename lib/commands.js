var async = require('async')
var _ = require('lodash')

module.exports = function (commands, callback) {
  callback = callback || function (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  }
  async.eachSeries(commands, function (command, callback) {
    var cmd
    var args = []
    if (_.isString(command)) {
      cmd = command
    } else if (_.isArray(command)) {
      cmd = command.shift()
      args = command
    } else {
      callback(new Error('command is neither a string or an array'))
    }
    var originalCmd = cmd
    cmd = cmd.split('.')
    var f = require('lib/commands/' + cmd.shift())
    cmd = cmd.join('.')
    if (cmd.length > 0) {
      f = _.get(f, cmd)
    }
    if (!f || !_.isFunction(f)) {
      return callback('function "' + originalCmd + '" does not exist')
    }
    args.push(callback)
    f.apply(this, args)
  }, callback)
}
