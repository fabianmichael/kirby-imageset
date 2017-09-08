<?php

namespace Kirby\Plugins\ImageSet;

use Cache\Driver\File as FileCache;
use Dir;
use Error;
use F;
use File;
use Folder;
use Media;


class Cache {

  const CACHE_EXTENSION = 'imagesetcache';
  
  protected $cacheRoot;
  protected $driver;
  protected $kirby;
  
  protected function __construct($kirby) {
    $this->kirby     = $kirby;
    $this->cacheRoot = $kirby->roots()->thumbs(); 

    try {     
      $this->driver = new FileCache($this->cacheRoot);
    } catch(Error $e) {
      throw new Error("The thumbs directory does not exist at \"$this->cacheRoot\".", $e->getCode());
    }
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
    } else {
      $path  = dirname($image->root());
      $file  = $image->filename();
      $index = $this->kirby->roots()->index();
      $pos   = strpos($path, $index);
      if($pos === 0) {
        $path = ltrim(substr($path, strlen($index)), DS);
      }
    }

    return $path . DS . $file . '-' . $key . '.' . static::CACHE_EXTENSION;
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

  public function flush() {
    $cacheFiles = $this->inventory();

    foreach($cacheFiles as $file) {
      f::remove($file);
    }

    return true;
  }

  public function inventory($root = null) {
    $folder = !is_null($root) ? $root : $this->root();
    $files  = [];
    $dir    = opendir($folder);

    while($file = readdir($dir)) {
      if($file === '.' || $file === '..') {
        continue;
      } else if(is_dir($folder . DS . $file)) {
        $files = array_merge($files, $this->inventory($folder . DS . $file));
      } else if(pathinfo($file, PATHINFO_EXTENSION) === static::CACHE_EXTENSION) {
        $files[] = $folder . DS . $file;
      }
    }

    return $files;
  }

  public function status() {
    $cacheFiles = $this->inventory();

    $size = 0;
    foreach($cacheFiles as $file) {
      $size += f::size($file);
    }

    return [
      'size'  => $size,
      'files' => sizeof($cacheFiles),
    ];
  }
}
