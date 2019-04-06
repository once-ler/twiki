class AutoComplete {
  endpoint = ''
  
  elemId = ''
  
  autocomplete = null
  
  autocomplete_result = null
 
  constructor(props, elem) {
    const {elemId, endpoint} = props
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
    if (res.data.children.length === 0) {
      this.popupClearAndHide();
      return
    }

    const elemId = this.elemId      
    const b = document.createDocumentFragment();

    res.data.children.forEach(function(item) {          
      const d = document.createElement("p")
      d.innerText = item.data.title
      d.dataset.id = item.data.id
      d.setAttribute("onclick", 
        `var autocomplete = document.querySelector('#${elemId}'); 
        var autocomplete_result = document.querySelector('#${elemId}_result');
        autocomplete.value=this.innerText;
        autocomplete.dataset.id = this.dataset.id;
        autocomplete_result.innerHTML='';
        autocomplete_result.style.display='none';`);
      b.appendChild(d);
    })

    this.autocomplete_result.innerHTML = ""
    this.autocomplete_result.style.display = "block"
    this.autocomplete_result.appendChild(b)    
  } 
  
}

export default AutoComplete

