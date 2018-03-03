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
'use strict';

import imageLoaded from './utils/imageLoaded';
import rAF         from './utils/rAF';
import ready       from './utils/ready';
import debounce    from './utils/debounce';

import 'lazysizes/plugins/print/ls.print.js';
import 'lazysizes';

/* =====  Configuration  ================================================== */

const __wrapperClass                    = 'imageset';
const __wrapperLoadedClass              = 'is-loaded';
const __wrapperErrorClass               = 'has-error';
const __wrapperPlaceholderStyleClass    = '-placeholder:';
const __wrapperAlphaClass               = '-alpha';
const __wrapperPlaceholderRenderedClass = 'is-placeholder-rendered';
const __wrapperPlaceholderErrorClass    = 'has-placeholder-error';
const __imageElementClass               = __wrapperClass + '-element';
const __placeholderElementClass         = __wrapperClass + '-placeholder';
const __errorOverlayClass               = 'imageset-error';
const __operaMiniClass                  = 'operamini';

const isOperaMini = (Object.prototype.toString.call(window.operamini) === '[object OperaMini]');

import trianglesPlaceholder     from './placeholder/triangles';
import mosaicPlaceholder        from './placeholder/mosaic';
import blurPlaceholderGenerator from './placeholder/blur';

const placeholder = {
  triangles: trianglesPlaceholder,
  mosaic:    mosaicPlaceholder,
  blurred:   blurPlaceholderGenerator(15, 512, 17),
  lqip:      blurPlaceholderGenerator( 7, 512, 15),
};



const __placeholderstyleRegexp = new RegExp(__wrapperPlaceholderStyleClass + '([a-z0-9_-]+)\\s*', 'i');

class ImageSet {
  
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.image   = this.wrapper.getElementsByClassName(__imageElementClass)[0];
    
    // init image callbacks for load and error events
    imageLoaded(this.image, this.load.bind(this), this.error.bind(this));

    // init placeholder rendering
    var placeholderStyle   = this.getPlaceholderStyle();
    
    if(placeholder[placeholderStyle]) {
      placeholder[placeholderStyle](this, newPlaceholder => {
        this.wrapper.classList.add(__wrapperPlaceholderRenderedClass);
        
        if(newPlaceholder) {
          var oldPlaceholder = this.getPlaceholderElement();     

          newPlaceholder.setAttribute('aria-hidden', 'true');

          newPlaceholder.className = oldPlaceholder.className + ' ' + newPlaceholder.className;
          
          oldPlaceholder.parentNode.replaceChild(newPlaceholder, oldPlaceholder);
          this.placeholderElement = newPlaceholder;
        }
      }, () => {
        this.wrapper.classList.add(__wrapperPlaceholderErrorClass);
      });
    }
  }

  getWrapper() {
    return this.wrapper;
  }

  getPlaceholderStyle() {
    if(this.placeholderStyle === undefined) {
      // determine placeholder style if not already in cache
      let result = this.wrapper.className.match(__placeholderstyleRegexp);
      this.placeholderStyle = result ? result[1] : false;
    }

    return this.placeholderStyle;
  }

  getPlaceholderElement() {
    if(this.placeholderElement === undefined) {
      this.placeholderElement = this.wrapper.querySelector('.' + __placeholderElementClass);
    }

    return this.placeholderElement;
  }

  isAlpha() {
    return this.wrapper.classList.contains(__wrapperAlphaClass);
  }

  load() {
    rAF(() => {
      this.wrapper.classList.add(__wrapperLoadedClass);
    });
  }

  error() {
    rAF(() => {
      
      var errorOverlay = document.createElement('span');
      errorOverlay.classList.add(__errorOverlayClass);

      var alt = this.image.getAttribute('alt');

      if(alt !== null && alt !== '') {
        errorOverlay.setAttribute('aria-hidden', 'true');
        errorOverlay.appendChild(document.createTextNode(alt));
      }

      this.wrapper.appendChild(errorOverlay);
      
      rAF(() => {
        this.wrapper.classList.add(__wrapperErrorClass);
      });

    });
  }
}

const imagesetElements = document.getElementsByClassName(__wrapperClass);

function checkImagesets() {
  for(let i = 0, l = imagesetElements.length, item; (i < l) && (item = imagesetElements[i]); i++) {

    if(item._imageset) {
      // skip imagesets that have been already initialized
      // console.log("skipped!", item);
      continue; 
    }

    item._imageset = new ImageSet(item);
  }
}

var debouncedCheckImagesets = debounce(checkImagesets);

/* =====  Variable Shortcuts  ============================================= */

if(!isOperaMini) {

  if(window.MutationObserver) {
    // Use MutationObserver to check for new elements,
    // if supported.
    new window.MutationObserver( debouncedCheckImagesets ).observe( document.documentElement, {childList: true, subtree: true, attributes: false, characterData: false } );
  } else {
    // Otherwise, fallback to Mutation Events and add
    // a setInterval for as a safety fallback.
    document.documentElement.addEventListener('DOMNodeInserted', debouncedCheckImagesets, true);
    document.documentElement.addEventListener('DOMAttrModified', debouncedCheckImagesets, true);
    setInterval(debouncedCheckImagesets, 999);
    ready(debouncedCheckImagesets);
  }

  window.addEventListener('hashchange', debouncedCheckImagesets, true);

  debouncedCheckImagesets();


} else {
  // Opera Mini has limited DOM Event support and does not
  // work with lazysizes. So we shortcut the loading process
  // of lazy-loading and disable lazysizes.
  window.lazySizesConfig      = window.lazySizesConfig || {};
  window.lazySizesConfig.init = false;

  document.documentElement.classList.add(__operaMiniClass);

  var loadImageSetForOperaMini = function(wrapper) {
      
    var sources = wrapper.getElementsByTagName('source');
    var img     = wrapper.getElementsByClassName(__imageElementClass)[0];
  
    // Wrapper should be loaded to trigger css hook like
    // on other browsers.
    wrapper.classList.add(__wrapperLoadedClass);

    if(window.HTMLPictureElement) {
      // As of December 2016, Opera Mini does not support
      // the picture element. However, we consider this
      // here for possible implementations in the future.
      for(let i = 0, l = sources.length; i < l; i++) {
        let s = sources[i];
        if(s.hasAttribute('data-srcset')) s.setAttribute('srcset', s.getAttribute('data-srcset'));
        if(s.hasAttribute('data-src'))    s.setAttribute('src',    s.getAttribute('data-src'));
      }

      if(img.hasAttribute('data-srcset')) img.setAttribute('srcset', img.getAttribute('data-srcset'));
      if(img.hasAttribute('data-src'))    img.setAttribute('src',    img.getAttribute('data-src'));

    } else {
      
      var fallbackSource = sources.length > 0 ? sources[sources.length - 1] : img;
      var candidates     = fallbackSource.getAttribute('data-srcset').split(/,\s+/);

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
}