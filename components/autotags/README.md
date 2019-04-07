### Assumptions
If a DIV tag exists with a class that contains "autotags-list" as a previous sibling to an AutoTag input, the unordered list must be in the following format:

```html
<div class="autotags-list">
  <ul>
    <li data-id="FOO1">
      <label>Some Foo</label>  
    </li>
    <li data-id="FOO2">
      <label>Some Other Foo</label>  
    </li>
  </ul>
</div>
<input class="autocomplete autotags">
```

+ Each LI element must have an ```id``` data attribute.
+ Each text content must be wrapped inside of a LABEL element.

### Configuration

__itemOnRemove__