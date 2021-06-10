import * as customSymbols from './marker/markers.js'
import * as d3 from 'd3'
import { Label, LabelCollection } from './labels.js'

export function ternaryChart() {
  // Set Objects
  var defaultDiagramStyle = {
    title: '',
    leftLabel: 'Carrier',
    bottomLabel: 'Solvent',
    rightLabel: 'Target',
    gridStepsize: 0.05,
    tickStepsize: 10,
    titleColor: '#000000',
    labelColor: '#000000',
    svgBgColor: '#ffffff',
    triangleBgColor: '#ffffff',
    twoPhaseColor: '#d7eeff',
    twoPhaseOpacity: 0.3,
    gridColor: '#000000',
    gridOpacity: 0.2,
    pointColor: '#bf5c5c',
    triangleBorderColor: '#000000',
    konodenColor: '#5d5d5d',
    konodenOpacity: 0.5,
    tickColor: '#000000',
    tickVisibility: 'visible',
    mainGridThickness: 1,
    secondaryGridThickness: 0,
    triangleBorderThickness: 1.1,
    pointSize: 3,
    fontSize: 20,
    titleFontsize: 25,
    axesFontsize: 25,
    tickFontsize: 15,
    tickLength: 7,
    tickWidth: 1.2,
    labelFontsize: 25,
  }

  var diagramStyleObj = {
    title: '',
    leftLabel: 'Carrier',
    bottomLabel: 'Solvent',
    rightLabel: 'Target',
    gridStepsize: 0.05,
    tickStepsize: 10,
    titleColor: '#000000',
    labelColor: '#000000',
    svgBgColor: '#ffffff',
    triangleBgColor: '#ffffff',
    twoPhaseColor: '#d7eeff',
    twoPhaseOpacity: 0.3,
    gridColor: '#000000',
    gridOpacity: 0.2,
    pointColor: '#bf5c5c',
    triangleBorderColor: '#000000',
    konodenColor: '#5d5d5d',
    konodenOpacity: 0.5,
    tickColor: '#000000',
    tickVisibility: 'visible',
    mainGridThickness: 1,
    secondaryGridThickness: 0,
    triangleBorderThickness: 1.1,
    pointSize: 3,
    fontSize: 20,
    titleFontsize: 25,
    axesFontsize: 25,
    tickFontsize: 15,
    tickLength: 7,
    tickWidth: 1.2,
    labelFontsize: 25,
  }
  // Traces
  var traces = []
  var legend = {
    visibility: 'visible',
    legendObjs: [],
  }
  var width = 1200
  var height = 800
  var margin = {
    left: 100,
    right: 100,
    bottom: 25,
    top: 25,
  }

  var grid = d3.range(0, 1, diagramStyleObj.gridStepsize)
  //// Static options
  const size =
    Math.min(
      width - (margin.left + margin.right),
      height - (margin.bottom + margin.top),
    ) / 2
  const yOffset = (size - Math.sin((30 * Math.PI) / 180) * size) / 2
  const labelOffset = 100

  const [A, B, C] = [150, 30, -90].map((d) => [
    Math.cos((d * Math.PI) / 180) * size,
    Math.sin((d * Math.PI) / 180) * size + yOffset,
  ])
  const [_A, _B, _C] = [150, 30, -90].map((d) => [
    Math.cos((d * Math.PI) / 180) * (size + labelOffset),
    Math.sin((d * Math.PI) / 180) * (size + labelOffset) + yOffset,
  ])

  const a = line(B, C)
  const b = line(C, A)
  const c = line(A, B)
  const _a = line(_B, _C)
  const _b = line(_C, _A)
  const _c = line(_A, _B)

  //// Render Functions
  var updatePlot
  var renderTrace
  var updateTrace
  var renderLegend
  var updateLegend
  //// Update Functions
  var updateBinodalPointColor
  var updateTwoPhaseColor
  var updateTwoPhaseOpacity
  var updateKonodenColor
  var updateKonodenOpacity
  var updatePointSize
  var updateLabelFontsize
  var updateAxes

  function line([x1, y1], [x2, y2]) {
    return function (t) {
      return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]
    }
  }

  function trianglePath(left_corner, right_corner, top_corner) {
    var trianglePath = `M${left_corner}L${right_corner}L${top_corner}Z`
    return trianglePath
  }

  function translateCoordinates(point, A, B, C) {
    var A = A.map((d) => d / 100)
    var B = B.map((d) => d / 100)
    var C = C.map((d) => d / 100)
    const cx = A[0] * point.left + B[0] * point.bottom + C[0] * point.right
    const cy = A[1] * point.left + B[1] * point.bottom + C[1] * point.right
    return [cx, cy]
  }

  function appendCoordinates(dataObject) {
    var coordinates = translateCoordinates(
      {
        left: dataObject.left,
        bottom: dataObject.bottom,
        right: dataObject.right,
      },
      A,
      B,
      C,
    )
    dataObject['dx'] = coordinates[0]
    dataObject['dy'] = coordinates[1]
    return dataObject
  }

  function drawAxes(A, B, C, axObj) {
    d3.select('#AxesGroup').selectAll('g').remove()
    var n_ticks = 100 / axObj.tickStepsize
    const scaleLength = lengthBetweenPoints(C, A)
    const scale = d3.scaleLinear().domain([0, 100]).range([0, scaleLength])
    const left_ax = d3
      .axisLeft(scale)
      .tickSizeInner(axObj.tickLength)
      .ticks(n_ticks)
    const bottom_ax = d3
      .axisBottom(scale)
      .tickSizeInner(axObj.tickLength)
      .ticks(n_ticks)
    const right_ax = d3
      .axisRight(scale)
      .tickSizeInner(axObj.tickLength)
      .ticks(n_ticks)

    d3.select('#AxesGroup')
      .append('g')
      .attr('transform', `translate(${C[0]},${C[1]}) rotate(30)`)
      .style('font-size', axObj.tickFontsize)
      .style('fill', axObj.labelColor)
      .attr('id', 'left-axis-group')
      .call(left_ax)
      .attr('font-family', null)
      .selectAll('text')
      .attr(
        'transform',
        `translate(0, ${-axObj.tickFontsize * 0.3}) rotate(-30, -10, 0)`,
      )

    d3.select('#AxesGroup')
      .append('g')
      .attr('transform', `translate(${A[0]},${A[1]})`)
      .style('font-size', axObj.tickFontsize)
      .style('fill', axObj.labelColor)
      .attr('id', 'bottom-axis-group')
      .call(bottom_ax)
      .attr('font-family', null)
      .selectAll('text')
      .attr('transform', 'translate(-5,0)')

    d3.select('#AxesGroup')
      .append('g')
      .attr('transform', `translate(${B[0]},${B[1]}) rotate(-210)`)
      .style('font-size', axObj.tickFontsize)
      .style('fill', axObj.labelColor)
      .attr('id', 'right-axis-group')
      .call(right_ax)
      .attr('font-family', null)
      .selectAll('text')
      .attr('transform', 'rotate(-150)')

    d3.select('#right-axis-group').select('path').attr('visibility', 'hidden')
    d3.select('#bottom-axis-group').select('path').attr('visibility', 'hidden')
    d3.select('#left-axis-group').select('path').attr('visibility', 'hidden')

    d3.select('#right-axis-group')
      .selectAll('.tick')
      .selectAll('line')
      .attr('stroke-width', `${axObj.tickWidth}px`)
      .attr('transform', 'rotate(-150)')

    d3.select('#bottom-axis-group')
      .selectAll('.tick')
      .selectAll('line')
      .attr('stroke-width', `${axObj.tickWidth}px`)
      .attr('transform', 'rotate(30)')

    d3.select('#left-axis-group')
      .selectAll('.tick')
      .selectAll('line')
      .attr('stroke-width', `${axObj.tickWidth}px`)
      .attr('transform', 'rotate(30)')

    // delete first and last ticks
    function removeFirstAndLastTick(axisId) {
      var n_ticks = d3.select(axisId).selectAll('.tick').nodes().length - 1
      var firstTick = d3.select(axisId).selectAll('.tick').nodes()[0]
      var lastTick = d3.select(axisId).selectAll('.tick').nodes()[n_ticks]
      d3.select(firstTick).remove()
      d3.select(lastTick).remove()
    }

    //removeFirstAndLastTick("#right-axis-group")
    //removeFirstAndLastTick("#bottom-axis-group")
    //removeFirstAndLastTick("#left-axis-group")
  }

  function drawGrid(a, b, c, gridObj) {
    var gridGroup = d3.select('#GridGroup')
    gridGroup
      .selectAll('.grid')
      .data([
        gridObj.grid.map((tick) => [a(tick), b(1 - tick)]),
        gridObj.grid.map((tick) => [b(tick), c(1 - tick)]),
        gridObj.grid.map((tick) => [c(tick), a(1 - tick)]),
      ])
      .enter()
      .append('g')
      .attr('class', 'grid')
      .selectAll('.gridline')
      .data((d) => d)
      .enter()
      .append('line')
      .attr('class', 'gridline')
      .attr('x1', (d) => d[0][0])
      .attr('x2', (d) => d[1][0])
      .attr('y1', (d) => d[0][1])
      .attr('y2', (d) => d[1][1])
      .attr('stroke-width', (d, i) =>
        i & 1 ? gridObj.secondaryGridThickness : gridObj.mainGridThickness,
      )
      .attr('stroke', gridObj.gridColor)
      .attr('opacity', gridObj.gridOpacity)
  }

  function drawEdgeabels(labelObj) {
    d3.select('#LabelsGroup').selectAll('.labels').remove()
    var labelYOffset = 25
    var labelSolventXOffset = 30
    var labelTargetXOffset = 125
    var leftLabelTranslate = `translate(${C[0] + 0},${
      C[1] + -labelYOffset * 1.5
    })`
    var bottomLabelTranslate = `translate(${B[0] + labelSolventXOffset},${
      B[1] + labelYOffset
    })`
    var rightLabelTranslate = `translate(${A[0] + -labelTargetXOffset},${
      A[1] + labelYOffset
    })`
    d3.select('#LabelsGroup')
      .selectAll('.labels')
      .data([
        {
          label: labelObj.leftLabel,
          transform: leftLabelTranslate,
          id: 'leftLabel',
          anchor: 'middle',
        }, // Carrier
        {
          label: labelObj.rightLabel,
          transform: rightLabelTranslate,
          id: 'rightLabel',
          anchor: 'left',
        }, // Target
        {
          label: labelObj.bottomLabel,
          transform: bottomLabelTranslate,
          id: 'bottomLabel',
          anchor: 'left',
        }, // Solvent
      ])
      .enter()
      .append('text')
      .attr('class', 'edges labels')
      .attr('id', (d) => d.id)
      .text((d) => d.label)
      .attr('text-anchor', (d) => d.anchor)
      .attr('transform', (d) => d.transform)
      .attr('font-size', `${labelObj.axesFontsize}px`)
      .style('fill', labelObj.labelColor)

    var translateStr = d3.select('#rightLabel').attr('transform').split('(')[1]
    translateStr = translateStr.split(')')[0]
    var dx = Number(translateStr.split(',')[0])
    var dy = Number(translateStr.split(',')[1])
    var fontSize20Width = 72.23
    var rightLabelWidth = d3
      .select('#rightLabel')
      .node()
      .getBoundingClientRect().width
    var adjustedTranslateDx = dx + (fontSize20Width - rightLabelWidth)
    var adjustedTranslate = `translate(${adjustedTranslateDx}, ${dy})`
    d3.select('#rightLabel').attr('transform', adjustedTranslate)
  }

  function drawCenteredLabels(_a, _b, _c, labelObj) {
    let leftLabel = new Label('leftLabel', {
        text: labelObj.leftLabel,
        rotation: -60,
        position: _b(0.5),
        textColor: labelObj.labelColor,
        fontSize: labelObj.axesFontsize,
      }),
      bottomLabel = new Label('bottomLabel', {
        text: labelObj.leftLabel,
        rotation: 0,
        position: _c(0.5),
        textColor: labelObj.labelColor,
        fontSize: labelObj.axesFontsize,
      }),
      rightLabel = new Label('rightLabel', {
        text: labelObj.leftLabel,
        rotation: 60,
        position: _a(0.5),
        textColor: labelObj.labelColor,
        fontSize: labelObj.axesFontsize,
      })

    var labelCollection = new LabelCollection([
      leftLabel,
      bottomLabel,
      rightLabel,
    ])

    labelCollection.appendToGroup('#LabelsGroup')
  }

  function drawTitle(width, titleObj) {
    const titleElement = d3
      .select('#Figure')
      .append('text')
      .text(titleObj.title)
      .attr('id', 'Title')
      .attr('transform', `translate(${width / 2}, 75)`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '2em')
      .style('fill', titleObj.textColor)
  }

  function createHelperLines() {
    function getTanDeg(deg) {
      let rad = (deg * Math.PI) / 180
      return Math.tan(rad)
    }

    function createHelperLine(dx, color, rotation) {
      let helperLine = {
        dx: dx,
        color: color,
        rotation: rotation,
      }
      helperLine['dy'] = getTanDeg(helperLine.rotation) * helperLine.dx
      return helperLine
    }

    const helperLineFun = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1])

    const dx = chart.width()
    const startPoint = [0, 0]
    const leftLine = createHelperLine(-dx, '#f23224', 60)
    const rightLine = createHelperLine(dx, '#53a972', 0)
    const bottomLine = createHelperLine(-dx, '#248ef2', -60)
    const helperLines = [
      {
        path: helperLineFun([startPoint, [leftLine.dx, leftLine.dy]]),
        color: leftLine.color,
      },
      {
        path: helperLineFun([startPoint, [bottomLine.dx, bottomLine.dy]]),
        color: bottomLine.color,
      },
      {
        path: helperLineFun([startPoint, [rightLine.dx, rightLine.dy]]),
        color: rightLine.color,
      },
    ]

    d3.select('#TernaryPlot')
      .selectAll('#helperLineWrapper')
      .data([1])
      .enter()
      .append('g')
      .attr('id', 'helperLineWrapper')
      .style('visibility', 'hidden')

    d3.select('#helperLineWrapper')
      .append('clipPath')
      .attr('id', 'triangleClip')
      .append('path')
      .attr('d', d3.select('#TriangleBackground').attr('d'))

    d3.select('#helperLineWrapper')
      .attr('visibility', 'hidden')
      .selectAll('#helperLineGroup')
      .data([1])
      .enter()
      .append('g')
      .attr('id', 'helperLineGroup')
      .attr('clip-path', 'url(#triangleClip)')

    d3.select('#helperLineGroup')
      .selectAll('.guideLine')
      .data(helperLines)
      .enter()
      .append('path')
      .attr('class', 'guideLine')
      .attr('d', (d) => d.path)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', '4px')
  }

  function chart(selection) {
    selection.each(function () {
      const svg = d3
        .select(this)
        .append('svg')
        .attr('id', 'Figure')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('height', '100%')
        .attr('width', '100%')

      //.attr("height", height)
      //.attr("width", width)

      d3.select('#Figure')
        .append('rect')
        .attr('id', 'svgBackground')
        .attr('width', width)
        .attr('height', '100%')
        .attr('fill', diagramStyleObj.svgBgColor)

      const ternaryPlot = svg
        .append('g')
        .attr('id', 'TernaryPlot')
        .attr('transform', `translate(${width / 2} ${height / 2})`)

      var diagramGroups = [
        {
          id: 'TriangleGroup',
        },
        {
          id: 'GridGroup',
        },
        {
          id: 'LabelsGroup',
        },
        {
          id: 'TraceGroup',
        },
        {
          id: 'AxesGroup',
        },
        {
          id: 'LegendGroup',
        },
      ]

      ternaryPlot
        .selectAll('g')
        .data(diagramGroups)
        .enter()
        .append('g')
        .attr('id', (d) => d.id)

      // Draw Triangle Background
      var triangle = d3
        .select('#TriangleGroup')
        .append('path')
        .attr('id', 'TriangleBackground')
        .attr('d', trianglePath(A, B, C))
        .attr('fill', diagramStyleObj.triangleBgColor)
        .attr('stroke', diagramStyleObj.triangleBorderColor)
        .attr('stroke-width', `${diagramStyleObj.triangleBorderThickness}px`)
      // Create Axes
      var axObj = {
        tickLength: diagramStyleObj.tickLength,
        nTicks: diagramStyleObj.nTicks,
        tickFontsize: diagramStyleObj.tickFontsize,
        tickWidth: diagramStyleObj.tickWidth,
        labelColor: diagramStyleObj.labelColor,
        tickStepsize: diagramStyleObj.tickStepsize,
      }
      drawAxes(A, B, C, axObj)
      // Create Grid
      var gridObj = {
        secondaryGridThickness: diagramStyleObj.secondaryGridThickness,
        mainGridThickness: diagramStyleObj.mainGridThickness,
        gridColor: diagramStyleObj.gridColor,
        gridOpacity: diagramStyleObj.gridOpacity,
        grid: grid,
      }
      drawGrid(a, b, c, gridObj)
      //Create Labels
      var labelObj = {
        leftLabel: diagramStyleObj.leftLabel,
        bottomLabel: diagramStyleObj.bottomLabel,
        rightLabel: diagramStyleObj.rightLabel,
        fontSize: diagramStyleObj.labelFontsize,
        labelColor: diagramStyleObj.labelColor,
        axesFontsize: diagramStyleObj.axesFontsize,
      }
      drawCenteredLabels(_a, _b, _c, labelObj)
      // Create Title
      var titleObj = {
        title: diagramStyleObj.title,
        titleColor: diagramStyleObj.titleColor,
        titleDistance: diagramStyleObj.titleDistance,
      }
      drawTitle(width, titleObj)
      // Init Helperlines

      createHelperLines()
      // Draw Clip Path
      ternaryPlot
        .append('clipPath')
        .attr('id', 'triangle-clip')
        .append('path')
        .attr('d', d3.select('#TriangleBackground').attr('d'))

      d3.select('#TraceGroup').attr('clip-path', 'url(#triangle-clip)')

      renderLegend = function () {
        var legendVisibility = legend.visibility
        var legendData = legend.legendObjs

        var legendGroup = d3.select('#LegendGroup')

        legendGroup
          .selectAll('.legend-cell-wrapper')
          .data([1])
          .enter()
          .append('g')
          .attr('class', 'legend-cell-wrapper')

        legendGroup
          .selectAll('.legend-box')
          .data([1])
          .enter()
          .append('rect')
          .attr('class', 'legend-box')
          .attr('width', 225)
          .attr('height', 500)
          .attr('fill', 'none')
          .attr('opacity', 1)
          .attr('stroke-width', '0.25px')
          .attr('rx', '0px')
          .attr('ry', '0px')

        var legendCellWrapper = legendGroup.select('.legend-cell-wrapper')
        var currentLegendCell = legendCellWrapper
          .selectAll('.legend-cell')
          .data(legendData)
          .join(
            function (enter) {
              enter
                .append('g')
                .attr('class', 'legend-cell')
                .attr('id', (traceObj) => `legend-cell-${traceObj.id}`)
                .on('click', function (d) {
                  const targetId = d.currentTarget.id.split('legend-cell-')[1]
                  var traceDisplay = d3.select(`#${targetId}`).attr('display')
                  if (traceDisplay === 'none') {
                    d3.select(`#${targetId}`).attr('display', 'block')
                    d3.select(this)
                      .transition()
                      .duration(250)
                      .ease(d3.easeExpOut)
                      .attr('opacity', 1)
                  } else {
                    d3.select(`#${targetId}`).attr('display', 'none')
                    d3.select(this)
                      .transition()
                      .duration(250)
                      .ease(d3.easeExpOut)
                      .attr('opacity', 0.2)
                  }
                })
                .selectAll('.legend-symbol')
                .data((traceObj) => [traceObj])
                .join(function (enter) {
                  var cellDistance = 40
                  var dy_0 = 35
                  var dx_0 = 70
                  enter
                    .append('line')
                    .attr('x1', -40)
                    .attr('x2', 40)
                    .attr('stroke-width', '2px')
                    .attr('transform', function (traceObj, i) {
                      var legendCellIdx = legend.legendObjs
                        .map((d) => d.id)
                        .indexOf(traceObj.id)
                      var dx = dx_0,
                        dy = dy_0 + legendCellIdx * cellDistance
                      return `translate(${dx}, ${dy})`
                    })
                    .attr('stroke', (traceObj) => traceObj.konodenColor)
                    .attr('stroke-dasharray', (traceObj) =>
                      lineStyle(traceObj.konodenLinestyle),
                    )

                  enter
                    .append('path')
                    .attr('class', 'legend-symbol')
                    .attr('d', (traceObj) =>
                      createMarkerPath(
                        traceObj.symbol,
                        traceObj.pointSize * 30,
                      ),
                    )
                    .attr('transform', function (traceObj, i) {
                      var legendCellIdx = legend.legendObjs
                        .map((d) => d.id)
                        .indexOf(traceObj.id)
                      var dx = dx_0,
                        dy = dy_0 + legendCellIdx * cellDistance
                      return `translate(${dx}, ${dy})`
                    })
                    .attr('fill', (traceObj) => traceObj.pointColor)
                    .attr(
                      'stroke-width',
                      (traceObj) => `${traceObj.pointBorderWidth}px`,
                    )
                    .attr('stroke', (traceObj) => traceObj.pointBorderColor)
                    .attr('opacity', (traceObj) => traceObj.pointOpacity)

                  enter
                    .append('text')
                    .attr('transform', function (traceObj, i) {
                      var legendCellIdx = legend.legendObjs
                        .map((d) => d.id)
                        .indexOf(traceObj.id)
                      var dx = dx_0 + 50,
                        dy = dy_0 + legendCellIdx * cellDistance
                      return `translate(${dx}, ${dy})`
                    })
                    .style('fill', 'black')
                    .attr('text-anchor', 'left')
                    .style('alignment-baseline', 'middle')
                    .style('font-size', '20px')
                    .text(function (traceObj) {
                      return traceObj.id
                    })
                })
            },
            (update) => update,
            (exit) => exit.remove(),
          )

        // Position Legend
        let triangleWidth = d3.select('#TernaryPlot').node().getBBox().width
        let legendWidth = legendGroup.node().getBBox().width
        let legendHeight = legendGroup.node().getBBox().height
        let legend_dx = 225
        let legend_dy = -350
        legendGroup.attr('transform', `translate(${legend_dx},${legend_dy})`)
      }

      renderTrace = function (traceObj) {
        var binodalLineFunction = d3
          .line()
          .x((d) => d[0])
          .y((d) => d[1])
          .curve(d3.curveCatmullRom)

        traceObj.data = traceObj.data.map(function (point) {
          point = appendCoordinates(point)
          return point
        })

        if (traceObj.data.length % 2 === 0) {
          var first_half = traceObj.data.slice(0, traceObj.data.length / 2)
          var second_half = traceObj.data
            .slice(traceObj.data.length / 2)
            .reverse()
        } else {
          var first_half = traceObj.data.slice(0, traceObj.data.length / 2)
          var second_half = traceObj.data
            .slice(traceObj.data.length / 2 + 1)
            .reverse()
        }
        var firstHalfCoordinates = first_half.map((d) => [d.dx, d.dy])
        var secondHalfCcoordinates = second_half.map((d) => [d.dx, d.dy])

        var konodenSvgPathArray = firstHalfCoordinates.map((d, i) =>
          d3.line()([d, secondHalfCcoordinates[i]]),
        )
        var binodalSvgPath = [
          binodalLineFunction(traceObj.data.map((d) => [d.dx, d.dy])),
        ]

        traceObj['konodenSvgPath'] = konodenSvgPathArray
        traceObj['binodaleSvgPath'] = binodalSvgPath

        d3.select('#TraceGroup')
          .append('g')
          .attr('id', traceObj.id)
          .attr('class', 'trace-wrapper')
          .selectAll('g')
          .data([
            {
              class: 'binodale-group',
            },
            {
              class: 'konoden-group',
            },
            {
              class: 'data-point-group',
            },
          ])
          .enter()
          .append('g')
          .attr('class', (d) => d.class)

        var currentTraceGroup = d3.select(`#${traceObj.id}`)

        currentTraceGroup
          .select('.binodale-group')
          .attr('visibility', traceObj.binodale)
          .selectAll('.binodale')
          .data(binodalSvgPath)
          .join(
            (enter) => enter.append('path'),
            (update) => update,
            (exit) => exit.remove(),
          )
          .attr('d', (d) => d)
          .attr('class', 'binodale')
          .attr('stroke-linejoin', 'round')
          .attr('fill', traceObj.binodaleFillColor)
          .attr('opacity', traceObj.binodaleOpacity)
          .attr('stroke', traceObj.binodaleLineColor)
          .attr('stroke-width', traceObj.binodaleLineWidth)
          .attr('stroke-dasharray', lineStyle(traceObj.binodaleLinestyle))

        currentTraceGroup
          .select('.konoden-group')
          .attr('visibility', traceObj.konoden)
          .selectAll('.konoden')
          .data(konodenSvgPathArray)
          .join(
            (enter) => enter.append('path'),
            (update) => update,
            (exit) => exit.remove(),
          )
          .attr('d', (d) => d)
          .attr('class', 'Konoden')
          .attr('stroke', traceObj.konodenColor)
          .attr('stroke-width', traceObj.konodenWidth)
          .attr('opacity', traceObj.konodenOpacity)
          .attr('stroke-dasharray', lineStyle(traceObj.konodenLinestyle))
          .attr('stroke-width', '1.6px')
          .attr('stroke-linecap', 'round')

        currentTraceGroup
          .select('.data-point-group')
          .attr('visibility', traceObj.points)
          .selectAll('.data-point')
          .data(traceObj.data)
          .join(
            (enter) => enter.append('path'),
            (update) => update,
            (exit) => exit.remove(),
          )
          .attr('class', 'data-point')
          .attr('transform', (d) => `translate(${d.dx},${d.dy})`)
          .attr('d', createMarkerPath(traceObj.symbol, traceObj.pointSize * 25))
          .attr('fill', traceObj.pointColor)
          .attr('stroke', traceObj.pointBorderColor)
          .attr('stroke-width', traceObj.pointBorderWidth)
      }

      // General update fns
      updatePlot = function () {
        d3.select('#TriangleBackground')
          .style('fill', diagramStyleObj.triangleBgColor)
          .attr('stroke', diagramStyleObj.triangleBorderColor)
          .attr('stroke-width', `${diagramStyleObj.triangleBorderThickness}px`)
        d3.select('#svgBackground').attr('fill', diagramStyleObj.svgBgColor)

        //// Axes Group
        d3.select('#AxesGroup')
          .selectAll('g')
          .selectAll('text')
          .style('fill', diagramStyleObj.tickColor)
          .style('font-size', `${diagramStyleObj.tickFontsize}px`)

        svg
          .select('#AxesGroup')
          .selectAll('g')
          .selectAll('g')
          .selectAll('line')
          .attr('visibility', diagramStyleObj.tickVisibility)
          .style('stroke', diagramStyleObj.tickColor)

        //// Grid Group
        d3.select('#GridGroup')
          .selectAll('.grid')
          .selectAll('.gridline')
          .attr('opacity', diagramStyleObj.gridOpacity)
        // Grid Thickness
        var gridGroups = d3.select('#GridGroup').selectAll('g').nodes()
        var bottomGridLines = d3
          .select(gridGroups[0])
          .selectAll('.gridline')
          .nodes()
        var rightGridLines = d3
          .select(gridGroups[1])
          .selectAll('.gridline')
          .nodes()
        var leftGridLines = d3
          .select(gridGroups[2])
          .selectAll('.gridline')
          .nodes()
        for (let i = 0; i < bottomGridLines.length; i += 2) {
          d3.select(bottomGridLines[i]).attr(
            'stroke-width',
            diagramStyleObj.mainGridThickness,
          )
          d3.select(rightGridLines[i]).attr(
            'stroke-width',
            diagramStyleObj.mainGridThickness,
          )
          d3.select(leftGridLines[i]).attr(
            'stroke-width',
            diagramStyleObj.mainGridThickness,
          )
        }
        for (let i = 1; i < bottomGridLines.length; i += 2) {
          d3.select(bottomGridLines[i]).attr(
            'stroke-width',
            diagramStyleObj.secondaryGridThickness,
          )
          d3.select(rightGridLines[i]).attr(
            'stroke-width',
            diagramStyleObj.secondaryGridThickness,
          )
          d3.select(leftGridLines[i]).attr(
            'stroke-width',
            diagramStyleObj.secondaryGridThickness,
          )
        }
        //Grid Stepsize
        d3.select('#GridGroup')
          .selectAll('.grid')
          .selectAll('.gridline')
          .attr('stroke-width', (d, i) =>
            i & 1
              ? diagramStyleObj.secondaryGridThickness
              : diagramStyleObj.mainGridThickness,
          )
          .attr('stroke', diagramStyleObj.gridColor)
          .attr('opacity', diagramStyleObj.gridOpacity)

        //// Labels & Title
        d3.select('#Title')
          .text(diagramStyleObj.title)
          .style('fill', diagramStyleObj.titleColor)
          .attr('font-size', `${diagramStyleObj.titleFontsize}px`)
        d3.select('#leftLabel')
          .text(diagramStyleObj.leftLabel)
          .style('fill', diagramStyleObj.labelColor)
          .attr('font-size', `${diagramStyleObj.labelFontsize}px`)
        d3.select('#bottomLabel')
          .text(diagramStyleObj.bottomLabel)
          .style('fill', diagramStyleObj.labelColor)
          .attr('font-size', `${diagramStyleObj.labelFontsize}px`)
        d3.select('#rightLabel')
          .text(diagramStyleObj.rightLabel)
          .style('fill', diagramStyleObj.labelColor)
          .attr('font-size', `${diagramStyleObj.labelFontsize}px`)
        var translateStr = d3
          .select('#rightLabel')
          .attr('transform')
          .split('(')[1]

        translateStr = translateStr.split(')')[0]
        var fontSize20Width = 72.23
        var rightLabelWidth = d3
          .select('#rightLabel')
          .node()
          .getBoundingClientRect().width
        var adjustedTranslateDx = fontSize20Width - rightLabelWidth
        if (d3.select('#rightLabel').attr('class') === 'edges labels') {
          d3.select('#rightLabel').attr('dx', adjustedTranslateDx)
        } else {
          d3.select('#rightLabel').attr('dx', 0)
        }
        d3.select('#LegendGroup')
          .selectAll('text')
          .style('fill', diagramStyleObj.textColor)
      }
      updateAxes = function () {
        axObj = {
          tickLength: diagramStyleObj.tickLength,
          nTicks: diagramStyleObj.nTicks,
          tickFontsize: diagramStyleObj.tickFontsize,
          tickWidth: diagramStyleObj.tickWidth,
          labelColor: diagramStyleObj.labelColor,
          tickStepsize: diagramStyleObj.tickStepsize,
        }
        drawAxes(A, B, C, axObj)
      }
      updateTrace = function (traceId) {
        if (traceId.includes('#')) {
          traceId = traceId.split('#')[1]
        }
        var traceIdx = traces.map((d) => d.id).indexOf(traceId)
        var traceObj = traces[traceIdx]

        var currentTraceGroup = d3.select(`#${traceObj.id}`)

        currentTraceGroup
          .select('.binodale-group')
          .attr('visibility', traceObj.binodale)
          .selectAll('.binodale')
          .attr('fill', traceObj.binodaleFillColor)
          .attr('opacity', traceObj.binodaleOpacity)
          .attr('stroke', traceObj.binodaleLineColor)
          .attr('stroke-width', traceObj.binodaleLineWidth)
          .attr('stroke-dasharray', lineStyle(traceObj.binodaleLinestyle))

        currentTraceGroup
          .select('.konoden-group')
          .attr('visibility', traceObj.konoden)
          .selectAll('.Konoden')
          .attr('stroke', traceObj.konodenColor)
          .attr('stroke-width', traceObj.konodenWidth)
          .attr('opacity', traceObj.konodenOpacity)
          .attr('stroke-dasharray', lineStyle(traceObj.konodenLinestyle))

        currentTraceGroup
          .select('.data-point-group')
          .attr('visibility', traceObj.points)
          .selectAll('.data-point')
          .attr('fill', traceObj.pointColor)
          .attr('opacity', traceObj.pointOpacity)
          .attr('stroke', traceObj.pointBorderColor)
          .attr('stroke-width', traceObj.pointBorderWidth)
          .attr('d', createMarkerPath(traceObj.symbol, traceObj.pointSize * 25))
      }
      updateLegend = function (traceId) {
        var legendVisibility = legend.visibility
        var legendData = legend.legendObjs
        if (traceId === undefined) {
        } else {
          var traceIdx = legend.legendObjs.map((d) => d.id).indexOf(traceId)
          var legendTraceObj = legend.legendObjs[traceIdx]

          var legendCell = d3.select(`#legend-cell-${legendTraceObj.id}`)
          var legendPoint = legendCell.select('.legend-symbol')
          var legendLine = legendCell.select('line')
          var legendText = legendCell.select('text')

          legendPoint
            .attr('fill', (traceObj) => traceObj.pointColor)
            .attr('opacity', (traceObj) => traceObj.pointOpacity)
            .attr(
              'stroke-width',
              (traceObj) => `${traceObj.pointBorderWidth}px`,
            )
            .attr('stroke', (traceObj) => traceObj.pointBorderColor)
            .attr('d', (traceObj) =>
              createMarkerPath(traceObj.symbol, traceObj.pointSize * 30),
            )

          legendLine
            .attr('stroke', (traceObj) => traceObj.konodenColor)
            .attr('stroke-dasharray', (traceObj) =>
              lineStyle(traceObj.konodenLinestyle),
            )

          legendText.text((traceObj) => traceObj.name)
        }

        var legendGroup = d3.select('#LegendGroup')
        legendGroup.attr('visibility', legend.visibility)
      }
    })
  }

  // Global
  chart.updateDiagramStyleObj = function (styleObj) {
    Object.keys(styleObj).map(function (d) {
      diagramStyleObj[d] = styleObj[d]
    })
  }
  chart.updatePlotStyle = function (styleObj) {
    chart.updateDiagramStyleObj(styleObj)
    updatePlot()
  }

  chart.resetDefault = function () {
    chart.updateDiagramStyleObj(defaultDiagramStyle)
    updatePlot()
  }

  chart.width = function (value) {
    if (!arguments.length) return width
  }

  chart.updateAxes = function (styleObj) {
    chart.updateDiagramStyleObj(styleObj)
    updateAxes()
  }

  // Utilities

  chart.labelPosition = function (position) {
    var labelObj = {
      leftLabel: diagramStyleObj.leftLabel,
      bottomLabel: diagramStyleObj.bottomLabel,
      rightLabel: diagramStyleObj.rightLabel,
      fontSize: diagramStyleObj.labelFontsize,
      labelColor: diagramStyleObj.labelColor,
      axesFontsize: diagramStyleObj.axesFontsize,
    }
    if (position === 'centered') {
      drawCenteredLabels(_a, _b, _c, labelObj)
    } else {
      drawEdgeabels(labelObj)
    }
  }
  chart.coordinatesToComposition = function (value) {
    var dx = value.x
    var dy = value.y
    var lgsMatrix = [
      [1, 1, 1],
      [A[0] / 100, B[0] / 100, C[0] / 100],
      [A[1] / 100, B[1] / 100, C[1] / 100],
    ]
    var freeTerms = [100, dx, dy]
    var coordinates = cramersRule(lgsMatrix, freeTerms)
    coordinates = coordinates.map((d) => {
      if (d < 0 || Number.isNaN(d)) {
        return 0
      } else {
        return d
      }
    })
    var f = d3.format('.1f')
    coordinates = coordinates.map((d) => f(d))
    coordinates = {
      left: coordinates[0],
      bottom: coordinates[1],
      right: coordinates[2],
    }
    return coordinates
  }

  //// Traces
  // Style Fns
  chart.binodalPointColor = function (value) {
    if (!arguments.length) return pointColor
    pointColor = value
    if (typeof updateBinodalPointColor === 'function') updateBinodalPointColor()
    return chart
  }
  chart.twoPhaseColor = function (value) {
    if (!arguments.length) return twoPhaseColor
    twoPhaseColor = value
    if (typeof updateTwoPhaseColor === 'function') updateTwoPhaseColor()
    return chart
  }
  chart.twoPhaseOpacity = function (value) {
    if (!arguments.length) return twoPhaseOpacity
    twoPhaseOpacity = Number(value)
    if (typeof updateTwoPhaseOpacity === 'function') updateTwoPhaseOpacity()
    return chart
  }
  chart.konodenColor = function (value) {
    if (!arguments.length) return konodenColor
    konodenColor = value
    if (typeof updateKonodenColor === 'function') updateKonodenColor()
    return chart
  }
  chart.konodenOpacity = function (value) {
    if (!arguments.length) return konodenOpacity
    konodenOpacity = Number(value)
    if (typeof updateKonodenOpacity === 'function') updateKonodenOpacity()
    return chart
  }
  chart.pointSize = function (value) {
    if (!arguments.length) return pointSize
    pointSize = Number(value)
    if (typeof updatePointSize === 'function') updatePointSize()
    return chart
  }
  chart.labelFontsize = function (value) {
    if (!arguments.length) return labelFontsize
    labelFontsize = Number(value)
    if (typeof updateLabelFontsize === 'function') updateLabelFontsize()
    return chart
  }
  chart.pointColor = function (value) {
    if (!arguments.length) return pointColor
    pointColor = value
    if (typeof updateBinodalPointColor === 'function') updateBinodalPointColor()
    return chart
  }
  chart.boldLabels = function () {
    d3.select('#LabelsGroup').selectAll('text').style('font-weight', 'bold')
    d3.select('#Title').style('font-weight', 'bold')
  }
  chart.normalLabels = function () {
    d3.select('#LabelsGroup').selectAll('text').style('font-weight', 'normal')
    d3.select('#Title').style('font-weight', 'normal')
  }

  chart.exportConfig = function () {
    return diagramStyleObj
  }
  // Data Fns;
  chart.updateTraceObj = function (traceId, valueObj) {
    if (traceId.includes('#')) {
      traceId = traceId.split('#')[1]
    }
    var traceIdx = traces.map((d) => d.id).indexOf(traceId)
    var traceObj = traces[traceIdx]
    Object.keys(valueObj).map(function (d) {
      traceObj[d] = valueObj[d]
    })
  }

  chart.appendTrace = function (value) {
    if (!arguments.length) return traces
    if (traces.length > 0) {
      var lastId = traces[traces.length - 1].id
      var nTraces = parseInt(lastId.split('-')[1])
    } else {
      var nTraces = 0
    }
    var currentTraceName = `Trace-${nTraces + 1}`
    if (Array.isArray(value)) {
      var traceObj = {
        data: value,
        id: currentTraceName,
        name: currentTraceName,
        binodale: 'visible',
        konoden: 'visible',
        points: 'visible',
        symbol: 'circle',
        konodenLinestyle: 'solid',
        binodaleLinestyle: 'solid',
        pointColor: '#e55555',
        pointBorderColor: '#000000',
        pointSize: 1,
        pointBorderWidth: 0.5,
        konodenColor: '#000000',
        konodenOpacity: 0.6,
        konodenWidth: 1,
        binodaleFillColor: '#286498',
        binodaleLineColor: '#000000',
        binodaleOpacity: 0.4,
        binodaleLineOpacity: 1,
        binodaleLineWidth: 0,
      }
    } else {
      var traceObj = value
    }

    traces.push(traceObj)
    legend.legendObjs.push({
      id: traceObj.id,
      name: traceObj.name,
      visibility: 'visible',
      symbol: traceObj.symbol,
      pointColor: traceObj.pointColor,
      pointSize: traceObj.pointSize,
      pointOpacity: traceObj.pointOpacity,
      pointBorderWidth: traceObj.pointBorderWidth,
      pointBorderColor: traceObj.pointBorderColor,
      pointBorderOpacity: traceObj.pointBorderOpacity,
      konodenLinestyle: traceObj.konodenLinestyle,
      konodenColor: traceObj.konodenColor,
      konodenOpacity: traceObj.konodenOpacity,
    })
    renderTrace(traceObj)
    renderLegend()
    return traceObj
  }
  chart.updateTraceLegendObj = function (traceId, valueObj) {
    var traceIdx = legend.legendObjs.map((d) => d.id).indexOf(traceId)
    var legendTraceObj = legend.legendObjs[traceIdx]
    Object.keys(valueObj).map(function (d) {
      legendTraceObj[d] = valueObj[d]
    })
    return chart
  }
  chart.hideTraceBinodale = function (traceId) {
    chart.updateTraceObj(traceId, {
      binodale: 'hidden',
    })
    updateTrace(traceId)
  }
  chart.showTraceBinodale = function (traceId) {
    chart.updateTraceObj(traceId, {
      binodale: 'visible',
    })
    updateTrace(traceId)
  }
  chart.hideTraceKonoden = function (traceId) {
    chart.updateTraceObj(traceId, {
      konoden: 'hidden',
    })
    updateTrace(traceId)
  }
  chart.showTraceKonoden = function (traceId) {
    chart.updateTraceObj(traceId, {
      konoden: 'visible',
    })
    updateTrace(traceId)
  }
  chart.hideTracePoints = function (traceId) {
    chart.updateTraceObj(traceId, {
      points: 'hidden',
    })
    updateTrace(traceId)
  }
  chart.showTracePoints = function (traceId) {
    chart.updateTraceObj(traceId, {
      points: 'visible',
    })
    updateTrace(traceId)
  }
  chart.showLegend = function () {
    legend.visibility = 'visible'
    updateLegend(undefined)
  }
  chart.hideLegend = function () {
    legend.visibility = 'hidden'
    updateLegend(undefined)
  }
  // Points
  chart.updateTracePointSize = function (traceId, sizeValue) {
    chart.updateTraceObj(traceId, {
      pointSize: sizeValue,
    })
    chart.updateTraceLegendObj(traceId, {
      pointSize: sizeValue,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTracePointOpacity = function (traceId, opacityValue) {
    chart.updateTraceObj(traceId, {
      pointOpacity: opacityValue,
    })
    chart.updateTraceLegendObj(traceId, {
      pointOpacity: opacityValue,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTracePointSymbol = function (traceId, symbol) {
    chart.updateTraceObj(traceId, {
      symbol: symbol,
    })
    chart.updateTraceLegendObj(traceId, {
      symbol: symbol,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTracePointColor = function (traceId, colorValue) {
    chart.updateTraceObj(traceId, {
      pointColor: colorValue,
    })
    chart.updateTraceLegendObj(traceId, {
      pointColor: colorValue,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTracePointBorderWidth = function (traceId, strokeWidth) {
    chart.updateTraceObj(traceId, {
      pointBorderWidth: strokeWidth,
    })
    chart.updateTraceLegendObj(traceId, {
      pointBorderWidth: strokeWidth,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTracePointBorderColor = function (traceId, strokeColor) {
    chart.updateTraceObj(traceId, {
      pointBorderColor: strokeColor,
    })
    chart.updateTraceLegendObj(traceId, {
      pointBorderColor: strokeColor,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  // Konoden
  chart.updateTraceKonodenLinestyle = function (traceId, linestyle) {
    chart.updateTraceObj(traceId, {
      konodenLinestyle: linestyle,
    })
    chart.updateTraceLegendObj(traceId, {
      konodenLinestyle: linestyle,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTraceKonodenColor = function (traceId, colorValue) {
    chart.updateTraceObj(traceId, {
      konodenColor: colorValue,
    })
    chart.updateTraceLegendObj(traceId, {
      konodenColor: colorValue,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTraceKonodenOpacity = function (traceId, opacityValue) {
    chart.updateTraceObj(traceId, {
      konodenOpacity: opacityValue,
    })
    chart.updateTraceLegendObj(traceId, {
      konodenOpacity: opacityValue,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  chart.updateTraceKonodenWidth = function (traceId, widthValue) {
    chart.updateTraceObj(traceId, {
      konodenWidth: widthValue,
    })
    chart.updateTraceLegendObj(traceId, {
      konodenWidth: widthValue,
    })
    updateTrace(traceId)
    updateLegend(traceId)
  }
  // Binodale
  chart.updateTraceBinodaleFillColor = function (traceId, colorValue) {
    chart.updateTraceObj(traceId, {
      binodaleFillColor: colorValue,
    })
    updateTrace(traceId)
  }
  chart.updateTraceBinodaleFillOpacity = function (traceId, opacityValue) {
    chart.updateTraceObj(traceId, {
      binodaleOpacity: opacityValue,
    })
    updateTrace(traceId)
  }
  chart.updateTraceBinodaleLinestyle = function (traceId, linestyle) {
    chart.updateTraceObj(traceId, {
      binodaleLinestyle: linestyle,
    })
    updateTrace(traceId)
  }
  chart.updateTraceBinodaleLineColor = function (traceId, colorValue) {
    chart.updateTraceObj(traceId, {
      binodaleLineColor: colorValue,
    })
    updateTrace(traceId)
  }
  chart.updateTraceBinodaleLineOpacity = function (traceId, opacityValue) {
    chart.updateTraceObj(traceId, {
      binodaleOpacity: opacityValue,
    })
    updateTrace(traceId)
  }
  chart.updateTraceBinodaleLineWidth = function (traceId, linewidth) {
    chart.updateTraceObj(traceId, {
      binodaleLineWidth: linewidth,
    })
    updateTrace(traceId)
  }
  chart.updateTraceName = function (traceId, textValue) {
    chart.updateTraceLegendObj(traceId, {
      name: textValue,
    })
    updateLegend(traceId)
  }
  chart.exportTraces = function () {
    var traceJson = traces
    return traceJson
  }
  chart.importTraces = function (configObj) {
    configObj.map(function (trace) {
      chart.appendTrace(trace)
    })
    return configObj
  }
  chart.clearTraces = function () {
    traces = []
    legend = {
      visibility: 'visible',
      legendObjs: [],
    }
    d3.select('#TraceGroup').selectAll('g').remove()

    d3.select('#LegendGroup').selectAll('g').remove()
  }

  chart.clearTrace = function (traceId) {
    var traceIdx = traces.map((d) => d.id).indexOf(traceId)
    traces.splice(traceIdx, 1)
    legend.legendObjs.splice(traceIdx, 1)
    d3.select('#TraceGroup').select(`#${traceId}`).remove()

    d3.select('#LegendGroup').select('.legend-cell-wrapper').remove()

    renderLegend()
  }

  chart.getStyleObj = function () {
    return diagramStyleObj
  }
  return chart
}

function lengthBetweenPoints(p1, p2) {
  let xCoord = p2[0] - p1[0]
  let yCoord = p2[1] - p1[1]
  let length = Math.sqrt(xCoord ** 2 + yCoord ** 2)
  return length
}

function createMarkerPath(symbol, pointSize) {
  var symbolGenerator = d3.symbol().type(symbols[symbol]).size(pointSize)
  var markerPath = symbolGenerator()
  return markerPath
}

const symbols = {
  circle: d3.symbolCircle,
  triangle: d3.symbolTriangle,
  cross: d3.symbolCross,
  diamond: d3.symbolDiamond,
  square: d3.symbolSquare,
  star: d3.symbolStar,
  Y: d3.symbolWye,
  triangleDown: customSymbols.symbolTriangleDown,
  triangleLeft: customSymbols.symbolTriangleLeft,
  triangleRight: customSymbols.symbolTriangleRight,
  diamondHorizontal: customSymbols.symbolDiamondAlt,
  diamondSquare: customSymbols.symbolDiamondSquare,
  pentagon: customSymbols.symbolPentagon,
  hexagon: customSymbols.symbolHexagon,
  hexagonHorizontal: customSymbols.symbolHexagonAlt,
  octagon: customSymbols.symbolOctagon,
  octagonHorizontal: customSymbols.symbolOctagonAlt,
  x: customSymbols.symbolX,
}

const lineStyle = d3
  .scaleOrdinal()
  .domain(['solid', 'dashed', 'dotted', 'dash-array'])
  .range(['', '4', '1 5', '4 1 2 3'])

function cramersRule(matrix, freeTerms) {
  function insertInTerms(matrix, ins, at) {
    var tmpMatrix = clone(matrix),
      i
    for (i = 0; i < matrix.length; i++) {
      tmpMatrix[i][at] = ins[i]
    }
    return tmpMatrix
  }

  function detr(m) {
    var ret = 1,
      k,
      A = clone(m),
      n = m[0].length,
      alpha

    for (var j = 0; j < n - 1; j++) {
      k = j
      for (var i = j + 1; i < n; i++) {
        if (Math.abs(A[i][j]) > Math.abs(A[k][j])) {
          k = i
        }
      }
      if (k !== j) {
        var temp = A[k]
        A[k] = A[j]
        A[j] = temp
        ret *= -1
      }
      var Aj = A[j]
      for (i = j + 1; i < n; i++) {
        var Ai = A[i]
        alpha = Ai[j] / Aj[j]
        for (k = j + 1; k < n - 1; k += 2) {
          var k1 = k + 1
          Ai[k] -= Aj[k] * alpha
          Ai[k1] -= Aj[k1] * alpha
        }
        if (k !== n) {
          Ai[k] -= Aj[k] * alpha
        }
      }
      if (Aj[j] === 0) {
        return 0
      }
      ret *= Aj[j]
    }
    return Math.round(ret * A[j][j] * 100) / 100
  }

  function clone(m) {
    return m.map(function (a) {
      return a.slice()
    })
  }

  var det = detr(matrix),
    returnArray = [],
    i,
    tmpMatrix

  for (i = 0; i < matrix[0].length; i++) {
    var tmpMatrix = insertInTerms(matrix, freeTerms, i)
    returnArray.push(detr(tmpMatrix) / det)
  }
  return returnArray
}
