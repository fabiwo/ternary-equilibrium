import * as d3 from 'd3'
import * as traceHandling from './traces.js'
import { ternary, donut } from '../index.js'
import { clearTable, updateHotData, hot } from './table.js'
import { parseData } from './files.js'
import computerModernWoff from '/fonts/Computer-Modern-Serif-Roman.woff'

function loadLocalExamples(inputFieldId) {
  const datasets = {
    1: './data/csv/Water_AceticAcid_ButylAcetate_313K.csv',
    2: './data/csv/Water_AceticAcid_EthylAcetate_293K.csv',
    3: './data/csv/Water_AceticAcid_HeptylAcetate_313K.csv',
    4: './data/csv/Line1.csv',
  }

  const exampleDataset = this.value
  const directory = datasets[exampleDataset]

  clearTable()

  d3.text(directory).then(function (data) {
    if (directory) {
      const dataPromise = parseData(data, directory.split('.')[2])
      dataPromise.then(function (data) {
        data = traceHandling.preProcessData(data)
        updateHotData(hot, data)
      })
    }
  })
}

export function onFontInput() {
  d3.select('#Figure').style('font-family', this.value)
  const needLatex = d3.select('#Figure').style('font-family')
  if (needLatex.includes('Computer Modern')) {
    toDataURL(computerModernWoff).then((font) => {
      const fontFace = `@font-face {
          font-family: 'Computer Modern';
          font-style: normal;
          font-weight: 400;
          src: url(${font}) format('woff');`

      d3.select('#Figure').insert('style', '#svgBackground').text(fontFace)
    })
  } else {
    d3.select('#Figure').select('style').remove()
  }
}

export function setStyleInputValues(styleObj) {
  function setSliderValues(id, value) {
    let sliderWrapper = document.getElementById(id)
    sliderWrapper.querySelector('input[type=range]').value = value
    sliderWrapper.querySelector('.slider__value').textContent = value
  }

  function setLabelValues(id, value) {
    document.getElementById(id).value = value
  }

  function setColorValues(id, value) {
    let colorPicker = document.getElementById(id).parentElement.parentElement
    let colorInputWrapper = colorPicker.querySelector('label')
    let colorValue = colorPicker.querySelector('.value')
    let colorInput = colorPicker.querySelector('input')

    colorValue.textContent = value
    colorValue.style.color = value
    colorInputWrapper.style.backgroundColor = value
  }

  var color = [
    {
      id: 'svg-color-select',
      value: styleObj.svgBgColor,
    },
    {
      id: 'bg-color-select',
      value: styleObj.triangleBgColor,
    },
    {
      id: 'grid-color-select',
      value: styleObj.gridColor,
    },
    {
      id: 'tick-color-select',
      value: styleObj.tickColor,
    },
    {
      id: 'triangleBorder-color-select',
      value: styleObj.triangleBorderColor,
    },
    {
      id: 'labels-color-select',
      value: styleObj.labelColor,
    },
    {
      id: 'title-color-select',
      value: styleObj.titleColor,
    },
  ]
  var labels = [
    {
      id: 'left-ax-text',
      value: styleObj.leftLabel,
    },
    {
      id: 'bottom-ax-text',
      value: styleObj.bottomLabel,
    },
    {
      id: 'right-ax-text',
      value: styleObj.rightLabel,
    },
    {
      id: 'titleLabel',
      value: styleObj.title,
    },
  ]
  var sliders = [
    {
      id: 'grid-opacity-slider',
      value: styleObj.gridOpacity,
    },
    {
      id: 'mgrid-thickness-slider',
      value: styleObj.mainGridThickness,
    },
    {
      id: 'sgrid-thickness-slider',
      value: styleObj.secondaryGridThickness,
    },
    {
      id: 'tick-font-size-slider',
      value: styleObj.tickFontsize,
    },
    {
      id: 'triangle-border-thickness-slider',
      value: styleObj.triangleBorderThickness,
    },
    {
      id: 'labels-font-size-slider',
      value: styleObj.labelFontsize,
    },
    {
      id: 'font-size-slider',
      value: styleObj.titleFontsize,
    },
  ]

  sliders.map(function (d) {
    setSliderValues(d.id, d.value)
  })

  labels.map(function (d) {
    setLabelValues(d.id, d.value)
  })

  color.map(function (d) {
    setColorValues(d.id, d.value)
  })
}

export function onHelperLineToggle() {
  const helperLinesBtn = document.getElementById('orientation__lines')
  const helperLinesWrapper = document.querySelector('#helperLineWrapper')
  helperLinesBtn.classList.toggle('active')
  if (helperLineWrapper.style.visibility === 'hidden') {
    helperLineWrapper.style.visibility = 'visible'
  } else {
    helperLineWrapper.style.visibility = 'hidden'
  }
}

export async function toDataURL(url) {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(url)
    if (!res.ok) return reject(`Error: ${res.status} ${res.statusText}`)
    const blob = await res.blob()
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => resolve(reader.result)
  })
}

export const initColorpickers = (node) => {
  const colorPickers = node.querySelectorAll('.colorpicker')
  colorPickers.forEach(function (colorPicker) {
    const colorInputWrapper = colorPicker.querySelector('label')
    const colorValue = colorPicker.querySelector('.value')
    const colorInput = colorPicker.querySelector('input')

    const currentColor = colorInput.value

    colorValue.textContent = currentColor
    colorValue.style.color = currentColor
    colorInputWrapper.style.backgroundColor = currentColor

    colorInput.addEventListener('input', function () {
      colorValue.textContent = this.value
      colorValue.style.color = this.value
      colorInputWrapper.style.backgroundColor = this.value
    })

    colorValue.addEventListener('click', function () {
      // If you click the value open input
      this.parentNode.querySelector('input[type=color]').click()
    })
  })
}
function onStylePresetInput() {
  let styleFilePath = this.value
  fetch(styleFilePath)
    .then((response) => response.json())
    .then((styleObjJson) => ternary.updatePlotStyle(styleObjJson))
}

const inputs = [
  { id: 'exampleData', event: 'input', fn: loadLocalExamples },
  { id: 'add-trace-btn', event: 'click', fn: traceHandling.onAddTraceClick },
  { id: 'font-select', event: 'input', fn: onFontInput },
  {
    id: 'style-presets',
    event: 'input',
    fn: onStylePresetInput,
  },
  {
    id: 'titleLabel',
    event: 'input',
    fn: (evt) => ternary.updatePlotStyle({ title: evt.target.value }),
  },
  {
    id: 'left-ax-text',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ leftLabel: evt.target.value })
      donut.leftLabel(evt.target.value)
    },
  },
  {
    id: 'bottom-ax-text',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ bottomLabel: evt.target.value })
      donut.bottomLabel(evt.target.value)
    },
  },
  {
    id: 'right-ax-text',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ rightLabel: evt.target.value })
      donut.rightLabel(evt.target.value)
    },
  },
  {
    id: 'labels-color-select',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ labelColor: evt.target.value })
    },
  },
  {
    id: 'svg-color-select',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ svgBgColor: evt.target.value })
    },
  },
  {
    id: 'bg-color-select',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ triangleBgColor: evt.target.value })
    },
  },
  {
    id: 'grid-color-select',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ gridColor: evt.target.value })
    },
  },
  {
    id: 'tick-color-select',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ tickColor: evt.target.value })
    },
  },
  {
    id: 'triangleBorder-color-select',
    event: 'input',
    fn: (evt) => {
      ternary.updatePlotStyle({ triangleBorderColor: evt.target.value })
    },
  },
  {
    id: 'ticks-checkbox',
    event: 'click',
    fn: (evt) => {
      if (evt.target.checked) {
        ternary.updatePlotStyle({ tickVisibility: 'visible' })
      } else {
        ternary.updatePlotStyle({ tickVisibility: 'hidden' })
      }
    },
  },
  {
    id: 'legend-checkbox',
    event: 'click',
    fn: (evt) => {
      if (evt.target.checked) {
        ternary.showLegend()
      } else {
        ternary.hideLegend()
      }
    },
  },
  { id: 'orientation__lines', event: 'click', fn: onHelperLineToggle },
]

inputs.map((input) => {
  document.getElementById(input.id).addEventListener(input.event, input.fn)
})
