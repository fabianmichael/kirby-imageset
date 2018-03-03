import fixCanvasResolution from '../utils/fixCanvasResolution';
import imageLoaded from '../utils/imageLoaded';

const isSafari                = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1);
const supportsPixelatedImages = ('imageRendering' in document.documentElement.style || 'msInterpolationMode' in document.documentElement.style);

export default function(imageset, success = function(){}, error = function(){}) {

  var source = imageset.getPlaceholderElement();
  var process;

  if(supportsPixelatedImages && !isSafari) {
    process = function() {
      // don’t render anything if pixelated images are
      // supported by browser, just tell success after
      // placeholder has successfully loaded.
      success();
    };
  } else {

    process = function() {

      var canvas      = document.createElement('canvas');
      var ctx         = canvas.getContext('2d');

      fixCanvasResolution(canvas, ctx);

      var width        = source.naturalWidth;
      var height       = source.naturalHeight;
      var scaledWidth  = imageset.getWrapper().offsetWidth;
      var scaledHeight = (scaledWidth / width * height + 0.5) | 0;

      canvas.width  = scaledWidth;
      canvas.height = scaledHeight;

      var props = [
        'imageSmoothingEnabled',
        'mozImageSmoothingEnabled',
        'webkitImageSmoothingEnabled',
        'msImageSmoothingEnabled'
      ];

      for(let i = 0, l = props.length, prop; i < l; i++) {
        prop = props[i];
        
        if(prop in ctx) {
          ctx[prop] = false;
          break;
        }
      }
    
      ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
      
      success(canvas);
    };
  }

  imageLoaded(source, process, error);
}