var fs = require('fs-extra')

var tokenPath = 'config/do_token'

module.exports = {
  token: function () {
    var token = process.env.DIGITALOCEAN_TOKEN
    if (!token && fs.pathExistsSync(tokenPath)) {
      token = fs.readFileSync(tokenPath, 'utf8')
    }
    if (!token) {
      console.error('please supply digitalocean token or run "stackr init"')
      process.exit(1)
    }
    return token
  }
}
