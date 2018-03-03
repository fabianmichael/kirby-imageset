export default function(canvas, ctx) {
  // Adjustments for HiDPI/Retina screens
  var devicePixelRatio  = window.devicePixelRatio || 1;
  var backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1; // Compatibility with (older?) Safari
  var pixelRatio        = devicePixelRatio / backingStoreRatio;

  if(devicePixelRatio !== backingStoreRatio) {
    var oldWidth        = canvas.width;
    var oldHeight       = canvas.height;
    canvas.width        = oldWidth  * pixelRatio;
    canvas.height       = oldHeight * pixelRatio;
    //canvas.style.width  = oldWidth  + 'px';
    //canvas.style.height = oldHeight + 'px';
    ctx.scale(pixelRatio, pixelRatio);
  }

  return pixelRatio;
}