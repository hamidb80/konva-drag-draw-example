import Konva from "konva"
import { getPointerPosition } from "./utils"
import { newRect, newEllipse, newLine, newArrow } from "./shapes-wrapper"

const shapeDrawFnMap = {
  "rect": newRect,
  "ellipse": newEllipse,
  "line": newLine,
  "arrow": newArrow,
}

// --- app states
let
  shapeDrawFn = null,
  isDrawing = false,
  startPoint = { x: null, y: null },
  tempShape = null


// --- register buttons events
for (let el of document.getElementsByClassName("btn")) {
  el.onclick = () =>
    shapeDrawFn = shapeDrawFnMap[el.getAttribute("value")]
}

// --- init canvas
let
  stage = new Konva.Stage({
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight
  }),
  mainLayer = new Konva.Layer(),
  drawingLayer = new Konva.Layer()

stage.add(mainLayer, drawingLayer)


// --- register canvas events 
stage.on("mousedown", (konvaEvent) => {
  if (!shapeDrawFn) return // if user haven't selected a shape yet

  startPoint = getPointerPosition(konvaEvent)

  tempShape = shapeDrawFn({
    ...startPoint,
    width: 10,
    height: 10,
    fill: Konva.Util.getRandomColor()
  })

  isDrawing = true
  drawingLayer.add(tempShape)
})

stage.on("mousemove", (konvaEvent) => {
  let pp = getPointerPosition(konvaEvent)

  if (isDrawing) { // edit width & height of the tempShape with custom modifiers
    tempShape.modfiers.width(pp.x - startPoint.x)
    tempShape.modfiers.height(pp.y - startPoint.y)
  }
})

stage.on("mouseup", () => {
  if (isDrawing) {
    mainLayer.add(tempShape) // move tempShape from 'drawingLayer' to 'mainLayer'
    isDrawing = false
  }
})