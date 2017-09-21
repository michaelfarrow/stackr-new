var _ = require('lodash')
var CLI = require('clui')
var screen = require('lib/screen')

var oneLine = function (str) {
  return str.replace(/(?:\r\n|\r|\n)/g, ' | ')
}

var Progress = function (message) {
  this.message = message
  this.items = []
}

Progress.prototype.renderProgress = screen(function (buffer) {
  var items = this.items
  var message = this.message
  var footerMessage = this.footerMessage
  if (message !== undefined) {
    message = _.isArray(message) ? message : [message]
    new CLI.Line(buffer)
      .column(oneLine(message.join(' ')), buffer.width())
      .fill()
      .store()
    buffer.blankLine()
  }
  if (items.length) {
    var maxNameItem = _.maxBy(items, function (item) { return (item.name || item.id || '').length })
    var maxNameLength = (maxNameItem.name || maxNameItem.id || '').length
    items.forEach(function (item) {
      var bar = new CLI.Progress(20)
      new CLI.Line(buffer)
        .column(item.name || item.id, maxNameLength + 1)
        .column(bar.update(item.current, item.total), buffer.width() - maxNameLength - 1)
        .fill()
        .store()
    })
  }
  if (footerMessage) {
    buffer.blankLine()
    new CLI.Line(buffer)
      .column(oneLine(footerMessage), buffer.width())
      .fill()
      .store()
  }
})

Progress.prototype.update = function (id, name, current, total) {
  var item = _.find(this.items, {id: id})
  if (!item) {
    item = { id: id }
    this.items.push(item)
  }
  item.name = name
  item.current = current
  item.total = total
}

Progress.prototype.footer = function (str) {
  str = _.isArray(str) ? str : [str]
  this.footerMessage = str.join(' ')
}

Progress.prototype.output = function () {
  this.renderProgress()
}

module.exports = Progress
