var _ = require('lodash')
var path = require('path')
var Docker = require('dockerode')
var screen = require('lib/screen')
var Progress = require('lib/Progress')
var CLI = require('clui')

var docker = new Docker()

// docker
//   .pull('ubuntu')
//   .run('ubuntu', ['bash', '-c', 'uname -a'], process.stdout).then(function(container) {
//     console.log(container.output.StatusCode)
//     return container.remove()
//   }).then(function(data) {
//     console.log('container removed')
//   }).catch(function(err) {
//     console.log(err)
//   })

var pad = function (str, len) {
  str = str || ''
  return str + Array(len + 1 - str.length).join(' ')
}

var imageName = function (image) {
  image = image.split(':')
  if (image.length == 1) image.push('latest')
  return image.join(':')
}

var monitorProgress = function (stream, message, callback) {
  var progress = new Progress(message)
  var validStatuses = ['Waiting', 'Downloading', 'Extracting']
  var maxStatusLength = _.maxBy(validStatuses, 'length').length
  docker.modem.followProgress(stream, callback, onProgress)
  var spinner = new CLI.Spinner('Building')
  function onProgress (event) {
    if (event.stream) {
      progress.footer(event.stream.trim())
      progress.output()
    } else if (event.progressDetail && event.id && event.status) {
      var status = event.status
      var current = event.progressDetail.current || 0
      var total = event.progressDetail.total || 100
      if (status === 'Download complete' || status === 'Pull complete') {
        status = 'Downloading'
        current = total = 100
      }
      var state = status === 'Extracting' ? 'extracting' : 'downloading'
      if (validStatuses.indexOf(status) !== -1) {
        progress.update(
          event.id + '_' + state,
          event.id + ' ' + status,
          current,
          total
        )
        progress.output()
      }
    }
  }
}

var pull = function (image, callback) {
  console.clear()
  image = imageName(image)
  docker.pull(image, function (err, stream) {
    if (err) return callback(err)
    monitorProgress(stream, 'Downloading ' + image, callback)
  })
}

var run = function (image, cmd, binds, callback) {
  console.clear()
  cmd = _.isArray(cmd) ? cmd : [cmd]
  binds = _.map(binds, function (bind) {
    var splitBind = bind.split(':')
    if (splitBind.length > 1) {
      splitBind[0] = path.join(__dirname, '../', splitBind[0])
    }
    return splitBind.join(':')
  })
  docker.run(image, cmd, process.stdout, {
    'Hostconfig': {
      'Binds': binds
    }
  }, function (err, data, container) {
    if (err) return callback(err)
    container.remove(function () {
      callback(null, data, container)
    })
  })
}

var build = function (tag, source, callback) {
  console.clear()
  docker.buildImage({
    context: path.resolve(__dirname, '../', source),
    src: ['Dockerfile']
  }, {t: tag}, function (err, stream) {
    if (err) return callback(err)
    monitorProgress(stream, 'Building ' + tag, callback)
  })
}

module.exports = {
  build: build,
  pull: pull,
  run: run
}
