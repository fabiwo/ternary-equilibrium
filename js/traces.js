import { Accordion } from './accordion.js'
import { hot, updateHotData, clearTable, getTableData } from './table.js'
import * as fileHandling from './files.js'
import { initColorpickers } from './inputs.js'
import { ternary } from '../index.js'
import * as d3 from 'd3'

class Trace {
  constructor(id, onDelete) {
    this.id = id
    this.onDelete = onDelete
    this.name = `Style-${id}`
    this.html = this.traceHtmlString()
    this.node = this.parse_html_string_to_node(this.html)
  }

  pointContent() {
    return `
    <div class="input__row">
      <label for="point-checkbox" class="input__label">
        Enabled
      </label>
      <div class="input__element">
        <div class="inline-checkbox">
          <div class="fill"></div>
          <label class="switch">
            <input type="checkbox" class="point-checkbox" checked="" />
            <span class="round switch__slider"></span>
          </label>
        </div>
      </div>
    </div>
    <div class="input__row">
      <label for="symbol-select" class="input__label">
        Symbol
      </label>
      <div class="input__element">
        <select
          id="symbol-select"
          class="dropdown symbol-select"
        >
          <option value="circle">o</option>
          <option value="triangle">▲</option>
          <option value="cross">+</option>
          <option value="diamond">♦</option>
          <option value="square">■</option>
          <option value="star">⋆</option>
          <option value="Y">Y</option>
          <option value="triangleDown">▼</option>
          <option value="triangleLeft">⏴</option>
          <option value="triangleRight">⏵</option>
          <option value="diamondHorizontal">♦ horizontal</option>
          <option value="diamondSquare">◆</option>
          <option value="pentagon">⬟</option>
          <option value="hexagon">⬢</option>
          <option value="hexagonHorizontal">⬣</option>
          <option value="octagon">⯄</option>
          <option value="octagonHorizontal">⯄</option>
          <option value="x">x</option>
        </select>
      </div>
    </div>
    <div class="input__row">
      <label for="" class="input__label"> Fill </label>
      <div class="input__element">
        <div class="colorpicker">
          <label style="background-color: rgb(191, 92, 92)">
            <input
              class="inline-form-color point-color-select"
              type="color"
              name="point-color-select"
              value="#bf5c5c"
            />
          </label>
          <span
            for="svg-color-select"
            class="value"
            style="color: rgb(191, 92, 92)"
          >
            #bf5c5c
          </span>
        </div>
      </div>
    </div>
    <div class="input__row">
      <label for="" class="input__label"> Border </label>
      <div class="input__element">
        <div class="colorpicker">
          <label style="background-color: rgb(191, 92, 92)">
            <input
              class="inline-form-color point-border-color-select"
              type="color"
              name="point-border-color-select"
              value="#bf5c5c"
            />
          </label>
          <span
            for="svg-color-select"
            class="value"
            style="color: rgb(191, 92, 92)"
          >
            #bf5c5c
          </span>
        </div>
      </div>
    </div>
    <div class=" point-size-slider-div input__row">
      <label class="input__label"> Size </label>
      <div class="input__element">
        <div class="slider">
          <input
            class="point-size-slider"
            type="range"
            min="0"
            max="10"
            step="1"
            value="3"
          />
          <span class="point-size-value slider__value">3</span>
        </div>
      </div>
    </div>
    <div class=" point-opacity-slider-div input__row">
      <label class="input__label"> Opacity </label>
      <div class="input__element">
        <div class="slider">
          <input
            class="point-opacity-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value="1"
          />
          <span class="point-opacity-value slider__value">1</span>
        </div>
      </div>
    </div>
    <div class=" point-border-size-slider-div input__row">
      <label class="input__label"> Border </label>
      <div class="input__element">
        <div class="slider">
          <input
            class="point-border-size-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value="1"
          />
          <span class="point-border-size-value slider__value">1</span>
        </div>
      </div>
    </div>`
  }

  konodenContent() {
    return `
                    <div class="input__row">
                  <label
                    for="konoden-checkbox"
                    class="input__label"
                  >
                    Enabled
                  </label>
                  <div class="input__element">
                    <div class="inline-checkbox">
                      <div class="fill"></div>
                      <label class="switch">
                        <input
                          type="checkbox"
                          class="konoden-checkbox"
                          checked=""
                        />
                        <span class="round switch__slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="input__row">
                  <label
                    for="symbol-select"
                    class="input__label"
                  >
                    Linestyle
                  </label>
                  <div class="input__element">
                    <select
                      class="dropdown konoden-linestyle-select"
                    >
                      <option value="solid">-</option>
                      <option value="dashed">--</option>
                      <option value="dotted">..</option>
                      <option value="dash-array">-.</option>
                    </select>
                  </div>
                </div>
                <div class="input__row">
                  <label for="" class="input__label">
                    Linecolor
                  </label>
                  <div class="input__element">
                    <div class="colorpicker">
                      <label style="background-color: rgb(0, 0, 0)">
                        <input
                          class="inline-form-color konoden-color-select"
                          type="color"
                          name="konoden-color-select"
                          value="#000000"
                        />
                      </label>
                      <span
                        for="konoden-color-select"
                        class="value"
                        style="color: rgb(0, 0, 0)"
                      >
                        #000000
                      </span>
                    </div>
                  </div>
                </div>
                <div class=" konoden-opacity-slider-div input__row">
                  <label
                    class="input__label"
                    for="konoden-opacity-slider"
                  >
                    Opacity
                  </label>
                  <div class="input__element">
                    <div class="slider">
                      <input
                        class="konoden-opacity-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value="0.5"
                      />
                      <span class="konoden-opacity-value slider__value"
                        >0.5</span
                      >
                    </div>
                  </div>
                </div>
                <div class=" konoden-line-width-slider-div input__row">
                  <label
                    class="input__label"
                    for="konoden-line-width-slider"
                  >
                    Width
                  </label>
                  <div class="input__element">
                    <div class="slider">
                      <input
                        class="konoden-line-width-slider"
                        type="range"
                        min="0"
                        max="5"
                        step="0.01"
                        value="1"
                      />
                      <span
                        class="konoden-line-width-slider__value slider__value"
                      >
                        1
                      </span>
                    </div>
                  </div>
                </div>
    `
  }

  binodaleContent() {
    return `
                    <div class="input__row">
                  <label
                    for="binodale-checkbox"
                    class="input__label"
                  >
                    Enabled
                  </label>
                  <div class="input__element">
                    <div class="inline-checkbox">
                      <div class="fill"></div>
                      <label class="switch">
                        <input
                          type="checkbox"
                          class="binodale-checkbox"
                          checked=""
                        />
                        <span class="round switch__slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="input__row">
                  <label for="" class="input__label">
                    Area
                  </label>
                  <div class="input__element">
                    <div class="colorpicker">
                      <label style="background-color: rgb(134, 175, 208)">
                        <input
                          class="binodale-fill-color-select inline-form-color"
                          type="color"
                          name="binodale-fill-color-select"
                          value="#86afd0"
                        />
                      </label>
                      <span
                        for="binodale-fill-color-select"
                        class="value"
                        style="color: rgb(134, 175, 208)"
                      >
                        #86afd0
                      </span>
                    </div>
                  </div>
                </div>
                <div class="input__row">
                  <label for="" class="input__label">
                    Line
                  </label>
                  <div class="input__element">
                    <div class="colorpicker">
                      <label style="background-color: rgb(0, 0, 0)">
                        <input
                          class="binodale-line-color-select inline-form-color"
                          type="color"
                          name="binodale-line-color-select"
                          value="#000000"
                        />
                      </label>
                      <span
                        for="binodale-line-color-select"
                        class="value"
                        style="color: rgb(0, 0, 0)"
                      >
                        #000000
                      </span>
                    </div>
                  </div>
                </div>
                <div class="input__row">
                  <label
                    for="binodale-linestyle-select"
                    class="input__label"
                  >
                    Linestyle
                  </label>
                  <div class="input__element">
                    <select
                      class="binodale-linestyle-select dropdown"
                    >
                      <option value="solid">-</option>
                      <option value="dashed">--</option>
                      <option value="dotted">..</option>
                      <option value="dash-array">-.</option>
                    </select>
                  </div>
                </div>
                <div class="binodale-fill-opacity-slider-div input__row">
                  <label
                    class="input__label"
                    for="binodale-fill-opacity-slider"
                  >
                    Area Opacity
                  </label>
                  <div class="input__element">
                    <div class="slider">
                      <input
                        class="binodale-fill-opacity-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value="0.5"
                      />
                      <span class="binodale-fill-opacity-value slider__value">
                        0.5
                      </span>
                    </div>
                  </div>
                </div>
                <div class="binodale-line-width-slider-div input__row">
                  <label
                    class="input__label"
                    for="binodale-line-width-slider"
                  >
                    Line Width
                  </label>
                  <div class="input__element">
                    <div class="slider">
                      <input
                        class="binodale-line-width-slider"
                        type="range"
                        min="0"
                        max="5"
                        step="0.01"
                        value="1"
                      />
                      <span
                        class="binodale-line-width-slider__value slider__value"
                      >
                        1
                      </span>
                    </div>
                  </div>
                </div>
    `
  }

  traceHtmlString() {
    return `
      <li class="trace" id=${this.name}>
        <div class="trace__hwrapper">
          <h3 class="trace__title z-10 font-medium">${this.id}</h3>
          <img
            id="delete-${this.id}"
            loading="lazy"
            class="z-10 h-6 w-6"
            src="/icons/x.svg"
            alt=""
          />
        </div>
        <div class="trace__bwrapper">
          <div class="trace__body">
            <ul class="trace__tabs">
              <li class="menu-item">
                <a class="defaultOpen menu-a tab__link" target="">
                  <svg
                    class="h-12 w-12"
                    width="271"
                    height="236"
                    viewBox="0 0 271 236"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M265 231H2L133.5 2L265 231Z"
                      stroke="white"
                      stroke-width="4"
                      stroke-miterlimit="11.4737"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      stroke-width="3"
                      stroke="white"
                      d="M1.5 231C21.8333 204.833 97.4925 140.019 144.5 137C199 133.5 223.833 203.5 267 231.5"
                    ></path>
                    <path
                      stroke-width="3"
                      stroke="white"
                      d="M1 230.676C21.3716 213.725 100.411 190.85 132.5 196C173 202.5 223.752 212.862 267 231"
                    ></path>
                    <g fill="white" stroke="white">
                      <circle
                        cx="189"
                        cy="152"
                        r="9.875"
                        stroke-width="2.25"
                      ></circle>
                      <circle
                        cx="71"
                        cy="170"
                        r="9.875"
                        stroke-width="2.25"
                      ></circle>
                      <path
                        d="M220.375 174C220.375 179.454 215.954 183.875 210.5 183.875C205.046 183.875 200.625 179.454 200.625 174C200.625 168.546 205.046 164.125 210.5 164.125C215.954 164.125 220.375 168.546 220.375 174Z"
                        stroke-width="2.25"
                      ></path>
                      <circle
                        cx="98"
                        cy="153"
                        r="9.875"
                        stroke-width="2.25"
                      ></circle>
                      <circle
                        cx="128"
                        cy="139"
                        r="9.875"
                        stroke-width="2.25"
                      ></circle>
                      <circle
                        cx="160"
                        cy="138"
                        r="9.875"
                        stroke-width="2.25"
                      ></circle>
                      <circle
                        cx="45"
                        cy="187"
                        r="9.875"
                        stroke-width="2.25"
                      ></circle>
                      <circle
                        cx="229"
                        cy="194"
                        r="9.875"
                        stroke-width="2.25"
                      ></circle>
                      <path
                        d="M25.7997 208.9L35.5 203.299L45.2003 208.9V220.1L35.5 225.701L25.7997 220.1V208.9Z"
                        stroke-width="2.25"
                      ></path>
                      <path
                        d="M55.7997 197.9L65.5 192.299L75.2003 197.9V209.1L65.5 214.701L55.7997 209.1V197.9Z"
                        stroke-width="2.25"
                      ></path>
                      <path
                        d="M84.7997 190.9L94.5 185.299L104.2 190.9V202.1L94.5 207.701L84.7997 202.1V190.9Z"
                        stroke-width="2.25"
                      ></path>
                      <path
                        d="M114.8 188.9L124.5 183.299L134.2 188.9V200.1L124.5 205.701L114.8 200.1V188.9Z"
                        stroke-width="2.25"
                      ></path>
                      <path
                        d="M144.8 192.9L154.5 187.299L164.2 192.9V204.1L154.5 209.701L144.8 204.1V192.9Z"
                        stroke-width="2.25"
                      ></path>
                      <path
                        d="M175.8 199.9L185.5 194.299L195.2 199.9V211.1L185.5 216.701L175.8 211.1V199.9Z"
                        stroke-width="2.25"
                      ></path>
                      <path
                        d="M208.8 208.9L218.5 203.299L228.2 208.9V220.1L218.5 225.701L208.8 220.1V208.9Z"
                        stroke-width="2.25"
                      ></path>
                    </g>
                  </svg>
                </a>
              </li>
              <li class="menu-item">
                <a class="menu-a tab__link" target="">
                  <svg
                    class="h-12 w-12"
                    width="268"
                    height="233"
                    viewBox="0 0 268 233"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M265 231H2L133.5 2L265 231Z"
                      stroke="white"
                      stroke-width="4"
                      stroke-miterlimit="11.4737"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M133 112C97.7747 111.042 33.5362 181.926 2 231H265C212.043 187.312 168.225 112.958 133 112Z"
                      stroke="white"
                      stroke-width="2"
                    ></path>
                    <path
                      d="M51 178.5L197 171"
                      stroke="white"
                      stroke-width="10"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M73.5 155L177.5 149.5"
                      stroke="white"
                      stroke-width="10"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M29.1423 205L218 195"
                      stroke="white"
                      stroke-width="10"
                      stroke-miterlimit="2.61313"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M101 132L155.425 129.582"
                      stroke="white"
                      stroke-width="10"
                      stroke-linecap="round"
                    ></path>
                  </svg>
                </a>
              </li>
              <li class="menu-item">
                <a class="menu-a tab__link" target="">
                  <svg
                    class="h-12 w-12"
                    width="267"
                    height="233"
                    viewBox="0 0 267 233"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M265 231H2L133.5 2L265 231Z"
                      fill="transparent"
                      stroke="white"
                      stroke-width="4"
                      stroke-miterlimit="11.4737"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <g fill="white">
                      <path
                        d="M133.023 109.01C99.4047 108.052 38.0973 178.93 8 228H259C208.459 184.316 166.641 109.967 133.023 109.01Z"
                        stroke="white"
                        stroke-width="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                </a>
              </li>
            </ul>
            <div class="trace__tabcontent">
              <div class="trace__content">
                    ${this.pointContent()}
              </div>
              <div class="trace__content">
                ${this.konodenContent()}
              </div>
              <div class="trace__content">
                ${this.binodaleContent()}
              </div>
            </div>
          </div>
        </div>
      </li>
    `
  }

  parse_html_string_to_node(string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(string, 'text/html')
    const node = doc.body.firstChild
    return node
  }
}

export const getNTraces = () => {
  return document.getElementById('trace-list').childNodes.length
}

const initTraceTabs = (traceId, pointId, konodenId, binodaleId) => {
  function openTab(evt) {
    const contentId = this.parentElement.parentElement.parentElement
      .parentElement.parentElement.id
    const traceTabContent = d3
      .select(`#${contentId}`)
      .selectAll('.trace__body .trace__content')
      .nodes()
    const traceTabLinks = d3
      .select(`#${contentId}`)
      .selectAll('.trace__body .tab__link')
      .nodes()
    traceTabContent.forEach((d) => (d.style.display = 'none'))
    traceTabLinks.forEach((d) => d.parentElement.classList.remove('active'))

    document.querySelector(this.target).style.display = 'flex'
    evt.currentTarget.parentElement.className += ' active'
  }

  const traceTabContent = [
    ...document.querySelectorAll(`${traceId} .trace__content`),
  ]
  const traceTabLinks = [...document.querySelectorAll(`${traceId} .tab__link`)]
  const navHrefs = [
    {
      href: pointId,
      id: pointId.split('#')[1],
    },
    {
      href: konodenId,
      id: konodenId.split('#')[1],
    },
    {
      href: binodaleId,
      id: binodaleId.split('#')[1],
    },
  ]

  traceTabLinks.map((link, i) => {
    traceTabContent[i].setAttribute('id', navHrefs[i].id)
    link.setAttribute('target', navHrefs[i].href)
    link.addEventListener('click', openTab)
  })
  document.querySelector(`${traceId} .defaultOpen`).click()
}

const initSliders = (node) => {
  const sliders = [...node.getElementsByClassName('slider')]
  const inputs = sliders.map((slider) => slider.querySelector('input'))
  const texts = sliders.map((slider) => slider.querySelector('span'))

  inputs.map((input, index) => {
    const text = texts[index]

    input.addEventListener('input', (e) => {
      const value = e.target.value
      text.innerHTML = value
    })
  })
}

const initInputs = (node) => {
  initSliders(node)
  initColorpickers(node)
}

const attachInputs = (inputs, checkboxes, settingsNode, traceId) => {
  inputs.map((input) => {
    const node = settingsNode.querySelector(input.input)

    node.addEventListener(input.event, (e) => {
      const value = e.target.value
      input.function(traceId, value)
    })
  })

  checkboxes.map((checkbox) => {
    const node = settingsNode.querySelector(checkbox.input)

    node.addEventListener(checkbox.event, (e) => {
      const isChecked = d3
        .select(settingsNode)
        .select(checkbox.input)
        .property('checked')
      isChecked ? checkbox.show(traceId) : checkbox.hide(traceId)
    })
  })
}

const deleteTrace = (evt) => {
  const traceElement = evt.target.parentElement.parentElement
  const traceId = traceElement.id.split('Style-')[1]
  ternary.clearTrace(traceId)
  traceElement.remove()
  const nTraces = getNTraces()
  document.getElementById('trace-counter').textContent = nTraces
}

export const addTraces = (traces) => {
  traces.map((trace) => {
    renderTraceComponent(trace)
  })

  const nTraces = getNTraces()
  const traceCount = document.getElementById('trace-counter')
  traceCount.textContent = nTraces
}

export const onAddTraceClick = () => {
  let data = getTableData()
  const result = validateData(data)

  if (result.isValid === true) {
    data = preProcessData(data)
    const traceObj = ternary.appendTrace(data)
    addTraces([traceObj])
    clearTable()
  } else {
    window.alert(result.msg)
  }
}

const initTrace = (traceObj) => {
  const traceName = traceObj.id
  const traceId = `#Style-${traceName}`
  // styleNode: UI Component to change settings
  // traceNode: Group element in graph
  const styleNode = document.querySelector(traceId)
  const traceNode = document.getElementById(traceName)

  const pointId = `#${traceName}-points`
  const konodenId = `#${traceName}-konoden`
  const binodaleId = `#${traceName}-binodale`

  const inputs = [
    {
      input: '.point-size-slider',
      function: ternary.updateTracePointSize,
      event: 'input',
    },
    {
      input: '.point-opacity-slider',
      function: ternary.updateTracePointOpacity,
      event: 'input',
    },
    {
      input: '.point-border-size-slider',
      function: ternary.updateTracePointBorderWidth,
      event: 'input',
    },
    {
      input: '.konoden-opacity-slider',
      function: ternary.updateTraceKonodenOpacity,
      event: 'input',
    },
    {
      input: '.konoden-line-width-slider',
      function: ternary.updateTraceKonodenWidth,
      event: 'input',
    },
    {
      input: '.binodale-fill-opacity-slider',
      function: ternary.updateTraceBinodaleFillOpacity,
      event: 'input',
    },
    {
      input: '.binodale-line-width-slider',
      function: ternary.updateTraceBinodaleLineWidth,
      event: 'input',
    },
    {
      input: '.point-color-select',
      function: ternary.updateTracePointColor,
      event: 'input',
    },
    {
      input: '.point-border-color-select',
      function: ternary.updateTracePointBorderColor,
      event: 'input',
    },
    {
      input: '.konoden-color-select',
      function: ternary.updateTraceKonodenColor,
      event: 'input',
    },
    {
      input: '.binodale-fill-color-select',
      function: ternary.updateTraceBinodaleFillColor,
      event: 'input',
    },
    {
      input: '.binodale-line-color-select',
      function: ternary.updateTraceBinodaleLineColor,
      event: 'input',
    },
    {
      input: '.binodale-linestyle-select',
      function: ternary.updateTraceBinodaleLinestyle,
      event: 'input',
    },
    {
      input: '.konoden-linestyle-select',
      function: ternary.updateTraceKonodenLinestyle,
      event: 'input',
    },
    {
      input: '.symbol-select',
      function: ternary.updateTracePointSymbol,
      event: 'input',
    },
  ]

  const checkboxes = [
    {
      input: '.binodale-checkbox',
      event: 'click',
      show: ternary.showTraceBinodale,
      hide: ternary.hideTraceBinodale,
    },
    {
      input: '.konoden-checkbox',
      event: 'click',
      show: ternary.showTraceKonoden,
      hide: ternary.hideTraceKonoden,
    },
    {
      input: '.point-checkbox',
      event: 'click',
      show: ternary.showTracePoints,
      hide: ternary.hideTracePoints,
    },
  ]

  // Initialize UI Skeleton
  initTraceTabs(traceId, pointId, konodenId, binodaleId)
  initInputs(styleNode)
  Accordion.init()

  // Connect Inputs
  attachInputs(inputs, checkboxes, styleNode, traceName)
}

export const renderTraceComponent = (traceObj) => {
  const traceList = document.querySelector('#trace-list')
  const traceId = traceObj.id
  const trace = new Trace(traceId, deleteTrace)
  const node = trace.node

  node
    .querySelector(`#delete-${traceId}`)
    .addEventListener('click', deleteTrace)

  traceList.appendChild(node)
  initTrace(traceObj)
}
//================== Process Data Streams ==========================================
export const preProcessData = (data) => {
  const roundNumber = (number, digits) => {
    const roundedNumber =
      Math.round((number + Number.EPSILON) * Math.pow(10, digits)) /
      Math.pow(10, digits)
    return roundedNumber
  }

  const toFloat = (values) => {
    return {
      left: parseFloat(values.left),
      bottom: parseFloat(values.bottom),
      right: parseFloat(values.right),
    }
  }

  const normalize = (values) => {
    const errorMsg = []
    const normalizedValues = values.map(function (d, i) {
      const valueSum = d.left + d.bottom + d.right
      if (valueSum != 1) {
        if (valueSum != 100) {
          errorMsg.push(`Normalized in line ${i}: ${valueSum}`)
        }
      }
      return {
        left: d.left / valueSum,
        bottom: d.bottom / valueSum,
        right: d.right / valueSum,
      }
    })
    return normalizedValues
  }

  const scaleToPercent = (values) => {
    let percentValues = values.map(function (d, i) {
      return {
        left: 100 * d.left,
        bottom: 100 * d.bottom,
        right: 100 * d.right,
      }
    })
    return percentValues
  }

  const sortAscending = (values) => {
    const indexOfAll = (arr, val) =>
      arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

    function diff(ary) {
      var newA = []
      for (var i = 1; i < ary.length; i++) newA.push(ary[i - 1] - ary[i])
      return newA
    }

    function isMonotonous(num) {
      if (num.length === 1) {
        return true
      }
      var num_direction = num[1] - num[0]
      for (var i = 0; i < num.length - 1; i++) {
        if (num_direction * (num[i + 1] - num[i]) <= 0) {
          return false
        }
      }
      return true
    }

    function isNegativeOrPositive(ar) {
      let nCount = 0
      let pCount = 0
      const tolerance = 2
      ar.map((d) => {
        let isNumberNegative = d <= 0
        let isNumberPositive = d >= 0
        if (isNumberPositive) {
          pCount++
        } else if (isNumberNegative) {
          nCount++
        }
      })
      if (pCount > nCount && nCount <= tolerance) {
        return true
      } else if (nCount > pCount && pCount <= tolerance) {
        return true
      } else {
        return false
      }
    }

    function sortByKey(objArray, indexArray) {
      const sortedValues = indexArray.map((idx) => objArray[idx])
      return sortedValues
    }

    var unsortedArrays = {
      left: values.map((d) => d.left),
      bottom: values.map((d) => d.bottom),
      right: values.map((d) => d.right),
    }

    const keys = Object.keys(unsortedArrays)
    let sortedArrays = {}
    let sortedIndexesArrays = {}
    keys.map((key) => {
      // Sort Array
      let sortedArray = [...unsortedArrays[key]]
      sortedArray = sortedArray.sort(function (a, b) {
        return b - a
      })
      sortedArrays[key] = sortedArray
      // Calculate indexes from unsorted array
      let sortedIndexArray = []
      sortedArrays[key].map((sortedArray) => {
        let idx = indexOfAll(unsortedArrays[key], sortedArray)
        if (idx.length === 2) {
          if (sortedIndexArray.includes(idx[0])) {
            sortedIndexArray.push(idx[1])
          } else {
            sortedIndexArray.push(idx[0])
          }
        } else {
          sortedIndexArray.push(idx[0])
        }
      })
      sortedIndexesArrays[key] = sortedIndexArray
    })

    let validKeys = []
    keys.map((sortKey) => {
      let sortedValues = {
        left: sortByKey(unsortedArrays.left, sortedIndexesArrays[sortKey]),
        bottom: sortByKey(unsortedArrays.bottom, sortedIndexesArrays[sortKey]),
        right: sortByKey(unsortedArrays.right, sortedIndexesArrays[sortKey]),
      }

      let differences = {
        left: diff(sortedValues.left),
        bottom: diff(sortedValues.bottom),
        right: diff(sortedValues.right),
      }

      let areArraysPositiveOrNegative = {
        left: isNegativeOrPositive(differences.left),
        bottom: isNegativeOrPositive(differences.bottom),
        right: isNegativeOrPositive(differences.right),
      }

      let nTrue = Object.values(areArraysPositiveOrNegative).filter(
        (d) => d === true,
      )
      if (nTrue.length > 1) {
        validKeys.push(sortKey)
      }
    })
    return sortByKey(values, sortedIndexesArrays[validKeys[0]])
  }

  const checkForNumeric = (values) => {
    values = values.filter((row) => row.includes('') !== true)
    var nonNumericElements = []
    let numericRows = values.filter(function (row, i) {
      let areElementsNumeric = row.map((d) => isNumeric(d))
      let allElementsNumeric = areElementsNumeric.some(
        (element) => element === true,
      )
      if (allElementsNumeric) {
        return row
      }
      nonNumericElements.push({
        keys: row,
        index: i,
      })
    })
    return {
      numericValues: numericRows,
      nonNumericValues: nonNumericElements,
    }
  }

  const deleteEmptyRows = (values) => {
    values = values.filter((row, i) => {
      if (!row.some((el) => el === '')) {
        return row
      }
      errorMsg.push(`Row with empty value ${row} in row ${i}`)
    })
    return values
  }

  const deleteUndefinedRows = (values) => {
    values = values.filter((row, i) => {
      if (!row.some((el) => el === undefined)) {
        return row
      }
      errorMsg.push(`Row with undefined value ${row} in row ${i}`)
    })
    return values
  }

  const deleteUnequalRows = (values, nCols) => {
    values = values.filter((row, i) => {
      if (!(row.length < nCols) && !(row.length > nCols)) {
        return row
      }
      errorMsg.push(
        `Row with more or less than ${nCols} values ${row} in row ${i}`,
      )
    })
    return values
  }

  const correctKeys = (keys) => {
    var remainingKeys = ['left', 'bottom', 'right']
    keys = keys.map((key, i) => {
      if (key === 'left') {
        remainingKeys = remainingKeys.filter((d) => !(d === 'left'))
        return key
      } else if (key === 'bottom') {
        remainingKeys = remainingKeys.filter((d) => !(d === 'bottom'))
        return key
      } else if (key === 'right') {
        remainingKeys = remainingKeys.filter((d) => !(d === 'right'))
        return key
      }
    })
    remainingKeys.map((remainingKey, i) => {
      keys[keys.indexOf(undefined)] = remainingKey
    })
    return keys
  }

  const createObjectArray = (numericRows, keys) => {
    var objectArray = numericRows.map((row) => {
      let rowObject = {}
      for (let i = 0; i < keys.length; i++) {
        rowObject[keys[i]] = row[i]
      }
      return rowObject
    })
    return objectArray
  }

  // data validation
  const errorMsg = []
  const isNull = (el) => el === null
  const isEmpty = (el) => el === ''
  const isUndefined = (el) => el === undefined

  const loadedData = data
    .filter((row) => !row.some(isNull))
    .filter((row) => !row.some(isEmpty))
    .filter((row) => !row.some(isUndefined))

  let numericalSplittedData = checkForNumeric(loadedData)
  numericalSplittedData.numericValues = deleteEmptyRows(
    numericalSplittedData.numericValues,
  )
  numericalSplittedData.numericValues = deleteUndefinedRows(
    numericalSplittedData.numericValues,
  )
  numericalSplittedData.numericValues = deleteUnequalRows(
    numericalSplittedData.numericValues,
    3,
  )

  if (numericalSplittedData.nonNumericValues.length === 0) {
    var keys = ['left', 'bottom', 'right']
  } else if (numericalSplittedData.nonNumericValues.length === 1) {
    var keys = numericalSplittedData.nonNumericValues[0].keys
    if (!hasDuplicateString(keys)) {
      keys = correctKeys(keys)
    } else {
      window.alert(
        "File has duplicate column name\nNames must be unique ('left', 'bottom' 'right')",
      )
      return
    }
  } else if (numericalSplittedData.nonNumericValues.length > 1) {
    window.alert('Please upload a valid spreadsheet format')
    return
  }

  let objectArray = createObjectArray(numericalSplittedData.numericValues, keys)

  let processedData = objectArray.map((d) => toFloat(d))
  processedData = normalize(processedData)
  processedData = scaleToPercent(processedData)
  processedData = sortAscending(processedData)

  // Round preprocessed data to choosen number of digits
  processedData = processedData.map((row) => {
    const digits = 2
    return {
      left: roundNumber(row.left, digits).toFixed(digits),
      bottom: roundNumber(row.bottom, digits).toFixed(digits),
      right: roundNumber(row.right, digits).toFixed(digits),
    }
  })

  return processedData
}

const validateData = (data) => {
  if (data.length === 0) {
    return {
      isValid: false,
      msg: 'No data\nPlease fill at least one table row',
    }
  }

  var dataSum = data.map((d) =>
    d.reduce((pv, cv) => parseFloat(pv) + parseFloat(cv), 0),
  )
  dataSum = dataSum.map((d) => parseFloat(d.toFixed(2)))
  var dataSumValidator = dataSum.map(function (sum) {
    const tolerance = 0.01
    if (sum > 1 + tolerance || sum < 1 - tolerance) {
      if (sum > 100 + tolerance || sum < 100 - tolerance) {
        return false
      }
      return '100'
    }
    return '1'
  })
  const indexOfAll = (arr, val) =>
    arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])
  var falseIdx = indexOfAll(dataSumValidator, false)
  if (dataSumValidator.includes(false)) {
    var alertString = `Sum of 3 Components must be 100 or 1.\n`
    falseIdx.map(function (idx) {
      alertString = alertString + `Error in Row ${idx + 1}\n`
    })
    falseIdx.map(function (cellIdx) {
      //var row = d3
      //  .select("#spreadsheet")
      //  .select(".jexcel")
      //  .select("tbody")
      //  .selectAll("tr")
      //  .nodes()[cellIdx];
      //
      //var cells = d3.select(row).selectAll("td").nodes().slice(1, 4);
      //
      //cells.map((d) => d3.select(d).style("background-color", "yellow"));
    })
    return {
      isValid: false,
      msg: alertString,
    }
  } else {
    return {
      isValid: true,
      msg: '',
    }
  }
}

const isNumeric = (str) => {
  if (typeof str != 'string') return false // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}

const hasDuplicateString = (w) => {
  return new Set(w).size !== w.length
}
