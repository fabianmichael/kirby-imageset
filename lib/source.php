<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;

use Exception;


class Source {
  
  public $image;
  public $options;
  public $kirby;
  protected $thumb;

  public function __construct($image, $options = null, $kirby = null) {
    $this->image   = $image;
    $this->options = is_array($options) ? $options : [];
    $this->kirby   = $kirby ?: kirby();

    if(strtolower($this->image->extension()) === 'svg') {
      $this->thumb = $this->image;
    } else {
      $this->thumb = $this->image->thumb($this->options);
    }
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
      'image' => $this->image,
    ];
  }

}
