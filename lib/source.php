<?php

namespace Kirby\Plugins\ImageSet;

use Exception;

class Source {
  
  public $attributes = [];
  public $image;

  public $params = [
    // 'width'  => false,
    // 'height' => false,
    // 'ratio'  => false,
  ];

  public function __construct($image, $params) {
    $this->image  = $image;
    $this->params = array_merge($this->params, $params);
    $this->thumb  = $this->image->thumb($this->params);
  }

  public function density() {
    return 1;
  }

  public function __debugInfo() {
    return [
      'image' => 'bla', // $this->image, // $this->image,
    ];
  }

  function __call($name, $value) {
    if(method_exists($this->thumb, $name)) {
      return call_user_func_array([$this->thumb, $name], $value);
    } else {
      throw new Exception("Call to undefined method '$name' on Source class.");
    }
  }
}
