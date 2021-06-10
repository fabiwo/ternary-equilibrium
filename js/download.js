import * as svgDownload from 'save-svg-as-png'
import { ternary } from '../index.js'
import { jsPDF } from 'jspdf'

function downloadPdf(argObj) {
  const svgNode = argObj.node
  const filename = 'ternary'

  svgDownload
    .svgAsPngUri(svgNode, {
      scale: 2.5,
      excludeUnusedCss: true,
      excludeCss: true,
    })
    .then((uri) => {
      const doc = new jsPDF('l', 'pt', [800, 533])
      // Get the document dimensions for centering of image
      const pageHeight = doc.internal.pageSize.height
      const pageWidth = doc.internal.pageSize.width
      // Define image dimensions
      const imgWidth = 800
      const imgHeight = imgWidth / 1.5
      // Center the image
      let left = (pageWidth - imgWidth) / 2
      let top = (pageHeight - imgHeight) / 2

      doc.addImage(uri, 'PNG', left, top, imgWidth, imgHeight)

      doc.save(`${filename}.pdf`)
    })
}

function downloadPng(argObj) {
  const svgNode = argObj.node
  const filename = 'ternary'
  svgDownload.saveSvgAsPng(svgNode, filename, {
    scale: 2.5,
    excludeUnusedCss: true,
    excludeCss: true,
  })
}

function downloadSvg(argObj) {
  const svgNode = argObj.node
  const filename = 'ternary'
  svgDownload.saveSvg(svgNode, filename, {
    excludeUnusedCss: true,
    excludeCss: true,
  })
}

const deactivate_orientation = () => {
  const helperLineBtn = document.getElementById('orientation__lines')
  const areHelperlinesOpen = helperLineBtn.classList.contains('active')
  if (areHelperlinesOpen) {
    helperLineBtn.click()
  }
}

export function downloadFile(type) {
  let svgNode = document.querySelector('#Figure')
  deactivate_orientation()
  const args = {
    node: svgNode,
    inputId: '#filename',
  }

  switch (type) {
    case 'svg':
      downloadSvg(args)
      break
    case 'png':
      downloadPng(args)
      break
    case 'pdf':
      downloadPdf(args)
      break
    default:
      console.log('No filetype specified')
  }

  MicroModal.show('support')
}
