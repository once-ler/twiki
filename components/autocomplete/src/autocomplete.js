class AutoComplete {
  endpoint = ''
  
  elemId = ''
  
  autocomplete = null
  
  autocomplete_result = null
 
  constructor(props, elem) {
    const {elemId, endpoint, getItems, getItemKey, getItemValue, itemOnClick} = props
    this.elemId = elemId
    this.endpoint = endpoint
    
    this.autocomplete = elem || document.querySelector(`#${elemId}`)
    
    if (!this.autocomplete || this.autocomplete.nodeName.search(/input/i) === -1)
      throw new Error('Either the element argument is undefined or not an input node type.')
    
    if (!this.autocomplete.getAttribute("id")) {
      this.elemId = 'ac_' + ((new Date().getTime()) + Math.floor(Math.random() * 1000) + 1).toString(16)
      this.autocomplete.setAttribute("id", this.elemId)
    }
    
    this.autocomplete.setAttribute('onlclick', 'this.setSelectionRange(0, this.value.length)')
    this.autocomplete.addEventListener("keyup", this.updPopup);
    
    const resDiv = document.createElement("div")
    resDiv.setAttribute("id", `${this.elemId}_result`)
    resDiv.setAttribute("class", 'autocomplete_result')
    this.autocomplete_result = resDiv
    
    this.autocomplete.parentNode.insertBefore(this.autocomplete_result, this.autocomplete.nextSibling)
    
    this.processCallback = this.processCallback.bind(this)
    this.updPopup = this.updPopup.bind(this)

    getItems && (this.getItems = getItems)
    getItemKey && (this.getItemKey = getItemKey)
    getItemValue && (this.getItemValue = getItemValue)
    itemOnClick && (this.itemOnClick = itemOnClick)
  }
  
  updPopup = () =>  {
    if(!this.autocomplete.value || this.autocomplete.value.length < 2) {
      this.popupClearAndHide()
      return
    }
    var url_ = this.endpoint + this.autocomplete.value;
    jsonp(url_, {param : 'jsonp'}, this.processCallback)
  }

  popupClearAndHide = () => {
    this.autocomplete_result.innerHTML = ""
    this.autocomplete_result.style.display = "none"
  }

  processCallback = (err, res) => {
    const items = this.getItems(res)
    
    if (items.length === 0) {
      this.popupClearAndHide();
      return
    }

    const elemId = this.elemId      
    const itemOnClick = this.itemOnClick
    const b = document.createDocumentFragment();

    items.forEach(item => {          
      const d = document.createElement("p")
      const code = this.getItemKey(item)
      const display = this.getItemValue(item)
      d.dataset.id = code
      d.innerText = display
      d.onclick = () => {
        const autocomplete = document.querySelector(`#${elemId}`)
        const autocomplete_result = document.querySelector(`#${elemId}_result`)
        autocomplete.dataset.id = code
        autocomplete.value = display
        autocomplete_result.innerHTML=''
        autocomplete_result.style.display='none'
        itemOnClick({code, display})
      }
      b.appendChild(d);
    })

    this.autocomplete_result.innerHTML = ""
    this.autocomplete_result.style.display = "block"
    this.autocomplete_result.appendChild(b)    
  }

  getItems = res => res.data.children
  
  getItemKey = item => item.data.id

  getItemValue = item => item.data.title

  itemOnClick = item => {}
  
}

export default AutoComplete

