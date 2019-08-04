import AutoComplete from '../../autocomplete/src'

class AutoTags {
  tags = []

  autocomplete = null

  autocomplete_el = null

  autotags_result = null

  userItemOnClick = null

  elemId = ''

  constructor(props, elem) {
    const { itemOnClick, itemOnRemove } = props
    this.userItemOnClick = itemOnClick

    const nextProps = { ...props, itemOnClick: this.addTag }

    this.autocomplete = new AutoComplete(nextProps, elem)

    this.elemId = this.autocomplete.elemId
    this.autocomplete_el = this.autocomplete.autocomplete

    // Check for existing list container.  It is the previous sibling.
    const prevEl = this.autocomplete_el.previousElementSibling

    if (prevEl && this.hasClass(prevEl, 'autotags-list') && prevEl.querySelector('ul')) {
      const resList = prevEl.querySelector('ul')
      this.appendDropdownButton(resList)
      this.autotags_result = resList
      // Attach destroy button to each li item.
      const items = resList.children
      for (let i = 0; i < items.length; i++) {
        const itemEl = items[i]
        const code = itemEl.dataset.id
        const label = itemEl.querySelector('label')
        
        if (!code || !label)
          continue
        this.appendDestroyButton(itemEl)
        // Add to tags.
        this.tags.push({code, display: label.textContent || label.innerText || label.nodeValue})
      }

      this.autocomplete_el.dataset.list = JSON.stringify(this.tags)
    } else {
      this.appendListContainer()    
    }

    itemOnRemove && (this.itemOnRemove = itemOnRemove)
  }

  hasClass = (ele, cls) => ele.getAttribute('class').indexOf(cls) > -1

  appendListContainer = () => {
    const resContainer = document.createElement('div')
    resContainer.setAttribute('class', 'autotags-list')
    const resList = document.createElement('ul')
    resContainer.appendChild(resList)
    this.appendDropdownButton(resList)
    this.autotags_result = resList

    this.autocomplete_el.parentNode.insertBefore(resContainer, this.autocomplete_el)
  }

  appendDestroyButton = itemEl => {
    const itemDestroy = document.createElement('button')
    itemDestroy.onclick = () => {
      const itemToRemove = this.tags.find(a => a.code === itemEl.dataset.id)
      if (!itemToRemove)
        return 
      itemEl.parentNode.removeChild(itemEl)
      const nextTags = this.tags.filter(a => a.code !== itemEl.dataset.id)
      this.tags = nextTags
      this.autocomplete_el.dataset.list = JSON.stringify(this.tags)
      this.itemOnRemove(itemToRemove)
    }
    const itemLbl = itemEl.firstElementChild
    itemLbl.parentNode.insertBefore(itemDestroy, itemLbl.nextSibling)
  }

  appendToList = item => {
    const itemEl = document.createElement('li')
    // Attach the key to the LI element.  This will be used during the remove node operation.
    itemEl.dataset.id = item.code 
    const itemLbl = document.createElement('label')
    itemLbl.appendChild(document.createTextNode(item.display))
    itemEl.appendChild(itemLbl)
    
    this.appendDestroyButton(itemEl)
    this.autotags_result.appendChild(itemEl)    
  }

  addTag = item => {
    const keys = this.tags.map(o => o.code)
    if (keys.indexOf(item.code) === -1) {
      this.tags.push(item)
      this.appendToList(item)
      this.autocomplete_el.dataset.list = JSON.stringify(this.tags)
      this.autocomplete_el.value = '';
    }

    this.userItemOnClick && this.userItemOnClick(item)
  }

  appendDropdownButton = resList => {
    const itemDropdown = document.createElement('button')
    itemDropdown.setAttribute('class', 'autotags-dd-btn')
    resList.parentNode.insertBefore(itemDropdown, resList.nextSibling)
  }

  itemOnRemove = () => {}
}

export default AutoTags
