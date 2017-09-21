var _ = require('lodash')
var fs = require('fs-extra')

var stateDigitalocean = fs.readFileSync('.stackr/state/digitalocean.tfstate', 'utf8')
stateDigitalocean = JSON.parse(stateDigitalocean)

var keyFingerprint = _.get(stateDigitalocean, 'modules.0.outputs.key_fingerprint.value')
if (!keyFingerprint) {
  console.error('key does not exist, please run stackr init first')
  process.exit(1)
}

module.exports = keyFingerprint
