export var pi = Math.PI
export var tau = 2 * pi

export function rotatePoint(x, y, theta) {
  return [
    Math.cos(theta) * x + -Math.sin(theta) * y, // x
    Math.sin(theta) * x + Math.cos(theta) * y, // y
  ]
}
