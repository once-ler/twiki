import AutoComplete from '../../autocomplete/src'

class AutoTags {
  tags = []

  autocomplete = null

  autocomplete_el = null

  autotags_result = null

  userItemOnClick = null

  elemId = ''

  constructor(props, elem) {
    const { itemOnClick } = props
    this.userItemOnClick = itemOnClick

    const nextProps = { ...props, itemOnClick: this.addTag }

    this.autocomplete = new AutoComplete(nextProps, elem)

    this.elemId = this.autocomplete.elemId
    this.autocomplete_el = this.autocomplete.autocomplete

    const resContainer = document.createElement('div')
    resContainer.setAttribute('class', 'autotags')
    const resList = document.createElement('ul')
    resList.setAttribute('id', `${this.elemId}_tags_result`)
    resList.setAttribute('class', 'autotags_result')
    resContainer.appendChild(resList)
    this.autotags_result = resList

    this.autocomplete_el.parentNode.insertBefore(resContainer, this.autocomplete_el)
  }

  appendToList = item => {
    const itemEl = document.createElement('li')
    const itemLbl = document.createElement('label')
    itemLbl.appendChild(document.createTextNode(item.display))
    const itemDestroy = document.createElement('button')
    itemDestroy.onclick = () => itemEl.parentNode.removeChild(itemEl)

    itemEl.appendChild(itemLbl)
    itemLbl.parentNode.insertBefore(itemDestroy, itemLbl.nextSibling)
    this.autotags_result.appendChild(itemEl)    
  }

  addTag = item => {
    const keys = this.tags.map(o => o.code)
    if (keys.indexOf(item.code) === -1) {
      this.tags.push(item)
      this.appendToList(item)
      this.autocomplete_el.value = '';
    }

    this.userItemOnClick && this.userItemOnClick(item)
  }
}

export default AutoTags
