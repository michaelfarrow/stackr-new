var _ = require('lodash')
var async = require('async')
var fs = require('fs-extra')
var docker = require('lib/docker')

fs.ensureDirSync('../state')

var Ansible = function () {
  this.image = 'ansible_playbook'
}

Ansible.prototype.play = function (book, args, callback) {
  var binds = [
    '.stackr/ssh:/root/.ssh',
    '.stackr/state:/state',
    '.stackr/stacks:/stacks',
    'scripts:/scripts',
    'config:/config',
    'ansible:/ansible/playbooks'
  ]
  args = _.concat(args, [
    '-i',
    '/state/hosts',
    book + '.yml'
  ])
  async.series([
    async.apply(docker.build, this.image, 'ansible'),
    async.apply(docker.run, this.image, args, binds)
  ], callback)
}

module.exports = new Ansible()
