var _ = require('lodash')
var async = require('async')
var fs = require('fs-extra')
var docker = require('lib/docker')

fs.ensureDirSync('../.stackr/state')

var Terraform = function (rootModule) {
  this.image = 'amontaigu/terraform'
  this.rootModule = rootModule
}

Terraform.prototype.cmd = function (cmd, args, callback) {
  cmd = _.isArray(cmd) ? cmd : [cmd]
  _.each(args, function (value, key) {
    var values = _.isArray(value) ? value : [value]
    _.each(values, function (val) {
      cmd.push('-' + key)
      cmd.push(val)
    })
  })
  var binds = [
    '.stackr/ssh:/ssh',
    '.stackr/state:/state',
    'config:/config',
    'terraform/' + this.rootModule + ':/data',
    'terraform/_modules:/modules'
  ]
  async.series([
    async.apply(docker.pull, this.image),
    async.apply(docker.run, this.image, 'init', binds),
    async.apply(docker.run, this.image, cmd, binds)
  ], callback)
}

Terraform.prototype.apply = function (args, callback) {
  this.cmd('apply', args, callback)
}

module.exports = function (rootModule) {
  return new Terraform(rootModule)
}
