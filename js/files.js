import { clearTable, hot, updateHotData } from './table.js'
import { addTraces, preProcessData } from './traces.js'
import { ternary } from '../index.js'
import * as inputConnection from './inputs.js'
import * as d3 from 'd3'

function readFile(file) {
  const reader = new FileReader()
  const extension = file.name.split('.').pop()
  reader.addEventListener(
    'load',
    () => {
      const dataPromise = parseData(reader.result, extension)
      dataPromise.then((data) => {
        if (Array.isArray(data)) {
          if (data[0].hasOwnProperty('id')) {
            addTraces(data)
          } else {
            data = preProcessData(data)
            updateHotData(hot, data)
          }
        } else {
          ternary.updatePlotStyle(data)
          inputConnection.setStyleInputValues(data)
        }
      })
    },
    false,
  )
  reader.readAsBinaryString(file)
}

const arrayStringContains = (array, string) => {
  let areValuesWithComma = array.map((el) => {
    if (el.includes(string)) {
      return true
    } else {
      return false
    }
  })
  return areValuesWithComma
}

const replaceDecimals = (stringArray) =>
  stringArray.map((value) => value.replace(',', '.'))

const formatSeparator = (dataArray, separator) => {
  dataArray = dataArray.map((row) => {
    let stringArray = row[0].split(separator)
    if (arrayStringContains(stringArray, ',')) {
      stringArray = replaceDecimals(stringArray)
    }
    return stringArray
  })
  return dataArray
}

const addEventListeners = function (element, evtList, callback) {
  evtList.forEach((evt) => element.addEventListener(evt, callback, false))
}

export async function parseData(fileString, fileExtension) {
  if (fileExtension === 'csv' || fileExtension === 'xlsx') {
    var data = new Array()
    if (fileExtension === 'xlsx') {
      const XLSX = await import('xlsx')
      let workbook = XLSX.read(fileString, {
        type: 'binary',
      })
      let sheet = workbook.Sheets[workbook.SheetNames[0]]
      fileString = XLSX.utils.sheet_to_csv(sheet)
    }
    const isSemicolonSeparated = fileString.includes(';')
    const isTabSeparated = fileString.includes('/t')

    if (isTabSeparated) {
      data = d3.tsvParseRows(fileString)
      data = formatSeparator(data, '/t')
    } else {
      data = d3.csvParseRows(fileString)
      if (isSemicolonSeparated) {
        data = formatSeparator(data, ';')
      }
    }
  } else if (fileExtension === 'json') {
    var data = JSON.parse(fileString)
  }
  return data
}

const initDragDrop = () => {
  const fileForm = document.querySelector('.box')
  const fileInput = document.querySelector('#file')

  fileInput.addEventListener('change', function (e) {
    clearTable()
    if (this.files.length > 0) {
      var file = this.files[0]
      readFile(file)
    }
  })
  const isAdvancedUpload = (function () {
    var div = document.createElement('div')
    return (
      ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
      'FormData' in window &&
      'FileReader' in window
    )
  })()

  if (isAdvancedUpload) {
    fileForm.classList.add('dragdrop')

    var droppedFiles = false
    fileForm.addEventListener('click', (d) => {
      // Add Click Styling
      document.querySelector('.box__file').click()
    })

    addEventListeners(
      fileForm,
      ['drag', 'dragstart', 'dragover', 'dragenter', 'dragleave', 'drag'],
      function (e) {
        e.preventDefault()
        e.stopPropagation()
      },
    )

    addEventListeners(fileForm, ['dragover', 'dragenter'], function (e) {
      if (!fileForm.classList.contains('dragdrop__dragover')) {
        fileForm.classList.add('dragdrop__dragover')
      }
    })

    addEventListeners(fileForm, ['dragleave', 'dragend', 'drop'], function (e) {
      if (fileForm.classList.contains('dragdrop__dragover')) {
        fileForm.classList.remove('dragdrop__dragover')
      }
    })

    addEventListeners(fileForm, ['drop'], function (e) {
      function traceFileDropHandler(event) {
        clearTable()
        event.preventDefault()
        if (event.dataTransfer.items) {
          var file = event.dataTransfer.items[0].getAsFile()
        } else {
          var file = event.dataTransfer.files[0]
        }
        readFile(file)
      }
      traceFileDropHandler(e)
    })
  }
}

initDragDrop()
