var command = require('lib/command')
var ansible = require('lib/ansible')
var async = require('async')

module.exports = command(function (playbook, options, callback) {
  if (!callback) {
    callback = options
    options = {}
  }
  async.series([
    async.apply(ansible.play.bind(ansible), playbook, options)
  ], callback)
})
