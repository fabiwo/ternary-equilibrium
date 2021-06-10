import * as d3 from 'd3'

export function donutChart() {
  //// All options that should be accessible to caller
  var width = 400
  var height = 400
  var margin = 110
  var data = {}
  var leftLabel = 'Carrier'
  var bottomLabel = 'Solvent'
  var rightLabel = 'Target'
  //// Static options
  var radius = Math.min(width, height) / 2 - margin
  const color = d3
    .scaleOrdinal()
    .domain(['1', '2', '3'])
    .range(['#f23224', '#248ef2', '#53a972'])

  var arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.95)
    .padAngle(0.02)
    .padRadius(200)
    .cornerRadius(2)

  var outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  //// Update Functions
  var updateData
  var updateWidth
  var updateHeight
  var updateLeftLabel
  var updateRightLabel
  var updateBottomLabel

  // Functions
  function preProcessData(data) {
    const pie = d3.pie()

    pie.sort(null).value(function (d) {
      return d.value
    })

    const dataArray = []
    Object.entries(data).map((d) => {
      let dataObj = { key: d[0], value: d[1] }
      dataArray.push(dataObj)
    })

    let data_ready = pie(dataArray)
    return data_ready
  }

  function drawArc(data) {
    d3.select('#arcSegmentWrapper')
      .selectAll('.DonutArcSegment')
      .data(data)
      .join(
        (enter) => enter.append('path'),
        (update) => update,
        (exit) => exit.remove(),
      )
      .attr('class', 'DonutArcSegment')
      .attr('d', arc)
      .attr('fill', function (d) {
        return color(d.data.key)
      })
      .attr('stroke', '#323232')
      .style('stroke-width', '0.1px')
      .style('opacity', 1)

    d3.select('#arcSegmentWrapper')
      .selectAll('.segmentPercentage')
      .data(data)
      .join(
        (enter) => enter.append('text'),
        (update) => update,
        (exit) => exit.remove(),
      )
      .attr('class', 'segmentPercentage')
      .each(function (d) {
        var f = d3.format('.0f')
        var centroid = arc.centroid(d)
        d3.select(this)
          .attr('x', centroid[0])
          .attr('y', centroid[1])
          .attr('dy', '0.33em')
          .text(`${f(d.data.value)}`)
          .attr('fill', 'white')
          .attr('font-size', '1em')
      })

    d3.select('#arcLabelWrapper')
      .selectAll('.DonutLabel')
      .data(data)
      .join(
        (enter) => enter.append('text'),
        (update) => update,
        (exit) => exit.remove(),
      )
      .style('font-size', '1em')
      .style('fill', (d) => color(d.data.key))
      .text((d) => d.data.key)
      .attr('class', 'DonutLabel')
      .attr('transform', function (d) {
        var pos = outerArc.centroid(d)
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1)
        return 'translate(' + pos + ')'
      })
      .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return midangle < Math.PI ? 'start' : 'end'
      })
  }

  function chart(selection) {
    selection.each(function () {
      const svg = d3
        .select(this)
        .append('svg')
        .attr('font-family', 'Oxygen Light')
        .attr('id', 'donutSvg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', width)
        .attr('height', height)
      //.classed("svg-content", true)
      //.attrs({
      //    id: "donutSvg",
      //    width: width,
      //    height: height
      //})

      d3.select('#donutSvg')
        .append('rect')
        .attr('id', 'donutBackground')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')

      d3.select('#donutBackground')

      const donutWrapper = svg
        .append('g')
        .attr('id', 'donutWrapper')
        .attr('transform', `translate(${width / 2} ${height / 2})`)

      // Put All Groups into SVG
      const arcSegmentWrapper = donutWrapper
        .append('g')
        .attr('id', 'arcSegmentWrapper')
      const arcLabelWrapper = donutWrapper
        .append('g')
        .attr('id', 'arcLabelWrapper')

      // Fill all group elements with content
      var data_ready = preProcessData(data)
      drawArc(data_ready)

      updateWidth = function () {
        svg.transition().duration(200).attr('width', width)
      }
      updateHeight = function () {
        svg.transition().duration(200).attr('height', height)
      }
      updateData = function (data) {
        var processedData = preProcessData(data)
        drawArc(processedData)
      }
    })
  }

  chart.data = function (value) {
    if (!arguments.length) return data
    data = value
    if (typeof updateData === 'function') updateData(data)
    return chart
  }

  chart.width = function (value) {
    if (!arguments.length) return width
    width = value
    if (typeof updateWidth === 'function') updateWidth()
    return chart
  }
  chart.leftLabel = function (value) {
    var leftLabel = d3
      .select('#arcLabelWrapper')
      .selectAll('.DonutLabel')
      .nodes()[0]
    d3.select(leftLabel).text(value)
  }
  chart.bottomLabel = function (value) {
    var bottomLabel = d3
      .select('#arcLabelWrapper')
      .selectAll('.DonutLabel')
      .nodes()[1]
    d3.select(bottomLabel).text(value)
  }
  chart.rightLabel = function (value) {
    var rightLabel = d3
      .select('#arcLabelWrapper')
      .selectAll('.DonutLabel')
      .nodes()[2]
    d3.select(rightLabel).text(value)
  }
  return chart
}
