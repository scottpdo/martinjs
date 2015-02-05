# Text

### .write(`obj`) or .write(`text`, `obj`)

Writes a string of text on one line. If only `obj` is given as a parameter, set `obj.text` equal to the text string. `obj` defaults to:

- `offsetX` : 0
- `offsetY` : 0
- `color` : black
- `size` : 16
- `align` : left

```
canvas.write('Hello World!', { color: '#fff' });
canvas.write({
    text: 'The sky is blue.',
    offsetX: 220,
    offsetY: 220,
    size: 20,
    color: '#fff'
});
```

<img id="martin-write" src="images/bunny.jpg" height="300" width="400">
