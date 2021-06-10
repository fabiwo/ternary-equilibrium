import * as d3 from 'd3'
import { ternary } from '../index.js'
import { setStyleInputValues, toDataURL } from './inputs.js'
import { addTraces } from './traces.js'
import computerModernWoff from '/fonts/Computer-Modern-Serif-Roman.woff'

const addGraphToLocalStorage = () =>
  localStorage.setItem('graphSettings', JSON.stringify(ternary.exportConfig()))
const addTracesToLocalStorage = () =>
  localStorage.setItem('traceSettings', JSON.stringify(ternary.exportTraces()))

const openHowToModal = () => {
  document.querySelector('#how-to-modal-btn').click()
  document.querySelector('#how-to-modal .modal__container').scrollTop = 0
}

const setGraphFont = () => {
  d3.select('#Figure').style(
    'font-family',
    document.getElementById('font-select').value,
  )
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

document.addEventListener('DOMContentLoaded', function (e) {
  try {
    openHowToModal()
    const graphSettings = JSON.parse(localStorage.getItem('graphSettings'))
    const traceSettings = JSON.parse(localStorage.getItem('traceSettings'))
    const fontPreferenceIndex = JSON.parse(
      localStorage.getItem('fontPreferenceIndex'),
    )
    if (fontPreferenceIndex) {
      document.getElementById('font-select').selectedIndex = fontPreferenceIndex
      setGraphFont()
    }

    ternary.updatePlotStyle(graphSettings)
    setStyleInputValues(graphSettings)

    const traces = ternary.importTraces(traceSettings)
    addTraces(traces)
  } catch (error) {
    console.log(error)
  }
})

// Window Closed
window.addEventListener('beforeunload', function (e) {
  try {
    localStorage.setItem('watchedHowTo', true)
    const fontPreferenceIndex = document.getElementById('font-select')
      .selectedIndex
    localStorage.setItem('fontPreferenceIndex', fontPreferenceIndex)
    addGraphToLocalStorage()
    addTracesToLocalStorage()
  } catch (error) {
    ;('Error in exporting configs to localStorage')
  }
})
