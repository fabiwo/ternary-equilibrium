import { parseData } from './files.js'
import * as traceHandling from './traces.js'
import * as d3 from 'd3'
import Handsontable from 'handsontable'

export const clearTable = () => {
  const n_rows = 25
  const hotData = [...Array(n_rows).keys()].map((index) => {
    return { left: '', bottom: '', right: '' }
  })

  updateHotData(hot, hotData)
}

export const updateHotData = (table, data) => {
  table.updateSettings({
    data: data,
  })
}

export const initTable = () => {
  const directory = './data/csv/Water_AceticAcid_ButylAcetate_313K.csv'

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

export const getTableData = () => {
  const data = hot.getData()
  data.unshift(['left', 'bottom', 'right'])
  return data
}

const resizeHot = (table) => {
  const container = table.rootElement
  const containerWidth = container.offsetWidth

  table.updateSettings({
    width: containerWidth,
  })
}

const container = document.getElementById('spreadsheet')
const settings = {
  colHeaders: ['Left', 'Bottom', 'Right'],
  rowHeaders: true,
  minSpareRows: 10,
  stretchH: 'all',
  height: '100%',
  licenseKey: 'non-commercial-and-evaluation',
}

export const hot = new Handsontable(container, settings)

document.addEventListener('DOMContentLoaded', function () {
  resizeHot(hot)
})

initTable()
