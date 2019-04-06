### Assumptions
Response is json format and should either be an array object or contain a field that has an array object.

```
{
  "data": [{}, {}]
}

[
  {}, {}
]
```

### Configuration

__elemId__
The id to an defined input element.
If an input element is provided in the second argument to the constructor, the elemId property is ignored.

__endpoint__
The url for the fetch operation.

__getItems__
Provide a function to obtain the array.
```
// This is an example for reddit.
(res) => res.data.children
```

__getItemKey__
Provide a function to obtain the key for each item.
```
// This is the key for a reddit subreddit.
(item) => item.data.id
```

__getItemValue__
Provide a function to obtain the value for each item.
```
// This is the value for a reddit subreddit.
(item) => item.data.title
```

__itemOnClick__
Provide a function to receive the item that was clicked.
