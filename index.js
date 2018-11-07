const h = require('mutant/html-element')
const Value = require('mutant/value')

function selectNone() {
  const sel = window.getSelection()
  sel.removeAllRanges()
}
function selectAll(el) {
  const range = document.createRange()
  range.selectNodeContents(el)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

module.exports = function(opts) {
  opts = opts || {}
  const canEdit = opts.canEdit || function() {return true}

  return function(value, ctx) {
    const editing = Value(false)
    let el

    function save() {
      if (el.innerText == value) return cancel()
      value = el.innerText
      editing.set(false)
      selectNone()
      el.blur()
      if (opts.save) opts.save(el.innerText, el)
    }
    
    function cancel() {
      editing.set(false)
      selectNone()
      el.innerText=value
      el.blur()
    }
    
    el = h('span', {
      attributes: {
        contenteditable: editing,
      },
      'ev-click': e => {
        if (!editing() && canEdit(e.target)) {
          editing.set(true)
          el.focus()
          selectAll(el)
        }
      },
      'ev-blur': e => {
        if (editing()) {
          save()
        }
      },
      'ev-keydown': e => {
        if (!editing()) return
        if (e.key == 'Escape') {
          cancel()
          e.preventDefault()
        }
        if (e.key == 'Enter') {
          save()
          e.preventDefault()
        }
      }
    }, value)
    return el
  }
}
