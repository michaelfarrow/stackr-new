var command = require('lib/command')
var _ = require('lodash')
var fs = require('fs-extra')
var glob = require('glob')

var readStateOuput = function (path) {
  var state = fs.readFileSync(path, 'utf8')
  state = JSON.parse(state)
  var rootModule = _.find(state.modules, { path: ['root'] })
  return rootModule ? rootModule.outputs : null
}

var hostList = function (output, stack) {
  var list = []
  _.each(_.get(output, 'ip_public.value', []), function (ip, resource) {
    var out = ip
    out += ' resource_id=' + resource
    if (stack) {
      out += ' stack=' + stack
    }
    list.push(out)
  })
  return list
}

module.exports = {
  update: command(function (callback) {
    var managerState = readStateOuput('.stackr/state/manager.tfstate')
    var workerState = _.map(glob.sync('.stackr/state/worker-*.tfstate'), function (file) {
      return {
        stack: /worker-(.*?)\.tfstate$/g.exec(file)[1],
        output: readStateOuput(file)
      }
    })

    var out = []

    var managerList = hostList(managerState)
    var workerList = _.flatten(_.map(workerState, function (worker) {
      return hostList(worker.output, worker.stack)
    }))

    out.push('[node]')
    out = _.concat(out, managerList)
    out = _.concat(out, workerList)

    out.push('')

    out.push('[manager]')
    out = _.concat(out, managerList)

    out.push('')

    out.push('[manager-leader]')
    out.push(managerList[0])

    out.push('')

    out.push('[worker]')
    out = _.concat(out, workerList)

    out.push('')

    fs.writeFileSync('.stackr/state/hosts', out.join('\n'), 'utf8')

    callback(null)
  })
}
