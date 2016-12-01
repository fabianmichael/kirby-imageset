/*!
 * ImageSet (1.0.0-alpha1)
 *
 * This script file is needed for lazyloading imagesets,
 * generated with ImageSet for Kirby.
 *
 * Copyright (c) 2016 Fabian Michael <hallo@fabianmichael.de>
 * 
 * @license SEE LICENSE IN license.md
 */
;(function(window, document, undefined) {
  'use strict';

  var SETTINGS = {
    'wrapperClass'           : 'imageset',
    'wrapperLazyloadClass'   : 'imageset--lazyload',
    'wrapperLoadedClass'     : 'imageset--loaded',
    'imageElementClass'      : 'imageset__element',
    'placeholderClass'       : 'imageset__placeholder',
    'placeholderLoadedClass' : 'imageset__placeholder--loaded',
    'placeholderMosaicClass' : 'imageset--placeholder--mosaic',
  };

  // Feature tests
  var isOperaMini              = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]"),
      supportsCanvas           = !!window.CanvasRenderingContext2D,
      supportsPixelatedImages  = ('imageRendering' in document.documentElement.style) || ('msInterpolationMode' in document.documentElement.style),
      supportsMutationObserver = !!window.MutationObserver;

  // Shim layer with setTimeout fallback. Look only for unprefixed
  // requestAnimationFrame, because all modern browsern already removed the
  // prefix.
  var rAF = window.requestAnimationFrame || function(callback) { setTimeout(callback, 1000/60); };

  // Class utilities using `classList` API if available.
  // Fallbacks inspired by: https://gist.github.com/devongovett/1381839
  var hasClass = (function() {
    return document.documentElement.classList ?
      function(el, cls) { return el.classList.contains(cls); } :
      function(el, cls) { return !!~el.className.split(/\s+/).indexOf(cls); };
  })();

  var addClass = (function() {
    return document.documentElement.classList ?
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
    return document.documentElement.classList ?
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

  // Extend an object with another one
  function extend(base, obj) {
    for(var i in obj) {
      if(obj.hasOwnProperty(i)) {
        base[i] = obj[i];
      }
    }
    return base;
  }

  function ready(fn) {
    if(document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function getDevicePixelRatio() {
    var ratio = 1;
    // To account for zoom, change to use deviceXDPI instead of systemXDPI
    if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined &&
        window.screen.systemXDPI > window.screen.logicalXDPI) {
      // Only allow for values > 1
      ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
    } else if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
    }
    return ratio;
  }


  // Make sure to add JS class to document element, if
  // it has not been done by any other script.
  removeClass(document.documentElement, "no-js");
  addClass(document.documentElement, "js");

  if(isOperaMini) {
    // Opera Mini has limited DOM Event support and does not
    // work with lazysizes. So we shortcut the loading process
    // of lazy-loading and disable lazysizes.
    window.lazySizesConfig      = window.lazySizesConfig || {};
    window.lazySizesConfig.init = false;

    var loadImageSet = function(el) {
        
      var sources = el.getElementsByTagName("source"),
          img     = el.getElementsByClassName(SETTINGS.imageElementClass)[0];
    
      // Wrapper should be loaded to trigger css hook like
      // on other browsers.
      addClass(el, SETTINGS.wrapperLoadedClass);

      if(window.HTMLPictureElement) {
        for(var i = 0, l = sources.length; i < l; i++) {
          var s = sources[i];
          if(s.hasAttribute("data-srcset")) {
            s.srcset = s.getAttribute("data-srcset");
            s.removeAttribute("data-srcset");
          }
          if(s.hasAttribute("data-src")) {
            s.src = s.getAttribute("data-src");
            s.removeAttribute("data-src");
          }
        }

        if(img.hasAttribute("data-srcset")) {
          img.srcset = img.getAttribute("data-srcset");
          img.removeAttribute("data-srcset");
        }
        if(img.hasAttribute("data-src")) {
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
        }

      } else {

        
        var fallbackSource = sources.length > 0 ? sources[sources.length - 1] : img,
            candidates     = fallbackSource.getAttribute("data-srcset").split(/,\s+/);

        for(var n = sources.length; n--;) {
          // Delete sources elements 
          sources[n].parentNode.removeChild(sources[n]);
        }

        img.src = candidates.pop().replace(/\s+\d+[wx]$/, '');
      }
    };

    ready(function() {
      var imagesets = document.getElementsByClassName(SETTINGS.placeholderMosaicClass);
      for(var i = 0, l = imagesets.length; i < l; i++) {
        loadImageSet(imagesets[i]);
      }
    });

  } else {
    // Regular initialization

    // Setup defaults
    if (window.imageSetConfig) {
      extend(SETTINGS, window.imageSetConfig);
    }
    window.imageSetConfig = SETTINGS;

    // Fix for Microsoft Edge, because it does not support
    // pixelated images, while IE 10 and 11 support this
    // out-of-the-box.
    if(!supportsPixelatedImages && supportsCanvas) {

      var ratio = Math.min(2, getDevicePixelRatio());
      
      var createScaledPlaceholder = function(el) {

        if(el.querySelector("canvas." + SETTINGS.placeholderClass)) {
          // Skip already transformed imagesets
          return;
        }

        var canvas      = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            placeholder = el.getElementsByClassName(SETTINGS.placeholderClass)[0];

        var process = function() {
          var width        = placeholder.naturalWidth,
              height       = placeholder.naturalHeight,
              factor       = 100 * ratio,
              scaledWidth  = Math.round(width * factor),
              scaledHeight = Math.round(height * factor);

          canvas.width  = scaledWidth;
          canvas.height = scaledHeight;

          ctx.mozImageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.msImageSmoothingEnabled = false;
          ctx.imageSmoothingEnabled = false;
          
          canvas.setAttribute("aria-hidden", true);
          canvas.className = placeholder.className;
          
          // replaceChild() results in erros,
          // so using the workaround here …
          rAF(function(){
            ctx.drawImage(placeholder, 0, 0, scaledWidth, scaledHeight);
            placeholder.parentNode.appendChild(canvas);
            placeholder.parentNode.removeChild(placeholder);
          });
        };

        if(!placeholder.complete || (typeof placeholder.naturalWidth === "undefined") || placeholder.naturalWidth === 0) {
          placeholder.addEventListener("load", process);
        } else {
          process();
        }
      };

      ready(function() {

        // Fix existing imagesets …
        var imagesets = document.getElementsByClassName(SETTINGS.placeholderMosaicClass);
        for(var i = 0, l = imagesets.length; i < l; i++) {
          createScaledPlaceholder(imagesets[i]);
        }

        // … and watch for new ones.
        if(supportsMutationObserver) {
          var observer = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
              var mutation = mutations[i];
              if (mutation.type === 'childList' && mutation.addedNodes.length) { 

                for(var n = 0; n < mutation.addedNodes.length; n++) {
                  var node = mutation.addedNodes[n];
                  if(node.nodeType !== Node.ELEMENT_NODE) continue; // skip everything but element nodes  
                  if(hasClass(node, SETTINGS.placeholderMosaicClass)) {
                    createScaledPlaceholder(node);
                  }
                  
                }
                return;
              }
            }
          });

          var config = {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true
          };

          observer.observe(document.documentElement, config);
        }
      });
    }

    // Initialize
    document.addEventListener('lazybeforeunveil', function (e) {
      var element = e.target,
          parent  = element.parentNode;

      if (hasClass(element, SETTINGS.imageElementClass)) {
        // Only continue, if target element is an imageset, generated by Eye Candy

        while (!hasClass(parent, SETTINGS.wrapperClass)) {
          // Get imageset container element by traversing up the DOM tree
          parent = parent.parentNode;
        }

        // Define a callback function which gets invoked, after an image has
        // finally loaded.
        var cb = function () {
          rAF(function () {
            // Asynchronously add loaded class
            addClass(parent, SETTINGS.wrapperLoadedClass);
            element.removeEventListener("load", cb);
          });
        };

        element.addEventListener("load", cb);
      }
    });
  }

})(window, document);

/*!
 * lazysizes 2.0.7 (with "static-gecko-picture" plugin)
 * 
 * Copyright (C) 2015 Alexander Farkas
 * 
 * @license The MIT License (MIT)
 */

//=require lazysizes/lazysizes.js
//=require lazysizes/plugins/static-gecko-picture/ls.static-gecko-picture.js
