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
    'sizes'      => '100vw',   
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

  public function ratio() {
    return $this->sources[0]->ratio();
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
    if(isset($this->sources[0])) {
      return $this->sources[0]->src();
    } else {
      return null;
    }
  }

  public function srcset() {
    $srcset = [];

    if(!is_array($this->sources)) {
      return '';
    }

    foreach($this->sources as $source) {
      
      if($source instanceof \Kirby\Plugins\ImageSet\SourceSet) {
        $srcset[] = $source->srcset();
      } else {
        $srcset[] = $source->url() . ' ' . ($this->descriptor() === 'width' ? $source->width()   . 'w' : $source->density() . 'x'); 
      }
    }
      
    return implode(', ', $srcset);
  }

  public function tag($tagName = 'source', $attributes = []) {
    $attr = [];

    if($this->option('lazyload')) {
      $attr['srcset']      = Utils::blankInlineImage() . ' 1w';
      $attr['data-srcset'] = $this->srcset();
    } else {
      $attr['srcset'] = $this->srcset();
    }

    if(!empty($this->media())) {
      $attr['media'] = $this->media();
    }

    if(!empty($this->sizes())) {
      $attr['sizes'] = $this->sizes();
    }

    $attr = array_merge($attr, $attributes);

    return Html::tag($tagName, $attr);
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
