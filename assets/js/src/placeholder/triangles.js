import fixCanvasResolution from '../utils/fixCanvasResolution';
import imageLoaded from '../utils/imageLoaded';

function renderTriangles(canvas, side, alpha) {
        
  alpha = !!alpha;

  // Canvas Properties
  var ctx             = canvas.getContext('2d'),
      imageData       = ctx.getImageData(0, 0, canvas.width, canvas.height),
      pixels          = imageData.data,
      imageDataWidth  = imageData.width,
      imageDataHeight = imageData.height,
      xMax            = imageDataWidth  - 1,
      yMax            = imageDataHeight - 1;
      
  // Triangle Properties
  var height         = Math.round(side * (Math.sqrt(3)/2)), // Triangle height ((side * Math.sqrt(3) / 2) + 0.5) | 0, // 
      halfHeight     = height / 2,
      halfSide       = side   / 2;   

  //Update canvas if needed (HiDPI/Retina screens)
  fixCanvasResolution(canvas, ctx);
  
  // Utility functions
  var drawTriangle  = function(x, y, stroke, directionRight) {
    directionRight = directionRight || false;
    var xBase = x + (directionRight ? 0 : height);
    ctx.beginPath();
    ctx.moveTo(xBase, y + 0);
    ctx.lineTo(x + (directionRight ? height : 0),  y + halfSide);
    ctx.lineTo(xBase, y + side);
    ctx.fill();
    ctx.closePath();
  };

  // Utility functions
  var pickColor = function(x, y) {
    var colorOffset = y * imageDataWidth * 4 + x * 4;
    return [
      // Our dear friend IE does not support `slice()` on typed arrays,
      // falling back to doing it the hard way 🙄
      pixels[colorOffset],
      pixels[colorOffset + 1],
      pixels[colorOffset + 2],
      pixels[colorOffset + 3],
    ];
  };

  var getAlpha = function(x, y) {
    return pixels[y * imageDataWidth * 4 + x * 4 + 3];
  };

  var getAverageAlphaFromPoints = function(points) {
    var alpha = 0, i = 0, len = points.length;
    for(; i < len; i++) alpha += getAlpha(points[i][0], points[i][1]);
    return alpha / len;
  };

  var rgb = function(color) {
    return "rgb(" + color.slice(0, 3).join(",") + ")";
  };
  
  var rgba = function(color) {
    color[3] /= 255;
    return "rgba(" + color.join(",") + ")";
  };
  
  var sanitizeX = function(x) {
    return Math.max(0, Math.min(Math.round(x), xMax));
    // return Math.max(0, Math.min((x + 0.5) | 0, xMax));
  };
  
  var sanitizeY = function(y) {
    return Math.max(0, Math.min(Math.round(y), yMax));
    // return Math.max(0, Math.min((y + 0.5) | 0, yMax));
  };

  var stepX, xSteps = Math.ceil(imageDataWidth  / height) + 1, // make sure, that canvas is
      stepY, ySteps = Math.ceil(imageDataHeight / side)   + 1, // completely filled.
      posX, posY, sanitizedPosX, sanitizedPosY,
      rectColor,
      rectColorPosY,
      trianglePosY,
      triangleBaseX,
      triangleTipX,
      triangleColor,
      triangleColorPosY,
      triangleColorPosX,
      sanitizedTriangleCenterX,
      sanitizedTriangleCenterY,
      trianglePointsRight,
      points,
      averageAlpha,
      i;

  if(alpha) {
    // Generate Alpha Mask
    for(stepY = 0; stepY < ySteps; stepY++) {
      posY               = stepY * side;
      rectColorPosY      = sanitizeY(posY + halfSide);
      trianglePosY       = posY - halfSide;
      triangleColorPosY  = sanitizeY(posY);   
      
      for(stepX = 0; stepX < xSteps; stepX++) {
        posX = stepX * height;
        trianglePointsRight = stepX % 2 !== 0;
        sanitizedPosX       = sanitizeX(posX);
        sanitizedPosY       = sanitizeY(posY);
        
        // Get average alpha for rect and draw it
        triangleTipX             = sanitizeX(trianglePointsRight ? posX + height - 1 : posX);
        triangleBaseX            = sanitizeX(trianglePointsRight ? posX : posX + height - 1);
        sanitizedTriangleCenterX = sanitizeX(posX + halfHeight);
        sanitizedTriangleCenterY = sanitizeY(posY + halfSide);

        // For calculating alpha transparency, we’re using
        // the average color of the area covered by
        // triangles and rects. Although it’s slower than
        // picking the color value of a single pixel,
        // results are way better.
        points = [
          [ triangleBaseX            , sanitizedPosY              ],
          [ triangleTipX             , sanitizedTriangleCenterY   ],
          [ triangleBaseX            , sanitizeY(posY + side - 1) ],
          [ sanitizedTriangleCenterX , sanitizedTriangleCenterY   ],
          [ sanitizedTriangleCenterX , sanitizedTriangleCenterY   ],
        ];

        averageAlpha  = (getAverageAlphaFromPoints(points) + 0.5) | 0;
        ctx.fillStyle = rgba([averageAlpha, 0, 0, 255]);
        ctx.fillRect(posX, posY, height, side);

        // Get average alpha for triangle and draw it
        points = [
          [ triangleBaseX            , sanitizeY(posY - halfSide)     ],
          [ triangleTipX             , sanitizedPosY                  ],
          [ triangleBaseX            , sanitizeY(posY + halfSide - 1) ],
          [ sanitizedTriangleCenterX , sanitizedPosY                  ],
          [ sanitizedTriangleCenterX , sanitizedPosY                  ],
        ];

        averageAlpha  = (getAverageAlphaFromPoints(points) + 0.5) | 0;
        ctx.fillStyle = rgba([averageAlpha, 0, 0, 255]);
        drawTriangle(posX, trianglePosY, false, trianglePointsRight);
      }
    }

    // Move red channel to alpha channel
    var alphaImageData  = ctx.getImageData(0, 0, canvas.width, canvas.height),
        alphaData       = alphaImageData.data,
        alphaDataLength = alphaData.length;

    for(i = 0; i < alphaDataLength; i += 4) {
      alphaData[i + 3] = alphaData[i];
    }

    ctx.putImageData(alphaImageData, 0, 0);

    // Causes new pixels to be drawn only where the
    // 
    ctx.globalCompositeOperation = "source-atop";
  }

  // Draw the final triangle mosaic
  for(stepY = 0; stepY < ySteps; stepY++) {
    posY               = stepY * side;
    rectColorPosY      = sanitizeY(posY + halfSide);
    trianglePosY       = posY - halfSide;
    triangleColorPosY  = sanitizeY(posY);   
    for(stepX = 0; stepX < xSteps; stepX++) {
      // It’s faster and produces better looking results,
      // i.e. eliminates artifacts at the edges of triangles
      // when drawing a rect first and then draw a
      // triangle that is shifted upwards by half of it’s
      // height.
      posX                = stepX * height;
      triangleColorPosX   = sanitizeX(posX + halfHeight);
      trianglePointsRight = (stepX % 2 !== 0);

      // For the final layer, only one color is picked
      // for the rect and the triangle. This is way faster
      // than the method used to calculate the alpha mask,
      // but results are sufficient for a decent quality
      // of the result.
      ctx.fillStyle = rgb(pickColor(triangleColorPosX, rectColorPosY));
      ctx.fillRect(posX, posY, height, side);
      
      ctx.fillStyle = rgb(pickColor(triangleColorPosX, triangleColorPosY));
      drawTriangle(posX, trianglePosY, false, trianglePointsRight);
    }
  }

  if(alpha) {
    // Reset composite operation, in case that other
    // scripts want to manipulate the canvas further.
    ctx.globalCompositeOperation = "source-over";
  }
}


export default function(imageset, success = function(){}, error = function(){}) {

  var source = imageset.getPlaceholderElement();

  var process = function() {
    var width        = source.naturalWidth,
        height       = source.naturalHeight,
        scaledWidth  = imageset.getWrapper().offsetWidth,
        scaledHeight = Math.round(scaledWidth / width * height), // (scaledWidth / width * height + 0.5) | 0, // faster Math.round() hack // same as: 
        canvas       = document.createElement("canvas"),
        ctx          = canvas.getContext("2d"),
        alpha        = imageset.isAlpha();

    canvas.width  = scaledWidth;
    canvas.height = scaledHeight;

    if(!alpha && 'mozOpaque' in canvas) {
      // alpha channel can be disabled in Firefox to
      // improve performance a bit.
      canvas.mozOpaque = true;
    }
    
    ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
    renderTriangles(canvas, 40, alpha);
    
    success(canvas);
  };

  imageLoaded(source, process, error);

};