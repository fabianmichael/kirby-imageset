<?php

namespace Kirby\Plugins\ImageSet;

use ArrayAccess;
use Exception;
use Html;


class SourceSet implements ArrayAccess {

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

  public function option($name, $value = null) {
    if(!is_null($value)) {
      // setter
      $this->options[$name] = $value;
      return $this;
    } else {
      // getter
      if(isset($this->options[$name])) {
        return $this->options[$name];
      } else {
        throw new Exception('Trying to access undefined option "' . $name . '" on SourceSet.');
      }
    }
  }

  public function ratio() {
    return $this->sources[0]->ratio();
  }

  

  public function descriptor() {
    return 'width'; // $this->options['descriptor'];
  }
  
  public function media($media = null) {
    return $this->option('media', $media);
  }

  public function sizes($sizes = null) {
    if(!is_null($sizes)) {
      return $this->option('sizes', $sizes);
    }
    $sizes = $this->option('sizes');
    if(empty($sizes)) {
      return '100vw';
    }
  }

  public function density() {
    return 1;
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

    //$attr['src'] = Utils::blankInlineImage();
    //print_r($this->option('lazyload'));

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

  /* ArrayAccess */
  public function offsetSet($offset, $value) {
    if(is_null($offset)) {
      $this->sources[] = $value;
    } else {
      $this->sources[$offset] = $value;
    }
  }

  public function offsetExists($offset) {
    return isset($this->sources[$offset]);
  }

  public function offsetUnset($offset) {
    unset($this->sources[$offset]);
  }

  public function offsetGet($offset) {
    return isset($this->sources[$offset]) ? $this->sources[$offset] : null;
  }


  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }
}
