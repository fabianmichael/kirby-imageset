<?php

class Presets {

  protected static $presets = [];

  public static function exists($name) {
    return (static::get($name) !== false);
  }

  public static function get($name) {
    if(isset(static::$presets[$name])) {
      return static::$presets[$name];
    } else {
      return false;
    }
  }

  public static function set($name, $sizes = null) {
    if (is_null($sizes) && utils::isArrayAssoc($name)) {
      static::$presets[$name] = $sizes;
    }
  }

}
