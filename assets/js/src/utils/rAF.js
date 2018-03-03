// Shim layer with setTimeout fallback. Look only for unprefixed
// requestAnimationFrame, because all modern browsern already removed the
// prefix.
var rAF = window.requestAnimationFrame || function(fn) { setTimeout(fn, 1000 / 60); };

export default rAF;