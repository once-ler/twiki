import AutoComplete from '../../autocomplete/src'

class AutoTags {
  tags = []

  autocomplete = null

  autocomplete_el = null

  autotags_result = null

  userItemOnClick = null

  elemId = ''

  dropdown_label = null

  dropdownContainer = null

  hideAutocomplete = false

  itemDropdown = null

  constructor(props, elem) {
    // Use case for hideAutocomplete
    // is when user wants AutoTags to act like a static dropdown with an existing list defined at "autotags-list".
    const { itemOnClick, itemOnRemove, hideAutocomplete } = props
    this.userItemOnClick = itemOnClick
    this.hideAutocomplete = hideAutocomplete

    const nextProps = { ...props, itemOnClick: this.addTag, hide: hideAutocomplete }

    this.autocomplete = new AutoComplete(nextProps, elem)

    this.elemId = this.autocomplete.elemId
    this.autocomplete_el = this.autocomplete.autocomplete

    this.updateExistingList()

    itemOnRemove && (this.itemOnRemove = itemOnRemove)

    this.dropdown_label && this.updateDropdownLabel()
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
    if (!this.hideAutocomplete)
      itemDestroy.classList.add('destroy')
    else
      itemDestroy.classList.add('choose')

    itemDestroy.onclick = () => {
      const itemToRemove = this.tags.find(a => a.code === itemEl.dataset.id)
      if (!itemToRemove)
        return 
      // Only remove row if hideAutocomplete is false.
      // Setting hideAutocomplete to true implicitly mean dropdown is a static list.
      if (!this.hideAutocomplete) {
        itemEl.parentNode.removeChild(itemEl)
        const nextTags = this.tags.filter(a => a.code !== itemEl.dataset.id)
        this.tags = nextTags
        this.autocomplete_el.dataset.list = JSON.stringify(this.tags)
        this.updateDropdownLabel()
      } else {
        // Close the dropdown.
        this.itemDropdown.click()
      }
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
    
    this.updateDropdownLabel()
    this.userItemOnClick && this.userItemOnClick(item)
  }

  appendDropdownButton = resList => {
    this.dropdownContainer = document.createElement('div')
    this.dropdownContainer.setAttribute('class', 'autotags-dd-container') 
    this.itemDropdown = document.createElement('button')
    this.itemDropdown.setAttribute('class', 'autotags-dd-btn down')
    this.itemDropdown.onclick = e => {
      e.preventDefault()
      this.itemDropdown.classList.toggle('down')
      this.itemDropdown.classList.toggle('up')
      this.autotags_result.classList.toggle('visible')
    }
    // resList.parentNode.insertBefore(itemDropdown, resList)
    this.dropdownContainer.appendChild(this.itemDropdown)
    resList.parentNode.insertBefore(this.dropdownContainer, resList)
    this.appendDropdownLabel(this.itemDropdown)
  }

  appendDropdownLabel = dropdownBtn => {
    this.dropdown_label = document.createElement('label')
    dropdownBtn.parentNode.insertBefore(this.dropdown_label, dropdownBtn)
  }

  updateDropdownLabel = () => {
    this.dropdown_label && (this.dropdown_label.innerText = `${this.tags.length} items`)
    this.tags.length > 0 && !this.dropdownContainer.classList.contains('visible') && this.dropdownContainer.classList.add('visible')
    this.tags.length === 0 && this.dropdownContainer.classList.contains('visible') && this.dropdownContainer.classList.remove('visible')
  }

  itemOnRemove = () => {}

  updateExistingList = () => {
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
  }

}

export default AutoTags
