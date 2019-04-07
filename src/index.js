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

new AutoTags(
  {
    endpoint: 'https://www.reddit.com/search.json?restrict_sr=1&limit=5&jsonp=callback&q=',
    itemOnClick: item => console.log(item)
  },
  document.querySelector("[name='/D/E/F']")
)

const ac4 = document.querySelector("[name='/D/E/F']")
ac4.onchange = () => setTimeout(() => { document.getElementById('autotags-log').innerHTML = `reddit id: ${ac4.dataset.list}` }, 200)

new AutoTags(
  {
    endpoint: 'https://www.reddit.com/search.json?restrict_sr=1&limit=5&jsonp=callback&q=',
    itemOnClick: item => console.log(item),
    itemOnRemove: item => {
      console.log(item)

      const ac5 = document.querySelector("[name='/G/H/I']")
      setTimeout(() => { document.getElementById('autotags2-log').innerHTML = `reddit id: ${ac5.dataset.list}` }, 200)
    }
  },
  document.querySelector("[name='/G/H/I']")
)

const ac5 = document.querySelector("[name='/G/H/I']")
ac5.onchange = () => setTimeout(() => { document.getElementById('autotags2-log').innerHTML = `reddit id: ${ac5.dataset.list}` }, 200)
