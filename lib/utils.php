<?php

namespace Kirby\Plugins\ImageSet;

use F;
use ColorThief\ColorThief;


class Utils {
  
  public static function isArrayAssoc($arr) {
    return (is_array($arr) && array_keys($arr) !== range(0, sizeof($arr) - 1));
  }

  public static function isArraySequential($arr) {
    return (is_array($arr) && array_keys($arr) === range(0, sizeof($arr) - 1));
  }

  public static function formatFloat($value, $precision = 8) {
    return rtrim(rtrim(number_format($value, $precision, '.', ''), '0'), '.');
  }

  public static function compareFloats($a, $b, $precision = 3) {
    return (abs(($a - $b) / $b) < 1 / pow(10, $precision));
  }

  public static function blankInlineImage() {
    return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  public static function rgb2hex($rgb) {
    return '#' . sprintf('%02x', $rgb[0]) . sprintf('%02x', $rgb[1]) . sprintf('%02x', $rgb[2]);
  }

  public static function hex2rgb($hex) {
     $hex = str_replace('#', '', $hex);

     if(strlen($hex) === 3) {
        $r = hexdec(substr($hex, 0, 1) . substr($hex, 0, 1));
        $g = hexdec(substr($hex, 1, 1) . substr($hex, 1, 1));
        $b = hexdec(substr($hex, 2, 1) . substr($hex, 2, 1));
     } else {
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
     }

     return [$r, $g, $b];
  }

  public static function thumbDestinationDir($media) {
    if(is_a($media, 'File')) {
      return $media->page()->id();      
    } else {
      return str_replace(kirby()->urls()->index(), '', dirname($media->url()));      
    }
  }

  public static function dominantColor($media) {
    static $cache = [];

    if(!isset($cache[$media->root()])) {
      $image     = $media;
      $cacheFile = static::thumbDestinationDir($image);
      $cacheFile = kirby()->roots()->thumbs() . DS . str_replace('/', DS, $cacheFile) . DS . $image->filename() . '-color.cache';

      if(!f::exists($cacheFile) || (f::modified($cacheFile) < $media->modified())) {
        $color = utils::rgb2hex(ColorThief::getColor($media->root(), max(20, round($image->width() / 50))));
        $cache[$media->root()] = $color;
        f::write($cacheFile, $cache[$media->root()]); 
      } else {
        $cache[$media->root()] = f::read($cacheFile);
      }
    }

    return $cache[$media->root()];
  }


  public static function imagekitAvailable() {
    return function_exists('imagekit');
  }

  public static function optimizerAvailable($name) {
    if(!static::imagekitAvailable()) return false;
    
    $imageKitVersionTrimmed = explode('-', imagekit()->version())[0]; // everything before a dash.
    if(!version_compare($imageKitVersionTrimmed, '1.1.0', '>=')) return false;

    return \Kirby\Plugins\ImageKit\Optimizer::available($name);
  }

}
