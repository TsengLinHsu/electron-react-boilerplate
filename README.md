Core Concepts

```javascript
{
  printers: [{
    printer: bonjour,
    isNetwork: true
  }, {
    printer: bonjour,
    isNetwork: true
  }],
  visibilityFilter: 'SHOW_NETWORK'
}
```

```javascript
{ type: 'ADD_PRINTER', printer: bonjour, isNetwork: true }
{ type: 'SELECT_PRINTER', index: 1 }
{ type: 'UNSELECT_PRINTER'}
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```
