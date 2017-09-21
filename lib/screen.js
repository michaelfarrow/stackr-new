var CLI = require('clui')

CLI.LineBuffer.prototype.blankLine = function () {
  new CLI.Line(this).fill().store()
}

module.exports = function (render) {
  return function () {
    var args = [].slice.call(arguments)
    var outputBuffer = new CLI.LineBuffer({
      x: 0,
      y: 0,
      width: 'console',
      height: 'console'
    })
    // var output = outputBuffer.output
    // outputBuffer.output = function () {
    //   this.lines.forEach(function (line) {
    //     line.width = outputBuffer.width()
    //     console.log(line)
    //   })
    //   process.exit()
    //   return output.apply(this, arguments)
    // }
    args.unshift(outputBuffer)
    render.apply(this, args)
    // outputBuffer.fill(new CLI.Line().fill())
    outputBuffer.output()
  }
}
