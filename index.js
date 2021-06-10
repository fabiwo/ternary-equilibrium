import './styles/styles.scss'
import './styles/handsontable.scss'
import * as d3 from 'd3'
import MicroModal from 'micromodal'
import { donutChart } from './js/charts/donut.js'
import { ternaryChart } from './js/charts/ternary.js'
import { downloadFile } from './js/download.js'
import { setStyleInputValues, initColorpickers } from './js/inputs.js'
import './js/files.js'
import './js/localStorage.js'
import './js/table.js'

const initTernaryHover = () => {
  function svgPoint(element, x, y) {
    var pt = element.createSVGPoint()
    pt.x = x
    pt.y = y
    return pt.matrixTransform(element.getScreenCTM().inverse())
  }

  function onMouseMove(e) {
    let ternaryTranslate = d3.select('#TernaryPlot').attr('transform')
    ternaryTranslate = ternaryTranslate
      .substring(
        ternaryTranslate.indexOf('(') + 1,
        ternaryTranslate.indexOf(')'),
      )
      .split(' ')
    const svg = d3.select('#Figure')
    let x = e.clientX,
      y = e.clientY,
      svgP = svgPoint(svg.node(), x, y)
    let transformedCoordinates = {
      x: svgP.x - ternaryTranslate[0],
      y: svgP.y - ternaryTranslate[1],
    }
    let composition = ternary.coordinatesToComposition(transformedCoordinates)

    const checkBox = d3.select('#helperLineWrapper')
    let isChecked = checkBox.node().checked

    d3.select('#helperLineGroup')
      .selectAll('.guideLine')
      .attr(
        'transform',
        `translate(${transformedCoordinates.x},${transformedCoordinates.y})`,
      )

    donut.data(composition)
    donut.leftLabel(d3.select('#leftLabel').text())
    donut.rightLabel(d3.select('#rightLabel').text())
    donut.bottomLabel(d3.select('#bottomLabel').text())
  }

  d3.select('#TriangleBackground').on('mousemove', onMouseMove)
  d3.select('#GridGroup').selectAll('g').on('mousemove', onMouseMove)
  d3.select('#Binodale').on('mousemove', onMouseMove)
  d3.select('#TraceGroup').on('mousemove', onMouseMove)
  d3.selectAll('.guideLine').on('mousemove', onMouseMove)
}
const initInputs = () => {
  const rangeSlider = function (sliderObj) {
    var range = document.querySelector(sliderObj.id).querySelector('input')
    range.addEventListener('input', function () {
      let value = {}
      value[sliderObj.key] = Number(this.value)
      sliderObj.fn(value)
    })
  }
  const sliderGenerator = [
    {
      id: '#font-size-slider',
      key: 'titleFontsize',
      fn: ternary.updatePlotStyle,
    },
    {
      id: '#labels-font-size-slider',
      key: 'labelFontsize',
      fn: ternary.updatePlotStyle,
    },
    {
      id: '#grid-opacity-slider',
      key: 'gridOpacity',
      fn: ternary.updatePlotStyle,
    },
    {
      id: '#mgrid-thickness-slider',
      key: 'mainGridThickness',
      fn: ternary.updatePlotStyle,
    },
    {
      id: '#sgrid-thickness-slider',
      key: 'secondaryGridThickness',
      fn: ternary.updatePlotStyle,
    },
    {
      id: '#tick-font-size-slider',
      key: 'tickFontsize',
      fn: ternary.updatePlotStyle,
    },
    {
      id: '#triangle-border-thickness-slider',
      key: 'triangleBorderThickness',
      fn: ternary.updatePlotStyle,
    },
  ]

  sliderGenerator.map(function (sliderObj) {
    rangeSlider(sliderObj)
  })
  // Style Colorpickers and Sliders to match displayed values in style
  const sliders = document.querySelectorAll('.slider')
  initColorpickers(document)

  sliders.forEach(function (slider) {
    let rangeInput = slider.querySelector('input')
    var rangeValue = slider.querySelector('.slider__value')

    rangeValue.textContent = rangeInput.value

    rangeInput.addEventListener('input', function () {
      rangeValue.textContent = this.value
    })
  })
}
const initDownload = () => {
  const downloadButtons = [
    { id: 'png-download', type: 'png' },
    { id: 'svg-download', type: 'svg' },
    { id: 'pdf-download', type: 'pdf' },
  ]

  downloadButtons.map((button) => {
    const btn = document.getElementById(button.id)
    btn.addEventListener('click', () => downloadFile(button.type))
  })
}
const initTabs = () => {
  const contents = document.querySelectorAll('.tab__content')
  const links = document.querySelectorAll('.tab__link')

  links.forEach((link) => {
    link.addEventListener('click', function (evt) {
      const targetContent = document.querySelector(this.target)
      const targetLink = this

      contents.forEach((d) => {
        d.isSameNode(targetContent)
          ? d.classList.add('active')
          : d.classList.remove('active')
      })

      links.forEach((d) =>
        d.isSameNode(targetLink)
          ? d.classList.add('active')
          : d.classList.remove('active'),
      )
    })
  })
  document.querySelector('.default-open').click()
}
const initReset = () => {
  // Reset
  const resetTraces = () => {
    ternary.clearTraces()

    let traceElements = document.querySelectorAll('.trace')

    traceElements = [...traceElements]
    traceElements.map((d) => d.remove())

    document.getElementById('trace-counter').textContent = 0
  }
  const resetGraph = () => ternary.resetDefault()

  const resetBtn = document.getElementById('reset__confirm')
  resetBtn.addEventListener('click', resetTraces)
  resetBtn.addEventListener('click', resetGraph)
}

export const ternary = ternaryChart()
export const donut = donutChart({})

d3.select('#ternary').call(ternary)
d3.select('#donut').call(donut)

setStyleInputValues(ternary.getStyleObj())
initInputs()
initDownload()
initTabs()
initTernaryHover()
MicroModal.init()
initReset()
