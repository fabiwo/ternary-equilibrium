// Pentagon reference: http://mathworld.wolfram.com/Pentagon.html
import { tau } from './utils.js'
import { rotatePoint } from './utils.js'

var circumradiusCoeff = (1 / 10) * Math.sqrt(50 + 10 * Math.sqrt(5)) // ~ 0.85065080835204

function circumradius(side) {
  return side * circumradiusCoeff
}

function sideLength(area) {
  var num = 4 * area
  var denom = Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) // ~ 6.881909602355868

  return Math.sqrt(num / denom)
}

export var pentagon = {
  draw: function (context, size) {
    var s = sideLength(size)
    var R = circumradius(s)
    var theta = -tau / 4 // Rotate 1/4 turn back so the shape is oriented with a point upward.

    context.moveTo.apply(context, rotatePoint(R, 0, theta))

    for (var i = 0; i < 5; ++i) {
      var a = (tau * i) / 5
      var x = Math.cos(a) * R
      var y = Math.sin(a) * R

      context.lineTo.apply(context, rotatePoint(x, y, theta))
    }

    context.closePath()
  },
}
