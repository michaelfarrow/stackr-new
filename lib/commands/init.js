var command = require('lib/command')
var terraform = require('lib/terraform')('digitalocean')
var async = require('async')
var _ = require('lodash')
var fs = require('fs-extra')

var ensureSSH = function (callback) {
  fs.ensureDirSync('.stackr/ssh')
  if (!fs.pathExistsSync('.stackr/ssh/id_rsa') || !fs.pathExistsSync('.stackr/ssh/id_rsa.pub')) {
    fs.emptyDirSync('.stackr/ssh')
    return async.series([
      async.apply(docker.pull, images.keygen),
      async.apply(docker.run, images.keygen, [], ['.stackr/ssh:/sshkey'])
    ], callback)
  }
  callback(null)
}

var writeDigitaloceanToken = function (token, callback) {
  if (!token) callback(null)
  fs.writeFile('config/do_token', token, 'utf8', callback)
}

module.exports = command(function (token, callback) {
  token = token || require('lib/digitalocean').token()
  var keys = _.filter(fs.readdirSync('config/keys'), function (file) {
    return file[0] !== '.'
  })
  async.series([
    ensureSSH,
    async.apply(terraform.apply.bind(terraform), {
      state: '/state/digitalocean.tfstate',
      var: [
        'do_token=' + token,
        'ssh_keys=' + keys.join(',')
      ]
    }),
    async.apply(writeDigitaloceanToken, token)
  ], callback)
})
