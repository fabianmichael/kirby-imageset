/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/plugins/imageset/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lazysizes_plugins_print_ls_print_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lazysizes_plugins_print_ls_print_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lazysizes_plugins_print_ls_print_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lazysizes__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lazysizes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lazysizes__);
/*!
 * ImageSet (1.1.0-beta1)
 *
 * This script file is needed for lazyloading imagesets,
 * generated with ImageSet for Kirby and rendering placeholder
 * effeccts
 *
 * Copyright (c) 2016-2018 Fabian Michael <hallo@fabianmichael.de>
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

;(function (window, document, Math, Date, undefined) {
  'use strict';

  if (!document.getElementsByClassName) {
    return;
  }

  /* =====  Configuration  ================================================== */

  var prefix = 'imageset';

  var __wrapperClass = 'imageset',
      __wrapperLazyloadClass = __wrapperClass + '  -lazyload',
      __wrapperLoadedClass = 'is-loaded',
      __wrapperErrorClass = 'has-error',
      __wrapperPlaceholderClass = __wrapperClass + ' -placeholder',
      __wrapperPlaceholderStyleClass = '-placeholder:',
      __wrapperAlphaClass = '-alpha',
      __wrapperPlaceholderRenderedClass = 'is-placeholder-rendered',
      __wrapperPlaceholderErrorClass = 'has-placeholder-error',
      __imageElementClass = __wrapperClass + '-element',
      __placeholderElementClass = __wrapperClass + '-placeholder',
      __errorOverlayClass = 'imageset-error',
      __operaMiniClass = 'operamini';

  /* =====  Variable Shortcuts  ============================================= */

  var docElement = document.documentElement;

  var ua = navigator.userAgent;

  /* =====  Utilities & Helper Functions  =================================== */

  /* -----  Polyfills  ------------------------------------------------------ */

  // Shim layer with setTimeout fallback. Look only for unprefixed
  // requestAnimationFrame, because all modern browsern already removed the
  // prefix.
  var rAF = window.requestAnimationFrame || function (fn) {
    setTimeout(fn, 1000 / 60);
  };

  /* -----  Utilities  ------------------------------------------------------ */

  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // Extend an object with another one
  function extend(base, obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        base[i] = obj[i];
      }
    }
    return base;
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this,
          args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function imageLoaded(img, success, failure) {
    failure = failure || false;

    if (!img.complete || typeof img.naturalWidth === "undefined" || img.naturalWidth === 0) {

      var successCallback = function () {
        this.removeEventListener('load', successCallback);
        success();
      };

      img.addEventListener('load', successCallback);

      if (!!failure) {
        var testImg = new Image();
        testImg.addEventListener('error', function () {
          failure();
        });
        testImg.src = img.src;
      }
    } else {
      success();
    }
  }

  var RenderQueue = function () {
    var queue = [],
        inProgress = false;

    function add(callback) {
      queue.push(callback);
      run();
    }

    function loop() {
      var callback = queue.shift();
      callback();

      if (!queue.length) {
        inProgress = false;
      } else {
        rAF(loop);
      }
    }

    function run() {
      if (inProgress) return;
      inProgress = true;
      rAF(loop);
    }

    return {
      add: add
    };
  }();

  // Class utilities using `classList` API if available.
  // Fallbacks inspired by: https://gist.github.com/devongovett/1381839
  var hasClass = function () {
    return docElement.classList ? function (el, cls) {
      return el.classList.contains(cls);
    } : function (el, cls) {
      return !!~el.className.split(/\s+/).indexOf(cls);
    };
  }();

  var addClass = function () {
    return docElement.classList ? function (el, cls) {
      el.classList.add(cls);
    } : function (el, cls) {
      var classes = el.className.split(/\s+/);
      if (!~classes.indexOf(cls)) {
        classes.push(cls);
        el.className = classes.join(" ");
      }
    };
  }();

  var removeClass = function () {
    return docElement.classList ? function (el, cls) {
      return el.classList.remove(cls);
    } : function (el, cls) {
      var tokens = el.className.split(/\s+/),
          index = tokens.indexOf(cls);
      if (!!~index) {
        tokens.splice(index, 1);
        el.className = tokens.join(" ");
      }
    };
  }();

  function fixCanvasResolution(canvas, ctx) {
    // Adjustments for HiDPI/Retina screens
    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1,
        // Compatibility with (older?) Safari
    pixelRatio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
      var oldWidth = canvas.width,
          oldHeight = canvas.height;
      canvas.width = oldWidth * pixelRatio;
      canvas.height = oldHeight * pixelRatio;
      //canvas.style.width  = oldWidth  + 'px';
      //canvas.style.height = oldHeight + 'px';
      ctx.scale(pixelRatio, pixelRatio);
    }

    return pixelRatio;
  }

  /* =====  ImageSets & Placeholders  ======================================= */

  /* -----  Special Initialization for Opera Mini  -------------------------- */

  var isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]";

  if (isOperaMini) {
    // Opera Mini has limited DOM Event support and does not
    // work with lazysizes. So we shortcut the loading process
    // of lazy-loading and disable lazysizes.
    window.lazySizesConfig = window.lazySizesConfig || {};
    window.lazySizesConfig.init = false;

    addClass(docElement, __operaMiniClass);

    var loadImageSetForOperaMini = function (wrapper) {

      var sources = wrapper.getElementsByTagName("source"),
          img = wrapper.getElementsByClassName(__imageElementClass)[0];

      // Wrapper should be loaded to trigger css hook like
      // on other browsers.
      addClass(wrapper, __wrapperLoadedClass);

      if (window.HTMLPictureElement) {
        // As of December 2016, Opera Mini does not support
        // the picture element. However, we consider this
        // here for possible implementations in the future.
        for (var i = 0, l = sources.length; i < l; i++) {
          var s = sources[i];
          if (s.hasAttribute('data-srcset')) s.srcset = s.getAttribute('data-srcset');
          if (s.hasAttribute('data-src')) s.src = s.getAttribute('data-src');
        }

        if (img.hasAttribute('data-srcset')) img.srcset = img.getAttribute('data-srcset');
        if (img.hasAttribute('data-src')) img.src = img.getAttribute('data-src');
      } else {

        var fallbackSource = sources.length > 0 ? sources[sources.length - 1] : img,
            candidates = fallbackSource.getAttribute('data-srcset').split(/,\s+/);

        while (sources.length > 0) {
          // Delete sources elements 
          sources[0].parentNode.removeChild(sources[0]);
        }

        img.src = candidates.pop().replace(/\s+\d+[wx]$/, '');
      }
    };

    ready(function () {
      var imagesets = document.getElementsByClassName(__wrapperClass);
      for (var i = 0, l = imagesets.length; i < l; i++) {
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

  if (!!window.CanvasRenderingContext2D) {
    // only register placeholder rendering functions, if
    // canvas is supported by the browser.

    /* ···  Mosaic  ························································· */

    var isSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
    var supportsPixelatedImages = 'imageRendering' in docElement.style || 'msInterpolationMode' in docElement.style;

    if (!supportsPixelatedImages || isSafari) {

      placeholderRenderer.mosaic = function (wrapper) {

        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            source = wrapper.getElementsByClassName(__placeholderElementClass)[0];

        var process = function () {

          fixCanvasResolution(canvas, ctx);

          var width = source.naturalWidth,
              height = source.naturalHeight,
              scaledWidth = wrapper.offsetWidth,
              scaledHeight = wrapper.offsetWidth / width * height + 0.5 | 0;

          canvas.width = scaledWidth;
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

        return function () {
          imageLoaded(source, process, function () {
            handlePlaceholderError(wrapper);
          });
        };
      };
    }

    /* ···  Blurred & LQIP  ················································· */

    var applyPlaceholderBlur = function (wrapper, radius, mul_sum, shg_sum) {

      var source = wrapper.getElementsByClassName(__placeholderElementClass)[0];

      var process = function () {
        var width = source.naturalWidth,
            height = source.naturalHeight,
            scaledWidth = wrapper.offsetWidth,
            scaledHeight = wrapper.offsetWidth / width * height + 0.5 | 0,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            alpha = hasClass(el, __wrapperAlphaClass);

        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        if (!alpha && 'mozOpaque' in canvas) {
          canvas.mozOpaque = true;
        }

        canvas.setAttribute("aria-hidden", true);
        canvas.className = source.className;

        ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
        stackBlur[alpha ? 'canvasRGBA' : 'canvasRGB'](canvas, 0, 0, scaledWidth, scaledHeight, radius, mul_sum, shg_sum);
        source.parentNode.replaceChild(canvas, source);
        addClass(wrapper, __wrapperPlaceholderRenderedClass);
      };

      return function () {
        imageLoaded(source, process, function () {
          handlePlaceholderError(wrapper);
        });
      };
    };

    placeholderRenderer.blurred = function (el) {
      return applyPlaceholderBlur(el, 15, 512, 17);
    };

    placeholderRenderer.lqip = function (el) {
      return applyPlaceholderBlur(el, 7, 512, 15);
    };

    /* ···  Triangles  ······················································ */

    var triangleMosaicFilter = function (canvas, side, alpha) {

      alpha = !!alpha;

      // Canvas Properties
      var ctx = canvas.getContext('2d'),
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
          pixels = imageData.data,
          imageDataWidth = imageData.width,
          imageDataHeight = imageData.height,
          xMax = imageDataWidth - 1,
          yMax = imageDataHeight - 1;

      // Triangle Properties
      var height = Math.round(side * (Math.sqrt(3) / 2)),
          // Triangle height ((side * Math.sqrt(3) / 2) + 0.5) | 0, // 
      halfHeight = height / 2,
          halfSide = side / 2;

      //Update canvas if needed (HiDPI/Retina screens)
      fixCanvasResolution(canvas, ctx);

      // Utility functions
      var drawTriangle = function (x, y, stroke, directionRight) {
        directionRight = directionRight || false;
        var xBase = x + (directionRight ? 0 : height);
        ctx.beginPath();
        ctx.moveTo(xBase, y + 0);
        ctx.lineTo(x + (directionRight ? height : 0), y + halfSide);
        ctx.lineTo(xBase, y + side);
        ctx.fill();
        ctx.closePath();
      };

      // Utility functions
      var pickColor = function (x, y) {
        var colorOffset = y * imageDataWidth * 4 + x * 4;
        return [
        // Our dear friend IE does not support `slice()` on typed arrays,
        // falling back to doing it the hard way 🙄
        pixels[colorOffset], pixels[colorOffset + 1], pixels[colorOffset + 2], pixels[colorOffset + 3]];
      };

      var getAlpha = function (x, y) {
        return pixels[y * imageDataWidth * 4 + x * 4 + 3];
      };

      var getAverageAlphaFromPoints = function (points) {
        var alpha = 0,
            i = 0,
            len = points.length;
        for (; i < len; i++) alpha += getAlpha(points[i][0], points[i][1]);
        return alpha / len;
      };

      var rgb = function (color) {
        return "rgb(" + color.slice(0, 3).join(",") + ")";
      };

      var rgba = function (color) {
        color[3] /= 255;
        return "rgba(" + color.join(",") + ")";
      };

      var sanitizeX = function (x) {
        return Math.max(0, Math.min(Math.round(x), xMax));
        // return Math.max(0, Math.min((x + 0.5) | 0, xMax));
      };

      var sanitizeY = function (y) {
        return Math.max(0, Math.min(Math.round(y), yMax));
        // return Math.max(0, Math.min((y + 0.5) | 0, yMax));
      };

      var stepX,
          xSteps = Math.ceil(imageDataWidth / height) + 1,
          // make sure, that canvas is
      stepY,
          ySteps = Math.ceil(imageDataHeight / side) + 1,
          // completely filled.
      posX,
          posY,
          sanitizedPosX,
          sanitizedPosY,
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

      if (alpha) {
        // Generate Alpha Mask
        for (stepY = 0; stepY < ySteps; stepY++) {
          posY = stepY * side;
          rectColorPosY = sanitizeY(posY + halfSide);
          trianglePosY = posY - halfSide;
          triangleColorPosY = sanitizeY(posY);

          for (stepX = 0; stepX < xSteps; stepX++) {
            posX = stepX * height;
            trianglePointsRight = stepX % 2 !== 0;
            sanitizedPosX = sanitizeX(posX);
            sanitizedPosY = sanitizeY(posY);

            // Get average alpha for rect and draw it
            triangleTipX = sanitizeX(trianglePointsRight ? posX + height - 1 : posX);
            triangleBaseX = sanitizeX(trianglePointsRight ? posX : posX + height - 1);
            sanitizedTriangleCenterX = sanitizeX(posX + halfHeight);
            sanitizedTriangleCenterY = sanitizeY(posY + halfSide);

            // For calculating alpha transparency, we’re using
            // the average color of the area covered by
            // triangles and rects. Although it’s slower than
            // picking the color value of a single pixel,
            // results are way better.
            points = [[triangleBaseX, sanitizedPosY], [triangleTipX, sanitizedTriangleCenterY], [triangleBaseX, sanitizeY(posY + side - 1)], [sanitizedTriangleCenterX, sanitizedTriangleCenterY], [sanitizedTriangleCenterX, sanitizedTriangleCenterY]];

            averageAlpha = getAverageAlphaFromPoints(points) + 0.5 | 0;
            ctx.fillStyle = rgba([averageAlpha, 0, 0, 255]);
            ctx.fillRect(posX, posY, height, side);

            // Get average alpha for triangle and draw it
            points = [[triangleBaseX, sanitizeY(posY - halfSide)], [triangleTipX, sanitizedPosY], [triangleBaseX, sanitizeY(posY + halfSide - 1)], [sanitizedTriangleCenterX, sanitizedPosY], [sanitizedTriangleCenterX, sanitizedPosY]];

            averageAlpha = getAverageAlphaFromPoints(points) + 0.5 | 0;
            ctx.fillStyle = rgba([averageAlpha, 0, 0, 255]);
            drawTriangle(posX, trianglePosY, false, trianglePointsRight);
          }
        }

        // Move red channel to alpha channel
        var alphaImageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
            alphaData = alphaImageData.data,
            alphaDataLength = alphaData.length;

        for (i = 0; i < alphaDataLength; i += 4) {
          alphaData[i + 3] = alphaData[i];
        }

        ctx.putImageData(alphaImageData, 0, 0);

        // Causes new pixels to be drawn only where the
        // 
        ctx.globalCompositeOperation = "source-atop";
      }

      // Draw the final triangle mosaic
      for (stepY = 0; stepY < ySteps; stepY++) {
        posY = stepY * side;
        rectColorPosY = sanitizeY(posY + halfSide);
        trianglePosY = posY - halfSide;
        triangleColorPosY = sanitizeY(posY);
        for (stepX = 0; stepX < xSteps; stepX++) {
          // It’s faster and produces better looking results,
          // i.e. eliminates artifacts at the edges of triangles
          // when drawing a rect first and then draw a
          // triangle that if shifted upwards by half of it’s
          // height.
          posX = stepX * height;
          triangleColorPosX = sanitizeX(posX + halfHeight);
          trianglePointsRight = stepX % 2 !== 0;

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

      if (alpha) {
        // Reset composite operation, in case that other
        // scripts want to manipulate the canvas further.
        ctx.globalCompositeOperation = "source-over";
      }
    };

    placeholderRenderer.triangles = function (wrapper) {

      var source = wrapper.getElementsByClassName(__placeholderElementClass)[0];

      var process = function () {
        var width = source.naturalWidth,
            height = source.naturalHeight,
            scaledWidth = wrapper.offsetWidth,
            scaledHeight = Math.round(wrapper.offsetWidth / width * height),
            // (scaledWidth / width * height + 0.5) | 0, // faster Math.round() hack // same as: 
        canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            alpha = hasClass(wrapper, __wrapperAlphaClass);

        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        if (!alpha && 'mozOpaque' in canvas) {
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

      return function () {
        imageLoaded(source, process, function () {
          handlePlaceholderError(wrapper);
        });
      };
    };
  }

  /* =====  ImageSet  ======================================================= */

  function ImageSet() {

    // ---  settings

    var settings = window.imagesetConfig = extend({

      autoUpdate: true,
      placeholderRendering: 'async'

    }, window.imagesetConfig || {});

    var imagesetElements = document.getElementsByClassName(__wrapperPlaceholderClass);

    var _paused = false;

    var queue = [];

    // ---  private methods

    function checkImagesets() {
      var style, wrapper, renderer;

      for (var i = 0, l = imagesetElements.length; i < l; i++) {
        if (!imagesetElements[i]) continue;

        wrapper = imagesetElements[i];

        if (hasClass(wrapper, __wrapperPlaceholderRenderedClass)) continue;

        style = getPlaceholderStyle(wrapper);

        if (style && placeholderRenderer[style]) {
          // Render placeholder, if a renderer for given
          // imageset exists.

          renderer = placeholderRenderer[style](wrapper);

          if (settings.placeholderRendering === 'async') {
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

      if (!hasClass(element, __imageElementClass)) return;

      while (!hasClass(wrapper, __wrapperClass)) {
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

          if (element.hasAttribute('alt') && element.alt !== '') {

            errorOverlay.setAttribute('aria-hidden', true);
            errorOverlay.appendChild(document.createTextNode(element.alt));
          }

          wrapper.appendChild(errorOverlay);

          // Asynchronously add loaded class
          rAF(function () {
            addClass(wrapper, __wrapperErrorClass);
          });
        });
      };

      element.addEventListener("load", success);
      element.addEventListener("error", error);
    });

    // ··· auto-update

    if (settings.autoUpdate) {
      if (!!window.MutationObserver) {
        // Use MutationObserver to check for new elements,
        // if supported.
        new window.MutationObserver(debouncedCheckImagesets).observe(docElement, { childList: true, subtree: true, attributes: false, characterData: false });
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
      update: checkImagesets
    };
  }

  var imageset = new ImageSet();

  window.imageset = imageset;
})(window, document, Math, Date);




//=require includes/ls.print.js
//=require includes/lazysizes.js

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

(function(window, factory) {
	var lazySizes = factory(window, window.document);
	window.lazySizes = lazySizes;
	if(typeof module == 'object' && module.exports){
		module.exports = lazySizes;
	}
}(window, function l(window, document) {
	'use strict';
	/*jshint eqnull:true */
	if(!document.getElementsByClassName){return;}

	var lazysizes, lazySizesConfig;

	var docElem = document.documentElement;

	var Date = window.Date;

	var supportPicture = window.HTMLPictureElement;

	var _addEventListener = 'addEventListener';

	var _getAttribute = 'getAttribute';

	var addEventListener = window[_addEventListener];

	var setTimeout = window.setTimeout;

	var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

	var requestIdleCallback = window.requestIdleCallback;

	var regPicture = /^picture$/i;

	var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

	var regClassCache = {};

	var forEach = Array.prototype.forEach;

	var hasClass = function(ele, cls) {
		if(!regClassCache[cls]){
			regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		}
		return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
	};

	var addClass = function(ele, cls) {
		if (!hasClass(ele, cls)){
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
		}
	};

	var removeClass = function(ele, cls) {
		var reg;
		if ((reg = hasClass(ele,cls))) {
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
		}
	};

	var addRemoveLoadEvents = function(dom, fn, add){
		var action = add ? _addEventListener : 'removeEventListener';
		if(add){
			addRemoveLoadEvents(dom, fn);
		}
		loadEvents.forEach(function(evt){
			dom[action](evt, fn);
		});
	};

	var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
		var event = document.createEvent('CustomEvent');

		if(!detail){
			detail = {};
		}

		detail.instance = lazysizes;

		event.initCustomEvent(name, !noBubbles, !noCancelable, detail);

		elem.dispatchEvent(event);
		return event;
	};

	var updatePolyfill = function (el, full){
		var polyfill;
		if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
			polyfill({reevaluate: true, elements: [el]});
		} else if(full && full.src){
			el.src = full.src;
		}
	};

	var getCSS = function (elem, style){
		return (getComputedStyle(elem, null) || {})[style];
	};

	var getWidth = function(elem, parent, width){
		width = width || elem.offsetWidth;

		while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
			width =  parent.offsetWidth;
			parent = parent.parentNode;
		}

		return width;
	};

	var rAF = (function(){
		var running, waiting;
		var firstFns = [];
		var secondFns = [];
		var fns = firstFns;

		var run = function(){
			var runFns = fns;

			fns = firstFns.length ? secondFns : firstFns;

			running = true;
			waiting = false;

			while(runFns.length){
				runFns.shift()();
			}

			running = false;
		};

		var rafBatch = function(fn, queue){
			if(running && !queue){
				fn.apply(this, arguments);
			} else {
				fns.push(fn);

				if(!waiting){
					waiting = true;
					(document.hidden ? setTimeout : requestAnimationFrame)(run);
				}
			}
		};

		rafBatch._lsFlush = run;

		return rafBatch;
	})();

	var rAFIt = function(fn, simple){
		return simple ?
			function() {
				rAF(fn);
			} :
			function(){
				var that = this;
				var args = arguments;
				rAF(function(){
					fn.apply(that, args);
				});
			}
		;
	};

	var throttle = function(fn){
		var running;
		var lastTime = 0;
		var gDelay = 125;
		var rICTimeout = lazySizesConfig.ricTimeout;
		var run = function(){
			running = false;
			lastTime = Date.now();
			fn();
		};
		var idleCallback = requestIdleCallback && lazySizesConfig.ricTimeout ?
			function(){
				requestIdleCallback(run, {timeout: rICTimeout});

				if(rICTimeout !== lazySizesConfig.ricTimeout){
					rICTimeout = lazySizesConfig.ricTimeout;
				}
			} :
			rAFIt(function(){
				setTimeout(run);
			}, true)
		;

		return function(isPriority){
			var delay;

			if((isPriority = isPriority === true)){
				rICTimeout = 33;
			}

			if(running){
				return;
			}

			running =  true;

			delay = gDelay - (Date.now() - lastTime);

			if(delay < 0){
				delay = 0;
			}

			if(isPriority || (delay < 9 && requestIdleCallback)){
				idleCallback();
			} else {
				setTimeout(idleCallback, delay);
			}
		};
	};

	//based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
	var debounce = function(func) {
		var timeout, timestamp;
		var wait = 99;
		var run = function(){
			timeout = null;
			func();
		};
		var later = function() {
			var last = Date.now() - timestamp;

			if (last < wait) {
				setTimeout(later, wait - last);
			} else {
				(requestIdleCallback || run)(run);
			}
		};

		return function() {
			timestamp = Date.now();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};

	(function(){
		var prop;

		var lazySizesDefaults = {
			lazyClass: 'lazyload',
			loadedClass: 'lazyloaded',
			loadingClass: 'lazyloading',
			preloadClass: 'lazypreload',
			errorClass: 'lazyerror',
			//strictClass: 'lazystrict',
			autosizesClass: 'lazyautosizes',
			srcAttr: 'data-src',
			srcsetAttr: 'data-srcset',
			sizesAttr: 'data-sizes',
			//preloadAfterLoad: false,
			minSize: 40,
			customMedia: {},
			init: true,
			expFactor: 1.5,
			hFac: 0.8,
			loadMode: 2,
			loadHidden: true,
			ricTimeout: 300,
		};

		lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

		for(prop in lazySizesDefaults){
			if(!(prop in lazySizesConfig)){
				lazySizesConfig[prop] = lazySizesDefaults[prop];
			}
		}

		window.lazySizesConfig = lazySizesConfig;

		setTimeout(function(){
			if(lazySizesConfig.init){
				init();
			}
		});
	})();

	var loader = (function(){
		var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

		var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

		var defaultExpand, preloadExpand, hFac;

		var regImg = /^img$/i;
		var regIframe = /^iframe$/i;

		var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));

		var shrinkExpand = 0;
		var currentExpand = 0;

		var isLoading = 0;
		var lowRuns = -1;

		var resetPreloading = function(e){
			isLoading--;
			if(e && e.target){
				addRemoveLoadEvents(e.target, resetPreloading);
			}

			if(!e || isLoading < 0 || !e.target){
				isLoading = 0;
			}
		};

		var isNestedVisible = function(elem, elemExpand){
			var outerRect;
			var parent = elem;
			var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

			eLtop -= elemExpand;
			eLbottom += elemExpand;
			eLleft -= elemExpand;
			eLright += elemExpand;

			while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
				visible = ((getCSS(parent, 'opacity') || 1) > 0);

				if(visible && getCSS(parent, 'overflow') != 'visible'){
					outerRect = parent.getBoundingClientRect();
					visible = eLright > outerRect.left &&
						eLleft < outerRect.right &&
						eLbottom > outerRect.top - 1 &&
						eLtop < outerRect.bottom + 1
					;
				}
			}

			return visible;
		};

		var checkElements = function() {
			var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

			var lazyloadElems = lazysizes.elements;

			if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

				i = 0;

				lowRuns++;

				if(preloadExpand == null){
					if(!('expand' in lazySizesConfig)){
						lazySizesConfig.expand = docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370;
					}

					defaultExpand = lazySizesConfig.expand;
					preloadExpand = defaultExpand * lazySizesConfig.expFactor;
				}

				if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden){
					currentExpand = preloadExpand;
					lowRuns = 0;
				} else if(loadMode > 1 && lowRuns > 1 && isLoading < 6){
					currentExpand = defaultExpand;
				} else {
					currentExpand = shrinkExpand;
				}

				for(; i < eLlen; i++){

					if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

					if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}

					if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
						elemExpand = currentExpand;
					}

					if(beforeExpandVal !== elemExpand){
						eLvW = innerWidth + (elemExpand * hFac);
						elvH = innerHeight + elemExpand;
						elemNegativeExpand = elemExpand * -1;
						beforeExpandVal = elemExpand;
					}

					rect = lazyloadElems[i].getBoundingClientRect();

					if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
						(eLtop = rect.top) <= elvH &&
						(eLright = rect.right) >= elemNegativeExpand * hFac &&
						(eLleft = rect.left) <= eLvW &&
						(eLbottom || eLright || eLleft || eLtop) &&
						(lazySizesConfig.loadHidden || getCSS(lazyloadElems[i], 'visibility') != 'hidden') &&
						((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
						unveilElement(lazyloadElems[i]);
						loadedSomething = true;
						if(isLoading > 9){break;}
					} else if(!loadedSomething && isCompleted && !autoLoadElem &&
						isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
						(preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
						(preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))){
						autoLoadElem = preloadElems[0] || lazyloadElems[i];
					}
				}

				if(autoLoadElem && !loadedSomething){
					unveilElement(autoLoadElem);
				}
			}
		};

		var throttledCheckElements = throttle(checkElements);

		var switchLoadingClass = function(e){
			addClass(e.target, lazySizesConfig.loadedClass);
			removeClass(e.target, lazySizesConfig.loadingClass);
			addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
			triggerEvent(e.target, 'lazyloaded');
		};
		var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
		var rafSwitchLoadingClass = function(e){
			rafedSwitchLoadingClass({target: e.target});
		};

		var changeIframeSrc = function(elem, src){
			try {
				elem.contentWindow.location.replace(src);
			} catch(e){
				elem.src = src;
			}
		};

		var handleSources = function(source){
			var customMedia;

			var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

			if( (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
				source.setAttribute('media', customMedia);
			}

			if(sourceSrcset){
				source.setAttribute('srcset', sourceSrcset);
			}
		};

		var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg){
			var src, srcset, parent, isPicture, event, firesLoad;

			if(!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented){

				if(sizes){
					if(isAuto){
						addClass(elem, lazySizesConfig.autosizesClass);
					} else {
						elem.setAttribute('sizes', sizes);
					}
				}

				srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
				src = elem[_getAttribute](lazySizesConfig.srcAttr);

				if(isImg) {
					parent = elem.parentNode;
					isPicture = parent && regPicture.test(parent.nodeName || '');
				}

				firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

				event = {target: elem};

				if(firesLoad){
					addRemoveLoadEvents(elem, resetPreloading, true);
					clearTimeout(resetPreloadingTimer);
					resetPreloadingTimer = setTimeout(resetPreloading, 2500);

					addClass(elem, lazySizesConfig.loadingClass);
					addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
				}

				if(isPicture){
					forEach.call(parent.getElementsByTagName('source'), handleSources);
				}

				if(srcset){
					elem.setAttribute('srcset', srcset);
				} else if(src && !isPicture){
					if(regIframe.test(elem.nodeName)){
						changeIframeSrc(elem, src);
					} else {
						elem.src = src;
					}
				}

				if(isImg && (srcset || isPicture)){
					updatePolyfill(elem, {src: src});
				}
			}

			if(elem._lazyRace){
				delete elem._lazyRace;
			}
			removeClass(elem, lazySizesConfig.lazyClass);

			rAF(function(){
				if( !firesLoad || (elem.complete && elem.naturalWidth > 1)){
					if(firesLoad){
						resetPreloading(event);
					} else {
						isLoading--;
					}
					switchLoadingClass(event);
				}
			}, true);
		});

		var unveilElement = function (elem){
			var detail;

			var isImg = regImg.test(elem.nodeName);

			//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
			var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
			var isAuto = sizes == 'auto';

			if( (isAuto || !isCompleted) && isImg && (elem[_getAttribute]('src') || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass) && hasClass(elem, lazySizesConfig.lazyClass)){return;}

			detail = triggerEvent(elem, 'lazyunveilread').detail;

			if(isAuto){
				 autoSizer.updateElem(elem, true, elem.offsetWidth);
			}

			elem._lazyRace = true;
			isLoading++;

			lazyUnveil(elem, detail, isAuto, sizes, isImg);
		};

		var onload = function(){
			if(isCompleted){return;}
			if(Date.now() - started < 999){
				setTimeout(onload, 999);
				return;
			}
			var afterScroll = debounce(function(){
				lazySizesConfig.loadMode = 3;
				throttledCheckElements();
			});

			isCompleted = true;

			lazySizesConfig.loadMode = 3;

			throttledCheckElements();

			addEventListener('scroll', function(){
				if(lazySizesConfig.loadMode == 3){
					lazySizesConfig.loadMode = 2;
				}
				afterScroll();
			}, true);
		};

		return {
			_: function(){
				started = Date.now();

				lazysizes.elements = document.getElementsByClassName(lazySizesConfig.lazyClass);
				preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
				hFac = lazySizesConfig.hFac;

				addEventListener('scroll', throttledCheckElements, true);

				addEventListener('resize', throttledCheckElements, true);

				if(window.MutationObserver){
					new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
				} else {
					docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
					docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
					setInterval(throttledCheckElements, 999);
				}

				addEventListener('hashchange', throttledCheckElements, true);

				//, 'fullscreenchange'
				['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
					document[_addEventListener](name, throttledCheckElements, true);
				});

				if((/d$|^c/.test(document.readyState))){
					onload();
				} else {
					addEventListener('load', onload);
					document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
					setTimeout(onload, 20000);
				}

				if(lazysizes.elements.length){
					checkElements();
					rAF._lsFlush();
				} else {
					throttledCheckElements();
				}
			},
			checkElems: throttledCheckElements,
			unveil: unveilElement
		};
	})();


	var autoSizer = (function(){
		var autosizesElems;

		var sizeElement = rAFIt(function(elem, parent, event, width){
			var sources, i, len;
			elem._lazysizesWidth = width;
			width += 'px';

			elem.setAttribute('sizes', width);

			if(regPicture.test(parent.nodeName || '')){
				sources = parent.getElementsByTagName('source');
				for(i = 0, len = sources.length; i < len; i++){
					sources[i].setAttribute('sizes', width);
				}
			}

			if(!event.detail.dataAttr){
				updatePolyfill(elem, event.detail);
			}
		});
		var getSizeElement = function (elem, dataAttr, width){
			var event;
			var parent = elem.parentNode;

			if(parent){
				width = getWidth(elem, parent, width);
				event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

				if(!event.defaultPrevented){
					width = event.detail.width;

					if(width && width !== elem._lazysizesWidth){
						sizeElement(elem, parent, event, width);
					}
				}
			}
		};

		var updateElementsSizes = function(){
			var i;
			var len = autosizesElems.length;
			if(len){
				i = 0;

				for(; i < len; i++){
					getSizeElement(autosizesElems[i]);
				}
			}
		};

		var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

		return {
			_: function(){
				autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
				addEventListener('resize', debouncedUpdateElementsSizes);
			},
			checkElems: debouncedUpdateElementsSizes,
			updateElem: getSizeElement
		};
	})();

	var init = function(){
		if(!init.i){
			init.i = true;
			autoSizer._();
			loader._();
		}
	};

	lazysizes = {
		cfg: lazySizesConfig,
		autoSizer: autoSizer,
		loader: loader,
		init: init,
		uP: updatePolyfill,
		aC: addClass,
		rC: removeClass,
		hC: hasClass,
		fire: triggerEvent,
		gW: getWidth,
		rAF: rAF,
	};

	return lazysizes;
}
));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
This lazySizes extension adds better support for print.
In case the user starts to print lazysizes will load all images.
*/
(function(window, factory) {
	var globalInstall = function(){
		factory(window.lazySizes);
		window.removeEventListener('lazyunveilread', globalInstall, true);
	};

	factory = factory.bind(null, window, window.document);

	if(typeof module == 'object' && module.exports){
		factory(__webpack_require__(5));
	} else if(window.lazySizes) {
		globalInstall();
	} else {
		window.addEventListener('lazyunveilread', globalInstall, true);
	}
}(window, function(window, document, lazySizes) {
	/*jshint eqnull:true */
	'use strict';
	var config, elements, onprint, printMedia;
	// see also: http://tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/
	if(window.addEventListener){
		config = (lazySizes && lazySizes.cfg) || window.lazySizesConfig || {};
		elements = config.lazyClass || 'lazyload';
		onprint = function(){
			var i, len;
			if(typeof elements == 'string'){
				elements = document.getElementsByClassName(elements);
			}

			if(lazySizes){
				for(i = 0, len = elements.length; i < len; i++){
					lazySizes.loader.unveil(elements[i]);
				}
			}
		};

		addEventListener('beforeprint', onprint, false);

		if(!('onbeforeprint' in window) && window.matchMedia && (printMedia = matchMedia('print')) && printMedia.addListener){
			printMedia.addListener(function(){
				if(printMedia.matches){
					onprint();
				}
			});
		}
	}
}));


/***/ })
/******/ ]);
//# sourceMappingURL=imageset.js.map