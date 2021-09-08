export function replaceInArray(arr, index, val) {
  arr[index] = val
  return arr
}

export function calcDeg(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI
}

export function getPointerPosition(konvaEvent) {
  return { x: konvaEvent.evt.pageX, y: konvaEvent.evt.pageY }
}