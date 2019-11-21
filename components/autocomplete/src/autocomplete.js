class AutoComplete {
  endpoint = ''
  
  elemId = ''
  
  autocomplete = null
  
  autocomplete_result = null

  // Set to true to fetch immediately on click.  Only use case is when downloading entire list on every invocation.
  fetch_on_empty_value = false
 
  constructor(props, elem) {
    const {elemId, endpoint, getItems, getItemKey, getItemValue, itemOnClick, onError, hide, fetchOnEmptyValue} = props
    this.elemId = elemId
    this.endpoint = endpoint
    this.fetch_on_empty_value = fetchOnEmptyValue || false
    
    this.autocomplete = elem || document.querySelector(`#${elemId}`)
    
    if (!this.autocomplete || this.autocomplete.nodeName.search(/input/i) === -1)
      throw new Error('Either the element argument is undefined or not an input node type.')
    
    if (!this.autocomplete.getAttribute("id")) {
      this.elemId = 'ac_' + ((new Date().getTime()) + Math.floor(Math.random() * 1000) + 1).toString(16)
      this.autocomplete.setAttribute("id", this.elemId)
    } else {
      // When user does not pass the id of element, but an element with an id attribute.
      this.elemId = this.autocomplete.getAttribute("id");
    }
    
    this.autocomplete.addEventListener('keyup', this.updPopup)
    this.autocomplete.addEventListener('focus', this.updPopup)
    this.autocomplete.addEventListener('mousedown', this.updPopup)
    
    const resDiv = document.createElement("div")
    resDiv.setAttribute("id", `${this.elemId}_result`)
    resDiv.setAttribute("class", 'autocomplete_result')
    resDiv.style.display = 'none'
    this.autocomplete_result = resDiv
    
    this.autocomplete.parentNode.insertBefore(this.autocomplete_result, this.autocomplete.nextSibling)
    
    this.processCallback = this.processCallback.bind(this)
    this.updPopup = this.updPopup.bind(this)

    getItems && (this.getItems = getItems)
    getItemKey && (this.getItemKey = getItemKey)
    getItemValue && (this.getItemValue = getItemValue)
    itemOnClick && (this.itemOnClick = itemOnClick)

    onError && (this.onError = onError)

    if (hide)
      this.autocomplete.style.display = 'none'
  }
  
  updPopup = () =>  {
    // First clause checks whether content has already been downloaded.
    // If user mousedown on input that already has content, the expected behavior is user wants the dropdown to collapse.
    // Second clause is generic autocomplete behavior. 
    if((!this.fetch_on_empty_value || this.autocomplete_result.innerHTML.length > 0)
      && (!this.autocomplete.value || this.autocomplete.value.length < 2)) {
      this.popupClearAndHide()
      return
    }
    // We stuff 'po' for fetch_on_empty_value.
    const url_ = this.endpoint + (this.autocomplete.value || 'po')
    jsonp(url_, {param: 'jsonp'}, this.processCallback)
  }

  popupClearAndHide = () => {
    this.autocomplete_result.innerHTML = ''
    this.autocomplete_result.style.display = 'none'
  }

  updateValue = (code, display) => {
    this.autocomplete.dataset.id = code
    this.autocomplete.dataset.display = display
    this.autocomplete.value = display
    this.popupClearAndHide()
  }

  processCallback = (err, res) => {
    if (err) {
      this.popupClearAndHide()
      this.onError(`${err.message}\n`)
      return
    }

    const items = this.getItems(res)
    
    if (items.length === 0) {
      this.popupClearAndHide()
      return
    }

    const b = document.createDocumentFragment();

    items.forEach(item => {          
      const d = document.createElement('p')
      const code = this.getItemKey(item)
      const display = this.getItemValue(item)
      d.dataset.id = code
      d.innerText = display
      d.onclick = () => {
        this.updateValue(code, display)
        this.itemOnClick({code, display})
      }
      d.onclick = d.onclick.bind(this)      
      b.appendChild(d);
    })

    this.autocomplete_result.innerHTML = ''
    this.autocomplete_result.style.display = 'block'
    this.autocomplete_result.appendChild(b)    
  }

  getItems = res => res.data.children
  
  getItemKey = item => item.data.id

  getItemValue = item => item.data.title

  itemOnClick = item => {}
  
  onError = errorMessage => {}

  reset = () => this.updateValue('', '')
}

export default AutoComplete

