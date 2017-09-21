var command = require('lib/command')
var ansible = require('lib/ansible')
var async = require('async')

module.exports = command(function (playbook, args, callback) {
  if (!callback) {
    callback = args
    args = []
  }
  async.series([
    async.apply(ansible.play.bind(ansible), playbook, args)
  ], callback)
})
