import imageLoaded from '../utils/imageLoaded';
import stackBlurCanvas from '../utils/stackBlurCanvas';

export default function(radius, mul_sum, shg_sum) {
  
  return function(imageset, success = function(){}, error = function(){}) {

    var source = imageset.getPlaceholderElement();

    var process = function() {

      var width        = source.naturalWidth;
      var height       = source.naturalHeight;
      var scaledWidth  = imageset.getWrapper().offsetWidth;
      var scaledHeight = (scaledWidth / width * height + 0.5) | 0;
      var canvas       = document.createElement('canvas');
      var ctx          = canvas.getContext('2d');
      var alpha        = imageset.isAlpha();

      canvas.width  = scaledWidth;
      canvas.height = scaledHeight;

      if(!alpha && 'mozOpaque' in canvas) {
        canvas.mozOpaque = true;
      }
    
      ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
      stackBlurCanvas[alpha ? 'rgba' : 'rgb'](canvas, 0, 0, scaledWidth, scaledHeight, radius, mul_sum, shg_sum);

      success(canvas);
    };

    imageLoaded(source, process, error);
  
  };

}
