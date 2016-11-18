<?php

namespace Kirby\Plugins\ImageSet;

use Exception;

class Source {
  
  public $image;
  public $options;
  public $kirby;
  protected $thumb;

  public function __construct($image, $options = [], $kirby = null) {
    $this->image   = $image;
    $this->options = is_array($options) ? $options : [];
    $this->kirby   = $kirby ?: kirby();
    $this->thumb   = $this->image->thumb($this->options);
  }

  public function density() {
    return 1;
  }

  public function ratio() {
    if(@$this->options['crop']) {
      return $this->thumb->ratio();
    } else {
      return $this->image->ratio();
    }
  }

  public function src() {
    return $this->thumb->url();
  }

  function __call($name, $value) {
    if(method_exists($this->thumb, $name)) {
      return call_user_func_array([$this->thumb, $name], $value);
    } else {
      throw new Exception("Call to undefined method '$name' on Source class.");
    }
  }

  public function __debugInfo() {
    return [
      'image' => 'bla', // $this->image, // $this->image,
    ];
  }

}
