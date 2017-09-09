/*!
 * ImageSet (1.0.0-beta1)
 *
 * This script file is needed for lazyloading imagesets,
 * generated with ImageSet for Kirby and rendering placeholder
 * effeccts
 *
 * Copyright (c) 2016 Fabian Michael <hallo@fabianmichael.de>
 * @license SEE LICENSE IN license.md
 *
 * This script also includes:
 *
 *   StackBlur 0.6
 *   Copyright (c) 2010 Mario Klingemann <mario@quasimondo.com>
 *   https://github.com/Quasimondo/QuasimondoJS
 *
 *   lazysizes 2.0.7 (with "static-gecko-picture" plugin)
 *   Copyright (C) 2015 Alexander Farkas, released under MIT license
 *   https://github.com/aFarkas/lazysizes
 * 
 */

//=include includes/stackblur.js

;(function(window, document, Math, Date, undefined) {
  'use strict';

  if(!document.getElementsByClassName){ return; }  

  /* =====  Configuration  ================================================== */

  var prefix = 'imageset';

  var __wrapperClass                    = 'imageset',
      __wrapperLazyloadClass            = __wrapperClass + '  -lazyload',
      __wrapperLoadedClass              = 'is-loaded',
      __wrapperErrorClass               = 'has-error',
      __wrapperPlaceholderClass         = __wrapperClass + ' -placeholder',
      __wrapperPlaceholderStyleClass    = '-placeholder:',
      __wrapperAlphaClass               = '-alpha',
      __wrapperPlaceholderRenderedClass = 'is-placeholder-rendered',
      __wrapperPlaceholderErrorClass    = 'has-placeholder-error',
      __imageElementClass               = __wrapperClass + '-element',
      __placeholderElementClass         = __wrapperClass + '-placeholder',
      __errorOverlayClass               = 'imageset-error',
      __operaMiniClass                  = 'operamini';

  /* =====  Variable Shortcuts  ============================================= */

  var docElement               = document.documentElement;

  var ua                       = navigator.userAgent;

  /* =====  Utilities & Helper Functions  =================================== */
  
  /* -----  Polyfills  ------------------------------------------------------ */
      
  // Shim layer with setTimeout fallback. Look only for unprefixed
  // requestAnimationFrame, because all modern browsern already removed the
  // prefix.
  var rAF = window.requestAnimationFrame || function(fn) { setTimeout(fn, 1000/60); };

  /* -----  Utilities  ------------------------------------------------------ */

  function ready(fn) {
    if(document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // Extend an object with another one
  function extend(base, obj) {
    for(var i in obj) {
      if(obj.hasOwnProperty(i)) {
        base[i] = obj[i];
      }
    }
    return base;
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function imageLoaded(img, success, failure) {
    failure = failure || false;

    if(!img.complete || (typeof img.naturalWidth === "undefined") || img.naturalWidth === 0) {

      var successCallback = function () {
        this.removeEventListener('load', successCallback);
        success();
      };

      img.addEventListener('load', successCallback);

      if(!!failure) {
        var testImg = new Image();
        testImg.addEventListener('error', function() {
          failure();
        });
        testImg.src = img.src;
      }
    } else {
      success();
    }
  }

  var RenderQueue = (function() {
    var queue       = [],
        inProgress  = false;

    function add(callback) {
      queue.push(callback);
      run();
    }

    function loop() {
      var callback = queue.shift();
      callback();

      if(!queue.length) {
        inProgress = false;
      } else {
        rAF(loop);
      }
    }

    function run() {
      if(inProgress) return;
      inProgress = true;
      rAF(loop);
    }

    return {
      add: add,
    };
  })();

  // Class utilities using `classList` API if available.
  // Fallbacks inspired by: https://gist.github.com/devongovett/1381839
  var hasClass = (function() {
    return docElement.classList ?
      function(el, cls) { return el.classList.contains(cls); } :
      function(el, cls) { return !!~el.className.split(/\s+/).indexOf(cls); };
  })();

  var addClass = (function() {
    return docElement.classList ?
      function(el, cls) { el.classList.add(cls); } :
      function(el, cls) {
        var classes = el.className.split(/\s+/);
        if(!~classes.indexOf(cls)) {
          classes.push(cls);
          el.className = classes.join(" ");
        }
      };
  })();

  var removeClass = (function() {
    return docElement.classList ?
      function(el, cls) { return el.classList.remove(cls); } :
      function(el, cls) {
        var tokens = el.className.split(/\s+/),
            index  = tokens.indexOf(cls);
        if(!!~index) {
          tokens.splice(index, 1);
          el.className = tokens.join(" ");
        }
      };
  })();

  function fixCanvasResolution(canvas, ctx) {
    // Adjustments for HiDPI/Retina screens
    var devicePixelRatio  = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1, // Compatibility with (older?) Safari
        pixelRatio        = devicePixelRatio / backingStoreRatio;

    if(devicePixelRatio !== backingStoreRatio) {
      var oldWidth        = canvas.width,
          oldHeight       = canvas.height;
      canvas.width        = oldWidth  * pixelRatio;
      canvas.height       = oldHeight * pixelRatio;
      //canvas.style.width  = oldWidth  + 'px';
      //canvas.style.height = oldHeight + 'px';
      ctx.scale(pixelRatio, pixelRatio);
    }

    return pixelRatio;
  }


  /* =====  ImageSets & Placeholders  ======================================= */

  /* -----  Special Initialization for Opera Mini  -------------------------- */

  var isOperaMini = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]");

  if(isOperaMini) {
    // Opera Mini has limited DOM Event support and does not
    // work with lazysizes. So we shortcut the loading process
    // of lazy-loading and disable lazysizes.
    window.lazySizesConfig      = window.lazySizesConfig || {};
    window.lazySizesConfig.init = false;

    addClass(docElement, __operaMiniClass);

    var loadImageSetForOperaMini = function(wrapper) {
        
      var sources = wrapper.getElementsByTagName("source"),
          img     = wrapper.getElementsByClassName(__imageElementClass)[0];
    
      // Wrapper should be loaded to trigger css hook like
      // on other browsers.
      addClass(wrapper, __wrapperLoadedClass);

      if(window.HTMLPictureElement) {
        // As of December 2016, Opera Mini does not support
        // the picture element. However, we consider this
        // here for possible implementations in the future.
        for(var i = 0, l = sources.length; i < l; i++) {
          var s = sources[i];
          if(s.hasAttribute('data-srcset')) s.srcset = s.getAttribute('data-srcset');
          if(s.hasAttribute('data-src'))    s.src    = s.getAttribute('data-src');
        }

        if(img.hasAttribute('data-srcset')) img.srcset = img.getAttribute('data-srcset');
        if(img.hasAttribute('data-src'))    img.src    = img.getAttribute('data-src');

      } else {
        
        var fallbackSource = sources.length > 0 ? sources[sources.length - 1] : img,
            candidates     = fallbackSource.getAttribute('data-srcset').split(/,\s+/);

        while(sources.length > 0) {
          // Delete sources elements 
          sources[0].parentNode.removeChild(sources[0]);
        }

        img.src = candidates.pop().replace(/\s+\d+[wx]$/, '');
      }
    };

    ready(function() {
      var imagesets = document.getElementsByClassName(__wrapperClass);
      for(var i = 0, l = imagesets.length; i < l; i++) {
        loadImageSetForOperaMini(imagesets[i]);
      }
    });


    return; // Abort Initialization here
  }

  /* ===== Regular Initialization  ========================================== */

  /* ----- Global Variables Setup  ------------------------------------------ */
 
  /* ·····  ImageSet-specific Helper functions  ····························· */

  var placeholderRegexp = new RegExp(__wrapperPlaceholderStyleClass + '([a-z0-9_-]+)\\s*', 'i');

  function getPlaceholderStyle(wrapper) {
    var result = wrapper.className.match(placeholderRegexp);
    return result ? result[1] : false;
  }

  function handlePlaceholderError(wrapper) {
    addClass(wrapper, __wrapperPlaceholderErrorClass);
  }



  /* -----  Placeholder Render Functions  ----------------------------------- */
  
  var placeholderRenderer = {};

  if(!!window.CanvasRenderingContext2D) {
    // only register placeholder rendering functions, if
    // canvas is supported by the browser.

    /* ···  Mosaic  ························································· */

    var isSafari                    = (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1);
    var supportsPixelatedImages     = ('imageRendering' in docElement.style || 'msInterpolationMode' in docElement.style);

    if(!supportsPixelatedImages || isSafari) {

      placeholderRenderer.mosaic = function(wrapper) {

        var canvas      = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            source      = wrapper.getElementsByClassName(__placeholderElementClass)[0];

        var process = function() {

          fixCanvasResolution(canvas, ctx);

          var width        = source.naturalWidth,
              height       = source.naturalHeight,
              scaledWidth  = wrapper.offsetWidth,
              scaledHeight = (wrapper.offsetWidth / width * height + 0.5) | 0;

          canvas.width  = scaledWidth;
          canvas.height = scaledHeight;

          ctx.mozImageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.msImageSmoothingEnabled = false;
          ctx.imageSmoothingEnabled = false;
          
          canvas.setAttribute("aria-hidden", true);
          canvas.className = source.className;
          
          ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
          source.parentNode.replaceChild(canvas, source);
          addClass(wrapper, __wrapperPlaceholderRenderedClass);
        };

        return function() {
          imageLoaded(source, process, function() { handlePlaceholderError(wrapper); });
        };
      };
    }

    /* ···  Blurred & LQIP  ················································· */

    var applyPlaceholderBlur = function(wrapper, radius, mul_sum, shg_sum) {

      var source = wrapper.getElementsByClassName(__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = wrapper.offsetWidth,
            scaledHeight = (wrapper.offsetWidth / width * height + 0.5) | 0,
            
            canvas       = document.createElement("canvas"),
            ctx          = canvas.getContext("2d"),
            alpha        = hasClass(el, __wrapperAlphaClass);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;

        if(!alpha && 'mozOpaque' in canvas) {
          canvas.mozOpaque = true;
        }
        
        canvas.setAttribute("aria-hidden", true);
        canvas.className = source.className;
        
        ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
        stackBlur[alpha ? 'canvasRGBA' : 'canvasRGB'](canvas, 0, 0, scaledWidth, scaledHeight, radius, mul_sum, shg_sum);
        source.parentNode.replaceChild(canvas, source);
        addClass(wrapper, __wrapperPlaceholderRenderedClass);
      };

      return function() {
        imageLoaded(source, process, function() { handlePlaceholderError(wrapper); });
      };

    };

    placeholderRenderer.blurred = function(el) {
      return applyPlaceholderBlur(el, 15, 512, 17);
    };
    
    placeholderRenderer.lqip = function(el) {
      return applyPlaceholderBlur(el, 7, 512, 15);
    };

    /* ···  Triangles  ······················································ */

    var triangleMosaicFilter = function(canvas, side, alpha) {
        
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
          // triangle that if shifted upwards by half of it’s
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
    };

    placeholderRenderer.triangles = function(wrapper) {

      var source   = wrapper.getElementsByClassName(__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = wrapper.offsetWidth,
            scaledHeight = Math.round(wrapper.offsetWidth / width * height), // (scaledWidth / width * height + 0.5) | 0, // faster Math.round() hack // same as: 
            canvas       = document.createElement("canvas"),
            ctx          = canvas.getContext("2d"),
            alpha        = hasClass(wrapper, __wrapperAlphaClass);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;

        if(!alpha && 'mozOpaque' in canvas) {
          canvas.mozOpaque = true;
        }
        
        canvas.setAttribute("aria-hidden", true);
        canvas.className = source.className;
        
        
        ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
        triangleMosaicFilter(canvas, 40, alpha);
        source.parentNode.replaceChild(canvas, source);
        addClass(wrapper, __wrapperPlaceholderRenderedClass);
        console.log('placeholder rendered');
      };

      return function() {
        imageLoaded(source, process, function() { handlePlaceholderError(wrapper); });
      };
    };

  }

  /* =====  ImageSet  ======================================================= */

  function ImageSet() {

    // ---  settings

    var settings = window.imagesetConfig = extend({
      
      autoUpdate: true,
      placeholderRendering: 'async',

    }, window.imagesetConfig || {});
    
    var imagesetElements = document.getElementsByClassName(__wrapperPlaceholderClass);

    var _paused = false;

    var queue = [];

    // ---  private methods
    
    function checkImagesets() {
      var style, wrapper, renderer;

      for(var i = 0, l = imagesetElements.length; i < l; i++) {
        if(!imagesetElements[i]) continue;

        wrapper = imagesetElements[i];

        if(hasClass(wrapper, __wrapperPlaceholderRenderedClass)) continue;

        style = getPlaceholderStyle(wrapper);
        
        if(style && placeholderRenderer[style]) {
          // Render placeholder, if a renderer for given
          // imageset exists.

          renderer = placeholderRenderer[style](wrapper);

          if(settings.placeholderRendering === 'async') {
            RenderQueue.add(renderer);
          } else {
            renderer();
          }
        }
      }

    }

    var debouncedCheckImagesets = debounce(checkImagesets);

    // ---  initialization

    // ···  transition

    document.addEventListener('lazybeforeunveil', function (e) {

      var element = e.target,
          wrapper = element.parentNode;

      if(!hasClass(element, __imageElementClass)) return;

      while(!hasClass(wrapper, __wrapperClass)) {
        // Get imageset container element by traversing up the DOM tree
        wrapper = wrapper.parentNode;
      }

      // Define a callback function which gets invoked, after an image has
      // finally loaded.
      var success = function () {
        element.removeEventListener("load", success);
        rAF(function () {
          // Asynchronously add loaded class
          addClass(wrapper, __wrapperLoadedClass);
        });
      };

      var error = function () {
        element.removeEventListener("error", error);
        rAF(function () {

          var errorOverlay = document.createElement('span');
          addClass(errorOverlay, __errorOverlayClass);

          if(element.hasAttribute('alt') && element.alt !== '') {

            errorOverlay.setAttribute('aria-hidden', true);
            errorOverlay.appendChild(document.createTextNode(element.alt));
          }

          wrapper.appendChild(errorOverlay);

          // Asynchronously add loaded class
          rAF(function() {
            addClass(wrapper, __wrapperErrorClass);
          });

        });
      };

      
      element.addEventListener("load", success);
      element.addEventListener("error", error);
    });

    // ··· auto-update

    if(settings.autoUpdate) {
      if(!!window.MutationObserver) {
        // Use MutationObserver to check for new elements,
        // if supported.
        new window.MutationObserver( debouncedCheckImagesets ).observe( docElement, {childList: true, subtree: true, attributes: false, characterData: false } );
      } else {
        // Otherwise, fallback to Mutation Events and add
        // a setInterval for as a safety fallback.
        docElement.addEventListener('DOMNodeInserted', debouncedCheckImagesets, true);
        docElement.addEventListener('DOMAttrModified', debouncedCheckImagesets, true);
        setInterval(debouncedCheckImagesets, 999);
      }

      window.addEventListener('hashchange', debouncedCheckImagesets, true);
      
      debouncedCheckImagesets();
    } else {
      // If autoUpdate is disabled, check imagesets just once.
      ready(checkImagesets);
    }

    return {
      update: checkImagesets,
    };

  }

  var imageset = new ImageSet();

  window.imageset = imageset;

})(window, document, Math, Date);

//=require includes/ls.static-gecko-picture.js
//=require includes/ls.print.js
//=require includes/lazysizes.js
