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

//=require includes/stackblur.js
;(function(window, document) {
  'use strict';

  var _getElementsByClassName = 'getElementsByClassName';

  if(!document[_getElementsByClassName]){ return; }  

  /* =====  Configuration  ================================================== */

  var prefix = 'imageset';

  var __wrapperClass                    = prefix,
      __wrapperLazyloadClass            = prefix + '--lazyload',
      __wrapperLoadedClass              = prefix + '--loaded',
      __wrapperPlaceholderClass         = prefix + '--placeholder',
      __wrapperPlaceholderStyleClass    = prefix + '--placeholder--',
      __wrapperAlphaClass               = prefix + '--alpha',
      __wrapperPlaceholderRenderedClass = prefix + '--placeholder--rendered',
      __imageElementClass               = prefix + '__element',
      __placeholderElementClass         = prefix + '__placeholder',
      __imagesetHasJSClass              = prefix + '-js';

      // __blurredPlaceholderRadius     = 15,
      // __lqipPlaceholderRadius        = 7;

  /* =====  Variable Shortcuts  ============================================= */

  var docElement               = document.documentElement;

  var ua                       = navigator.userAgent;

  var requestAnimationFrame    = window.requestAnimationFrame || setTimeout;

  var Date                     = window.Date;

  var _addEventListener        = 'addEventListener',
      _getAttribute            = 'getAttribute',
      _removeAttribute         = 'removeAttribute',
      _MutationObserver        = 'MutationObserver',
      _classList               = 'classList',
      _className               = 'className',
      _hasAttribute            = 'hasAttribute',

      _dataSrc                 = 'data-src',
      _dataSrcset              = 'data-srcset'; 

  /* =====  Utilities & Helper Functions  =================================== */
  
  /* -----  Feature Tests  -------------------------------------------------- */

  var isOperaMini                 = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]");
      
  var isSafari                    = (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1);

  var supportsMutationObserver    = !!window[_MutationObserver];

  var supportsCanvas              = !!window.CanvasRenderingContext2D;

  var supportsPixelatedImages     = ('imageRendering' in docElement.style || 'msInterpolationMode' in docElement.style);

  // Shim layer with setTimeout fallback. Look only for unprefixed
  // requestAnimationFrame, because all modern browsern already removed the
  // prefix.
  var rAF = window.requestAnimationFrame || function(callback) { setTimeout(callback, 1000/60); };

  // var supportsObjectFit,
  //     supportsObjectPosition;

  // (function() {
  //   var test = function(props, style) {
  //     for(var i = 0, l = props.length; i < l; i++) {
  //       var prop = props[i];
  //       if(prop in style) return true;
  //     }
  //     return false;
  //   };

  //   var style = window.getComputedStyle(document.createElement('img'), null);
    
  //   supportsObjectFit      = test(['-o-object-fit', 'object-fit'], style);
  //   supportsObjectPosition = supportsObjectFit ? test(['-o-object-position', 'object-position'], style) : false; 
  // })();

  /* -----  Utilities  ------------------------------------------------------ */

  var ready = function(fn) {
    if(document.readyState != 'loading') {
      fn();
    } else {
      document[_addEventListener]('DOMContentLoaded', fn);
    }
  };

  // Extend an object with another one
  var extend = function(base, obj) {
    for(var i in obj) {
      if(obj.hasOwnProperty(i)) {
        base[i] = obj[i];
      }
    }
    return base;
  };

  var imageLoaded = function(img, fn) {
    if(!img.complete || (typeof img.naturalWidth === "undefined") || img.naturalWidth === 0) {
      img[_addEventListener]("load", fn);
    } else {
      fn();
    }
  };

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

  var AnimationQueue = (function() {

    var queue       = [],
        _inProgress = false;

    function add(callback) {
      queue.push(callback);
      run();
    }

    function loop() {
      var callback = queue.shift();
      callback();

      if(!queue.length) {
        _inProgress = false;
      } else {
        rAF(loop);
      }
    }

    function run() {
      if(_inProgress) return;
      _inProgress = true;
      rAF(loop);
    }

    return {
      add: add,
    };
  })();

  // Class utilities using `classList` API if available.
  // Fallbacks inspired by: https://gist.github.com/devongovett/1381839
  var hasClass = (function() {
    return document.documentElement[_classList] ?
      function(el, cls) { return el[_classList].contains(cls); } :
      function(el, cls) { return !!~el[_className].split(/\s+/).indexOf(cls); };
  })();

  var addClass = (function() {
    return document.documentElement[_classList] ?
      function(el, cls) { el[_classList].add(cls); } :
      function(el, cls) {
        var classes = el[_className].split(/\s+/);
        if(!~classes.indexOf(cls)) {
          classes.push(cls);
          el[_className] = classes.join(" ");
        }
      };
  })();

  var removeClass = (function() {
    return document.documentElement[_classList] ?
      function(el, cls) { return el[_classList].remove(cls); } :
      function(el, cls) {
        var tokens = el[_className].split(/\s+/),
            index  = tokens.indexOf(cls);
        if(!!~index) {
          tokens.splice(index, 1);
          el[_className] = tokens.join(" ");
        }
      };
  })();


  /* =====  ImageSets & Placeholders  ======================================= */

  var placeholderRenderStack = [];

  function render() {

  }

  /* ----- Special Initialization for Opera Mini  --------------------------- */

  // Make sure to add JS class to document element, if
  // it has not been done by any other script.
  addClass(document.documentElement, __imagesetHasJSClass);

  if(isOperaMini) {
    // Opera Mini has limited DOM Event support and does not
    // work with lazysizes. So we shortcut the loading process
    // of lazy-loading and disable lazysizes.
    window.lazySizesConfig      = window.lazySizesConfig || {};
    window.lazySizesConfig.init = false;

    var loadImageSet = function(el) {
        
      var sources = el.getElementsByTagName("source"),
          img     = el[_getElementsByClassName](__imageElementClass)[0];
    
      // Wrapper should be loaded to trigger css hook like
      // on other browsers.
      addClass(el, __wrapperLoadedClass);

      if(window.HTMLPictureElement) {
        // As of December 2016, Opera Mini does not support
        // the picture element. However, we consider this
        // here for possible implementations in the future.
        for(var i = 0, l = sources.length; i < l; i++) {
          var s = sources[i];
          if(s[_hasAttribute](_dataSrcset)) {
            s.srcset = s[_getAttribute](_dataSrcset);
            s[_removeAttribute](_dataSrcset);
          }
          if(s[_hasAttribute](_dataSrc)) {
            s.src = s[_getAttribute](_dataSrc);
            s[_removeAttribute](_dataSrc);
          }
        }

        if(img[_hasAttribute](_dataSrcset)) {
          img.srcset = img[_getAttribute](_dataSrcset);
          img[_removeAttribute](_dataSrcset);
        }
        if(img[_hasAttribute](_dataSrc)) {
          img.src = img[_getAttribute](_dataSrc);
          img[_removeAttribute](_dataSrc);
        }

      } else {
        
        var fallbackSource = sources.length > 0 ? sources[sources.length - 1] : img,
            candidates     = fallbackSource[_getAttribute](_dataSrcset).split(/,\s+/);

        for(var n = sources.length; n--;) {
          // Delete sources elements 
          sources[n].parentNode.removeChild(sources[n]);
        }

        img.src = candidates.pop().replace(/\s+\d+[wx]$/, '');
      }
    };

    ready(function() {
      var imagesets = document[_getElementsByClassName](__wrapperClass);
      for(var i = 0, l = imagesets.length; i < l; i++) {
        loadImageSet(imagesets[i]);
      }
    });


    return; // Abort Initialization here
  }

  /* ===== Regular Initialization  ========================================== */

  /* ----- Global Variables Setup  ------------------------------------------ */
 
  /* ·····  ImageSet-specific Helper functions  ······························*/

  var placeholderRegexp = new RegExp(__wrapperPlaceholderStyleClass + '([a-z0-9_-]+)\\s*', 'i');

  function getPlaceholderStyle(wrapper) {
    var result = wrapper[_className].match(placeholderRegexp);
    return result ? result[1] : false;
  }

  var placeholderRenderer = {};


  if(!supportsPixelatedImages || isSafari) {

    var pixelRatio = (function() {
      // To account for zoom, change to use deviceXDPI instead of systemXDPI
      if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined &&
          window.screen.systemXDPI > window.screen.logicalXDPI) {
        // Only allow for values > 1
        return window.screen.systemXDPI / window.screen.logicalXDPI;
      } else if (window.devicePixelRatio !== undefined) {
        return window.devicePixelRatio;
      }
      return 1;
    })();

    placeholderRenderer.mosaic = function(el) {

      var canvas      = document.createElement("canvas"),
          ctx         = canvas.getContext("2d"),
          source      = el[_getElementsByClassName](__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = Math.round(el.offsetWidth * pixelRatio),
            scaledHeight = Math.round(el.offsetWidth / width * height * pixelRatio);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;

        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        
        canvas.setAttribute("aria-hidden", true);
        canvas[_className] = source[_className];
        
        AnimationQueue.add(function(){
          ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
          source.parentNode.replaceChild(canvas, source);
        });
      };

      imageLoaded(source, process);
    };
  }

  if(supportsCanvas) {

    var applyPlaceholderBlur = function(el, radius, mul_sum, shg_sum) {

      var source = el[_getElementsByClassName](__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = el.offsetWidth,
            scaledHeight = Math.round(el.offsetWidth / width * height),
            
            canvas       = document.createElement("canvas"),
            ctx          = canvas.getContext("2d"),
            alpha        = hasClass(el, __wrapperAlphaClass);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;
        
        canvas.setAttribute("aria-hidden", true);
        canvas[_className] = source[_className];
        
        AnimationQueue.add(function(){
          ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
          stackBlur[alpha ? 'canvasRGBA' : 'canvasRGB'](canvas, 0, 0, scaledWidth, scaledHeight, radius, mul_sum, shg_sum);
          source.parentNode.replaceChild(canvas, source);
        });
      };

      imageLoaded(source, function() { process(); });
    };

    placeholderRenderer.blurred = function(el) { applyPlaceholderBlur(el, 15, 512, 17); };
    placeholderRenderer.lqip    = function(el) { applyPlaceholderBlur(el,  7, 512, 15); };
  }


  var imageset = (function() {
    
    var imagesetElements;
    
    function checkImagesets() {
      var style, wrapper;

      for(var i = 0, l = imagesetElements.length; i < l; i++) {
        if(!imagesetElements[i]) continue;

        wrapper = imagesetElements[i];

        if(hasClass(wrapper, __wrapperPlaceholderRenderedClass)) continue;

        style = getPlaceholderStyle(wrapper);
        
        if(style && placeholderRenderer[style]) {
          addClass(wrapper, __wrapperPlaceholderRenderedClass);
          placeholderRenderer[style](wrapper);
        }
      }
    }

    var debouncedCheckImagesets = debounce(checkImagesets);

    function init() {

      document[_addEventListener]('lazybeforeunveil', function (e) {

        var element = e.target,
            wrapper = element.parentNode;

        if(!hasClass(element, __imageElementClass)) return;

        while(!hasClass(wrapper, __wrapperClass)) {
          // Get imageset container element by traversing up the DOM tree
          wrapper = wrapper.parentNode;
        }

        // Define a callback function which gets invoked, after an image has
        // finally loaded.
        var cb = function () {
          element.removeEventListener("load", cb);
          rAF(function () {
            // Asynchronously add loaded class
            addClass(wrapper, __wrapperLoadedClass);
          });
        };

        element[_addEventListener]("load", cb);
      });

      imagesetElements = document[_getElementsByClassName](__wrapperPlaceholderClass);

      if(supportsMutationObserver){
        new window[_MutationObserver]( debouncedCheckImagesets ).observe( docElement, {childList: true, subtree: true, attributes: false, characterData: false } );
      } else {
        docElement[_addEventListener]('DOMNodeInserted', debouncedCheckImagesets, true);
        docElement[_addEventListener]('DOMAttrModified', debouncedCheckImagesets, true);
        setInterval(debouncedCheckImagesets, 999);
      }

      window[_addEventListener]('hashchange', debouncedCheckImagesets, true);

      debouncedCheckImagesets();
    }


    return {
      init: init,
    };

  })();

  ready(imageset.init);

})(window, document);

//=require includes/lazysizes.js
//=require includes/ls.static-gecko-picture.js
//=require includes/ls.print.js
