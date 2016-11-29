/*!
 * ImageSet (1.0.0)
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
  };

  var isOperaMini = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]");

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
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // Make sure to add JS class to document element, if
  // it has not been done by any other script.
  removeClass(document.documentElement, "no-js");
  addClass(document.documentElement, "js");

  if(true || isOperaMini) {
    window.lazySizesConfig = window.lazySizesConfig || {};
    window.lazySizesConfig.init = false;

    addClass(document.documentElement, "operamini");

    var loadImageSet = function(el) {
      
      addClass(el, SETTINGS.wrapperLoadedClass);
      
      var sources = el.getElementsByTagName("source"),
          fallbackSource,
          fallbackSrc,
          img     = el.getElementsByClassName(SETTINGS.imageElementClass)[0];
      
      if(sources.length > 0) {
        fallbackSource = sources[sources.length - 1];
      } else {
        fallbackSource = img;
      }

      //img.setAttribute("srcset", fallbackSource.getAttribute("data-srcset"));
      var fallback;
      var candidates = fallbackSource.getAttribute("data-srcset").split(/,\s*/);
      if("console" in window) console.log("c", candidates);

      var node;
      //while(node =)

      // var wrap = el.getElementsByTagName("picture")[0];
      // console.log("srcsetzt", sources);
      // for(var i = 0; i < sources.length; i++) {
      //   sources[i].parentNode.removeChild(sources[i]);
      // }
      for (var i = sources.length; i--; ) {
        sources[i].parentNode.removeChild(sources[i]);
      }

      img.src = candidates.pop().replace(/\s*\d+[wx]$/, '');

      // if(fallbackSource.hasAttribute("data-srcset")) {

      // }

      // img.setAttribute("srcset", fallbackSource.getAttribute("data-srcset");
      // //img.setAttribute("src", fallbackSource.getAttribute("data-src");

      // "console" in window && console.log("img", el);
      // for(var i = 0, l = sources.length; i < l; i++) {
      //   var source = sources[i];
      //   if(source.hasAttribute("data-srcset")) {
      //     source.setAttribute("srcset", source.getAttribute("data-srcset"));
      //     //"console" in window && console.log("src: ", source);
      //     //source.removeAttribute("data-src");
      //   }
      //   // if(source.hasAttribute("data-srcset")) {
      //   //   source.setAttribute("srcset", source.getAttribute("data-srcset"));
      //   //   //source.removeAttribute("data-srcset");
      //   // }
      // }
    };

    ready(function() {
      document.getElementsByTagName("h1")[0].innerHTML = "mini";
      var imagesets = document.getElementsByClassName(SETTINGS.wrapperLazyloadClass);
      //"console" in window && console.log("st", imagesets);
      for(var i = 0, l = imagesets.length; i < l; i++) {
        loadImageSet(imagesets[i]);
      }
    });

    return;
  } else {
    removeClass(document.documentElement, "no-js");
  }

    // =====
  
  // select the target node
// var target = document.body;
// var objectFitSupported = ("objectFit" in (new Image()).style);

// console.log("object-fit", objectFitSupported);

// // Create an observer instance
// var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
// var observer = new MutationObserver(function( mutations ) {
//   for(var i, l = mutations.length; i < l; i++) {
    
//     var newNodes = mutations[i],
//         newNodesLength = newNodes.length;
   
//     for(var n = 0; n < newNodesLength; n++) {
//       console.log("new node", newNodes[n]);
//     }
//   }

//   mutations.forEach(function( mutation ) {
//     var newNodes = mutation.addedNodes; // DOM NodeList
//     if( newNodes !== null ) { // If there are new nodes added
//       console.log(newNodes);
//       var $nodes = $( newNodes ); // jQuery set
//       $nodes.each(function() {
//         var $node = $( this );
//         if( $node.hasClass( "imageset" ) ) {
//           // do something
//         }
//       });
//     }
//   });    
// });

// // Configuration of the observer:
// var config = { 
//   attributes: true, 
//   childList: true,
//   subtree: true,
//   //characterData: true 
// };
 
// Pass in the target node, as well as the observer options
//observer.observe(target, config);
 
// // create an observer instance
// var observer = new MutationObserver(function(mutations) {
//   mutations.forEach(function(mutation) {
//     console.log("muta", mutation);
//   });    
// });
 
// // configuration of the observer:
// var config = { childList: true, subtree: true };
 
// // pass in the target node, as well as the observer options
// observer.observe(target, config);
 
// later, you can stop observing
//observer.disconnect();
  
  // function ImageSet(element) {
    
    
  //   var placeholder = element.getElementsByClassName("imageset__placeholder")[0];


  //   var init = function() {
  //     console.time('someFunction');
  //     var w = element.offsetWidth,
  //         h = element.offsetHeight;

  //     if(w/h < placeholder.naturalWidth/placeholder.naturalHeight) {
  //       // Image is taller than imageset
  //       w = placeholder.naturalWidth * h / placeholder.naturalHeight;
  //     } else {
  //       h = placeholder.naturalHeight * w / placeholder.naturalWidth;
  //     }

  //     console.log("ca", w, h);

  //     var canvas = document.createElement("canvas");



  //     canvas.width     = w; //element.offsetWidth;
  //     canvas.height    = h; //element.offsetHeight;
  //     canvas.className = "imageset__placeholder";

  //     // var tmp = document.createElement("canvas");
  //     // tmp.width = w;
  //     // tmp.height = h;

      
  //     var ctx = canvas.getContext("2d");

  //     ctx.drawImage(placeholder, 0, 0, w, h);

  //     StackBlur.canvasRGB(canvas, 0, 0, w, h, 8);

  //     element.replaceChild(canvas, placeholder);

  //     //console.log("pl", placeholder, placeholder.complete);
  //     //StackBlur.image(tmp, canvas, 22, false);
  //     // var span = document.createElement("span");
  //     // span.className = "imageset__placeholder";
  //     // span.setAttribute("style", "background: url(" + canvas.toDataURL("image/jpeg", 1.0) +") 50% 50% / cover no-repeat;");

  //     // element.replaceChild(span, placeholder);
  //     console.timeEnd('someFunction');
  //   };

  //   if(placeholder.complete && placeholder.naturalWidth !== 0) {
  //     init();
  //   } else {
  //     placeholder.addEventListener("load", init);
  //   }

  // }
  //StackBlur.image(placeholder, canvas, 22, false);


  // var imagesets = document.getElementsByClassName("imageset");
  // for(var i = 0, l = imagesets.length; i < l; i++) {
  //   if(hasClass(imagesets[i], "imageset--placeholder--blurred")) {
      
  //     new ImageSet(imagesets[i]);
      
  //   }
  // }



  // =====
  

  // Setup defaults
  if (window.imageSetConfig) {
    extend(SETTINGS, window.imageSetConfig);
  }
  window.imageSetConfig = SETTINGS;

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


// Opera Mini
// ;(function(){


//   function ready(fn) {
//     if (document.readyState != 'loading'){
//       fn();
//     } else {
//       document.addEventListener('DOMContentLoaded', fn);
//     }
//   }



//   var isOperaMini = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]");
//   if(isOperaMini) {
//     //window.lazySizesConfig = window.lazySizesConfig || {};
//    // window.lazySizesConfig.init = false;
    
//     ready(function() {
//       document.getElementsByTagName("h1")[0].innerHTML = "mini!!!!";
//       var images = document.getElementsByClassName("imageset__element");
//       for(var i = 0, l = images.length; i < l; i++) {
//         lazySizes.loader.unveil(images[i]);
//       }
//     });
//   }
// })();
