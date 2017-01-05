<?php

namespace Kirby\Plugins\ImageSet;

use Cache\Driver\File as FileCache;
use Dir;
use F;
use File;
use Media;


class Cache {

  const CACHE_EXTENSION = '.imagesetcache';
  
  protected $cacheRoot;
  protected $driver;
  protected $kirby;
  
  protected function __construct($kirby) {
    $this->kirby     = $kirby;
    $this->cacheRoot = $kirby->roots()->thumbs();      
    $this->driver = new FileCache($this->cacheRoot);
  }
  
  public static function instance($kirby = null) {
    static $instance;
    return $instance ?: $instance = new self($kirby ?: kirby());
  }
  
  public function driver() {
    return $this->driver;
  }
  
  public function root() {
    return $this->cacheRoot;
  }

  protected function imageCachePath(Media $image, $key) {
    if($image instanceof File) {
      $path = $image->page->id();
      $file = $image->filename();
    } else if($image instanceof Media) {
      $path  = dirname($media->root());
      $file  = $media->filename();
      $index = $this->kirby->roots()->index();
      $pos   = strpos($root, $index);
      if($pos === 0) {
        $path = ltrim(substr($path, strlen($index)), DS);
      }
    }

    return $path . DS . $file . '-' . $key . static::CACHE_EXTENSION;
  }

  public function created(Media $image, $key) {
    return $this->driver->created($this->imageCachePath($image, $key));
  }

  public function get(Media $image, $key, $default = null) {
    if($this->created($image, $key) > $image->modified()) {
      return $this->driver->get($this->imageCachePath($image, $key), $default = null);
    } else {
      return $default;
    }
  }

  public function set(Media $image, $key, $value, $minutes = null) {
    $this->driver->set($this->imageCachePath($image, $key), $value, $minutes);
  }
  
  public function __call($name, $arguments) {
    return call_user_func_array([$this->driver, $name], $arguments);
  }
}
