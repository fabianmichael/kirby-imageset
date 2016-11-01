<?php

namespace Kirby\Plugins\ImageSet\Traits;

trait SourceSet {

  public $image;
  public $sources = array();
  public $params  = [];
  public $options = [
    'media'      => '',
    'sizes'      => '',   
    'descriptor' => 'width',
    'lazyload'   => false,
  ];

  public function option($name, $value = null) {
    $args = func_get_args();
    if(!is_null($value)) {
      // setter
      $this->options[$name] = $value;
      return $this;
    } else {
      // getter
      if(isset($this->options[$name])) {
        return $this->options[$name];
      } else {
        throw new Exception('Trying to access undefined option "' . $args[0] . '" on SourceSet.');
      }
    }
  }

  public function add($source) {
    $this->sources[] = $source;
  }

  public function descriptor() {
    return $this->options['descriptor'];
  }
  
  public function media($media = null) {
    return $this->option('media', $media);
  }

  public function sizes($sizes = null) {
    return $this->option('sizes', $sizes);
  }

  public function density() {
    return 1;
  }

  public function src() {
    if(isset($this->sources[0])) {
      return $this->sources[0]->url();
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
}
