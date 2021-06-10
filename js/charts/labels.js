import * as d3 from 'd3';

export class Label {
  constructor(id, styleOptions) {
    this.id = id;
    this.text = styleOptions.text;
    this.rotation = styleOptions.rotation;
    this.position = styleOptions.position;
    this.textColor = styleOptions.textColor;
    this.fontSize = styleOptions.fontSize;
  }
}

export class LabelCollection {
  constructor(labelArray) {
    this.labels = labelArray;
  }
  appendToGroup(selector, isEditable) {
    this.attachedGroup = d3.select(selector);

    if (isEditable) {
      this.attachedGroup
        .selectAll('.labels')
        .data(this.labels)
        .enter()
        .append('foreignObject')
        .style('width', '500px')
        .style('height', '100px')
        .attr(
          'transform',
          (label) => `translate(${label.position}) rotate(${label.rotation})`
        )
        .append('xhtml:div')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('align-items', 'center')
        .append('span')
        .attr('contentEditable', true)
        .attr('id', (label) => label.id)
        .attr('class', 'centered')
        .style('font-size', (label) => `${label.fontSize}px`)
        .style('fill', (label) => label.textColor)
        .text((label) => label.text);
    } else {
      this.attachedGroup
        .selectAll('.labels')
        .data(this.labels)
        .enter()
        .append('text')
        .attr('class', 'centered labels')
        .attr('id', (label) => label.id)
        .attr(
          'transform',
          (label) => `translate(${label.position}) rotate(${label.rotation})`
        )
        .attr('text-anchor', 'middle')
        .attr('font-size', (label) => `${label.fontSize}px`)
        .text((label) => label.text)
        .style('fill', (label) => label.labelColor);
    }
  }
}
