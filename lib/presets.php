<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;

use Exception;


/**
 * Loads and stores size presets.
 */
class Presets {

  protected static $presets = [];
  protected static $saved   = [];
  protected static $initial = null;

  public static function save($name) {
    static::$saved[$name] = static::$presets;
  }

  public static function load($name) {
    if(array_key_exists($name, static::$saved)) {
      static::$presets = static::$saved[$name];
    } else {
      throw new Exception('Failed to load presets from savepoint "' . $name . '".');
    }
  }

  public static function clear() {
    static::$presets = [];
  }

  public static function exists($name) {
    return (static::get($name) !== false);
  }

  public static function get($name) {
    if(array_key_exists($name, static::$presets)) {
      return static::$presets[$name];
    } else {
      return false;
    }
  }

  public static function set($name, $sizes = null) {
    if(is_null($sizes) && utils::isArrayAssoc($name)) {
      static::$presets = array_merge(static::$presets, $name);
    } else {
      static::$presets[$name] = $sizes;
    }
  }

  public static function init($presets) {
    static::set($presets);
    static::$initial = $presets;
  }

  public static function reset() {
    static::$presets = static::$initial;
  }
}
