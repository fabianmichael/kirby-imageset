<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;

use A;
use ArrayAccess;
use Exception;
use Html;


class SourceSet {

  public $image;
  public $sources = [];
  public $options = [];

  public static $defaults  = [
    'media'      => '',
    'sizes'      => '',   
    'descriptor' => 'width',
    'lazyload'   => true,
  ];

  public function __construct($image = null, $options = [], $kirby = null) {
    $this->image   = $image;
    $this->options = array_merge(self::$defaults, $options);
    $this->kirby   = $kirby ?: kirby();
  }

  public function push($source) {
    $this->sources[] = $source;
  }

  public function option($key, $default = null) {
    return a::get($this->options, $key, $default);
  }

  public function firstSource() {
    return isset($this->sources[0]) ? $this->sources[0] : null;
  }

  public function lastSource() {
    $last = sizeof($this->sources) - 1;
    return isset($this->sources[$last]) ? $this->sources[$last] : null;
  }

  public function count() {
    return count($this->sources);
  }

  public function sources() {
    return $this->sources;
  }

  public function descriptor() {
    return 'width';
  }
  
  public function media() {
    return $this->option('media');
  }

  public function density() {
    return 1;
  }

  public function sizes() {
    return $this->option('sizes');
  }

  public function src() {
    if($this->lastSource() instanceof Source) {
      return $this->lastSource()->src();
    } else {
      // File or Media object
      return $this->lastSource()->url();
    }
  }

  public function ratio() {
    return $this->lastSource()->ratio();
  }

  public function srcset() {
    $srcset = [];

    if(!is_array($this->sources)) {
      return '';
    }

    foreach($this->sources as $source) {
      
      if($source instanceof SourceSet) {
        $srcset[] = $source->srcset();
      } else {
        $srcset[] = $source->url() . ' ' . ($this->descriptor() === 'width' ? $source->width()   . 'w' : $source->density() . 'x'); 
      }
    }
      
    return implode(', ', $srcset);
  }

  public function tag($attributes = null, $lazyload = null) {
    
    $attributes = !is_null($attributes) ? $attributes : [];
    $lazyload   = !is_null($lazyload) ? $lazyload : $this->option('lazyload');
    
    $attr      = [];

    if($lazyload) {
      $attr['srcset']      = Utils::blankInlineImage() . ' 1w';
      $attr['data-srcset'] = $this->srcset();
    } else {
      $attr['srcset'] = $this->srcset();
    }

    if(!empty($this->media())) {
      $attr['media'] = $this->media();
    }

    $attr = array_merge(
      $attr,
      $attributes,
      $this->getSizesAttributes($lazyload)
    );

    return html::tag('source', $attr);
  }

  public function getSizesAttributes($lazyload = null) {
    
    $attr = [];
    $lazyload = !is_null($lazyload) ? $lazyload : $this->option('lazyload');

    if(!empty($this->sizes())) {
      $attr['sizes'] = $this->sizes();
    } else {
      $attr['sizes'] = '100vw';
    }

    return $attr;
  }

  public function sizesAttributes($lazyload = null) {
    return ' ' . html::attr($this->getSizesAttributes($lazyload));
  }



  public function __toString() {
    return $this->tag();
  }

  // =====  Debugging Helper  =============================================== //

  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }
}
