global.jsonp = require('jsonp')

new AutoComplete(
  {
    endpoint: 'https://www.reddit.com/search.json?restrict_sr=1&limit=5&jsonp=callback&q=',
    elemId:'autocomplete'
  }
)

const ac = document.getElementById('autocomplete')
ac.onchange = () => setTimeout(() => { document.getElementById('autocomplete-log').innerHTML = `reddit id: ${ac.dataset.id}` }, 200)

new AutoComplete(
  {
    endpoint: 'https://www.reddit.com/search.json?restrict_sr=1&limit=5&jsonp=callback&q=',
    elemId:'autocomplete2'
  }
)

const ac2 = document.getElementById('autocomplete2')
ac2.onchange = () => setTimeout(() => { document.getElementById('autocomplete2-log').innerHTML = `reddit id: ${ac2.dataset.id}` }, 200)

new AutoComplete(
  {
    endpoint: 'https://www.reddit.com/search.json?restrict_sr=1&limit=5&jsonp=callback&q='
  },
  document.querySelector("[name='A:B:C']")
)

const ac3 = document.querySelector("[name='A:B:C']")
ac3.onchange = () => setTimeout(() => { document.getElementById('autocomplete3-log').innerHTML = `reddit id: ${ac3.dataset.id}` }, 200)

