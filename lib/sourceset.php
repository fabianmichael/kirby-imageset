<?php

namespace Kirby\Plugins\ImageSet;

use Exception;
use Html;


class SourceSet {

  use Traits\SourceSet;

  public function __construct($image = null, $options = null) {
    $this->image = $image;
    $this->options = array_merge($this->options, is_array($options) ? $options : []);
    //$params = is_array($params) ? $params : [];
    //$this->params = array_merge($params);
  }

  // public function srcset() {
  //   $srcset = [];
  //   foreach($this->sources as $source) {
  //     $srcset[] = $source->srcset();
  //   }

  //   return implode(', ', $srcset);
  // }
  // 
  public function tag() {
    $attr = [];

    if($this->option('lazyload')) {
      $attr['src']         = Utils::blankInlineImage();
      $attr['data-srcset'] = $this->srcset();
    } else {
      $attr['srcset'] = $this->srcset();
    }

    var_dump($this->options);

    if(!empty($this->media())) {
      $attr['media'] = $this->media();
    }

    if(!empty($this->sizes())) {
      $attr['sizes'] = $this->sizes();
    }

    return Html::tag('source', $attr);
  }

  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }

  // public function html() {
  //   return '';
  // }

  // public function option($key, $value = null) {
  //   if(!is_null($value)) {
  //     $this->options[$key] = $value;
  //     return $this;
  //   } else {
  //     if(isset($this->options[$key])) {
  //       return $this->options[$key];
  //     }
  //   }
  // }

  // public function __call($name, $arguments) {
  //   if(sizeof($arguments) > 0) {
  //     // setter
  //     $this->option($name, $arguments[0]);
  //     return $this;
  //   } else {
  //     // getter
  //     return $this->option($name);
  //   }
  // }
}
