var _ = require('lodash')
var async = require('async')
var fs = require('fs-extra')
var docker = require('lib/docker')

fs.ensureDirSync('../state')

var Ansible = function () {
  this.image = 'ansible'
}

Ansible.prototype.play = function (book, options, callback) {
  options = _.defaults(options, {
    rawArgs: [],
    binds: [
      '.stackr/ssh:/root/.ssh',
      '.stackr/stacks:/stacks',
      '.stackr/roles:/roles',
      '.stackr/config:/config',
      'keys:/keys',
      'scripts:/scripts',
      'ansible:/ansible'
    ]
  })
  var args = _.concat([
    'ansible-playbook',
    book + '.yml'
  ], options.rawArgs)
  // args = _.concat(args, [
  //   '-i',
  //   '/state/hosts',
  //   book + '.yml'
  // ])
  async.series([
    async.apply(docker.build, this.image, 'ansible'),
    async.apply(docker.run, this.image, args, options.binds)
  ], callback)
}

module.exports = new Ansible()
