import Konva from "konva"
import { replaceInArray, calcDeg } from "./utils"

/*
  every shape has sets of different methods and properties
  to make it possible to interact with all of them with the same interface,
  we have to define custom wrapper

  in this example the wrapper have only modifier functions but in order to 
  read propeties like width, height and x, y ; you have to add custom getters too
  [
    for example ellipse's x & y is center of the shape
    or line doesn't have width and height, 
    ...
  ]
*/


export function newRect(shapeConfig) {
  let shape = new Konva.Rect(shapeConfig)

  shape.modfiers = {
    width: w => shape.width(w),
    height: h => shape.height(h),
  }

  return shape
}


export function newEllipse(shapeConfig) {
  let shape = new Konva.Ellipse(shapeConfig)

  // because ellipce position starts with at the center ot the shape
  shape.modfiers = {
    width: w => {
      shape.width(w)
      shape.offsetX(-w / 2)
    },
    height: h => {
      shape.height(h)
      shape.offsetY(-h / 2)
    },
  }

  return shape
}

export function newLine(shapeConfig) {
  let shape = new Konva.Line({
    x: shapeConfig.x,
    y: shapeConfig.y,

    points: [
      0, 0,
      shapeConfig.width, shapeConfig.height,
    ],

    strokeWidth: 4,
    stroke: shapeConfig.fill
  })

  shape.modfiers = {
    width: w => shape.points(replaceInArray(shape.points(), 2, w)),
    height: h => shape.points(replaceInArray(shape.points(), 3, h)),
  }

  return shape
}

function genArrowPath(w, h) {
  const
    length = Math.sqrt(w * w + h * h),
    bodyHeight = 40,
    headWidth = 100,
    headHeight = 100,
    bodyLength = length - headWidth,
    bodyCurve = 20,
    bodyCurveXRatio = 0.2

  // read more about svg path here:
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
  return [
    `L 0 ${-bodyHeight / 2}`,
    `q ${bodyLength * bodyCurveXRatio} ${bodyCurve}, ${bodyLength} 0`,
    `V ${-headHeight / 2}`,
    `L ${length} 0`,
    `L ${bodyLength} ${headHeight / 2}`,
    `V ${bodyHeight / 2}`,
    `q ${-bodyLength * (1 - bodyCurveXRatio)} ${-bodyCurve}, ${-bodyLength} 0`,
    `Z`,
  ].join(' ')
}

export function newArrow(shapeConfig) {
  let shape = new Konva.Path({
    x: shapeConfig.x,
    y: shapeConfig.y,
    data: genArrowPath(shapeConfig.width, shapeConfig.height),
    stroke: shapeConfig.fill,
    fill: 'black',
    strokeWidth: 4,
  })

  function rerender(w, h) {
    shape.data(genArrowPath(w, h))
    shape.rotation(calcDeg(w, h))
  }

  shape.modfiers = {
    width: w => {
      rerender(w, shape.height())
      shape.width(w) // we have to set width manually [it doesn't affect on the shape but i save it for future access]
    },
    height: h => {
      rerender(shape.width(), h)
      shape.height(h)
    },
  }

  return shape
}
