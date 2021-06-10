import { TweenLite } from 'gsap'
import Power0 from 'gsap'

export const Accordion = (function () {
  var toggleItems, items

  var _init = function () {
    toggleItems = document.querySelectorAll('.trace__hwrapper')
    toggleItems = Array.prototype.slice.call(toggleItems)
    items = document.querySelectorAll('.trace')
    items = Array.prototype.slice.call(items)
    items.forEach((item) => (item.style.visibility = 'visible'))
    _addEventHandlers()
  }

  var _addEventHandlers = function () {
    toggleItems.forEach(function (item) {
      item.addEventListener('click', _toggleItem, false)
    })
  }

  var _toggleItem = function () {
    var parent = this.parentNode
    var content = parent.children[1]
    var easeEffect = Power0.easeNone
    if (!parent.classList.contains('is-active')) {
      const animationTime = 0.3
      // Disable Multiselect
      var activeItems = items.filter((element) =>
        element.classList.contains('is-active'),
      )
      var activeItemsContent = activeItems.map((item) => item.children[1])
      activeItems.map((item) => item.classList.remove('is-active'))
      activeItemsContent.map(function (content) {
        TweenLite.to(content, animationTime, {
          height: 0,
          immediateRender: false,
          ease: easeEffect,
        })
      })
      parent.classList.add('is-active')
      TweenLite.set(content, {
        height: 'auto',
      })
      TweenLite.from(content, animationTime, {
        height: 0,
        immediateRender: false,
        ease: easeEffect,
      })
    } else {
      parent.classList.remove('is-active')
      TweenLite.to(content, 0.3, {
        height: 0,
        immediateRender: false,
        ease: easeEffect,
      })
    }
  }

  return {
    init: _init,
  }
})()
