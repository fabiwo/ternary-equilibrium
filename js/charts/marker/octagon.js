// Octagon reference: http://mathworld.wolfram.com/Octagon.html
import { tau } from './utils.js'
import { rotatePoint } from './utils.js'

var circumradiusCoeff = (1 / 2) * Math.sqrt(4 + 2 * Math.sqrt(2)) // ~ 1.3065629648763766

function circumradius(side) {
  return side * circumradiusCoeff
}

function sideLength(area) {
  var num = area * (1 - Math.sqrt(2))
  var denom = 2
  return Math.sqrt((-1 * num) / denom)
}

function drawBuild(theta) {
  var t = theta || 0

  return function draw(context, size) {
    var s = sideLength(size)
    var R = circumradius(s)

    context.moveTo.apply(context, rotatePoint(R, 0, t))

    for (var i = 0; i < 8; ++i) {
      var a = (tau * i) / 8
      var x = Math.cos(a) * R
      var y = Math.sin(a) * R

      context.lineTo.apply(context, rotatePoint(x, y, t))
    }

    context.closePath()
  }
}

export var octagon = {
  draw: drawBuild(),
}

export var octagonAlt = {
  draw: drawBuild(tau / 16), // Rotate 1/16 turn back so the shape is oriented with flat top and bottom.
}
