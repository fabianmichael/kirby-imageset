<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;

use ColorThief\ColorThief;
use Exception;
use F;
use File;
use RuntimeException;
use Thumb;

class Utils {

  static $fileCache;
  
  /**
   * Checks, if an array is an associate array.
   *
   * @param array $arr
   * @return bool
   */
  public static function isArrayAssoc($arr) {
    return (is_array($arr) && array_keys($arr) !== range(0, sizeof($arr) - 1));
  }

  /**
   * Check, if an array is a sequential array.
   * 
   * @param array $arr
   * @return bool
   */
  public static function isArraySequential($arr) {
    return (is_array($arr) && array_keys($arr) === range(0, sizeof($arr) - 1));
  }

  /**
   * Formats a float for output in e.g. templates or CSS code
   * by bypassing automatic local number formatting, when a
   * locale is set in PHP, assuring that a dot '.' is always
   * used as decimal separator.
   * 
   * @param float $value The value to format.
   * @param int $precision The maximal amount of digits to keep behind the decimal separator.
   * @return string The formatted float.
   */
  public static function formatFloat($value, $precision = 8) {
    return rtrim(rtrim(number_format($value, $precision, '.', ''), '0'), '.');
  }


  /**
   * Tests whether the values are matching with an additinal
   * accuracy setting. This allows floats that are intended
   * to have the same value to be compared but is more save
   * to rounding errors than a direct comparison of the
   * float values.
   *
   * @param float $a
   * @param float $b
   * @param int   $presicion
   * @return bool
   */
  public static function compareFloats($a, $b, $precision = 3) {
    return (abs(($a - $b) / $b) < 1 / pow(10, $precision));
  }

  /**
   * Return the currently smalles gif known to mankind as
   * a base64-encoded string that can be used e.g. as a `src`
   * attribute for an <img> tag.
   *
   * @return string
   */
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


  const COLOR_THIEF_TRANSPARENCY_EXCEPTION = 'Unable to compute the color palette of a blank or transparent image.';

  public static function dominantColor($media, $useCache = true) {
    static $cache     = [];

    if(is_null(static::$fileCache)) static::$fileCache = Cache::instance();

    $root = $media->root();

    if(!$useCache || !array_key_exists($root, $cache)) {
      
      $cacheValue = $useCache ? static::$fileCache->get($media, 'color') : null;
      
      if(!is_null($cacheValue)) {
        $cache[$root] = (string) $cacheValue;
      } else {
        $width    = $media->width();
        $height   = $media->height();
        $pixels   = $width * $height;
        $useThumb = ($pixels > 250000); // Input image has more than 0.25 megapixels
  
        if($useThumb) {
          // Use temporary thumbnail to calculate dominant color
          // to reduce memory and CPU usage

          $hash   = md5(microtime(true));
          $params = [
            'imagekit.lazy'     => false,
            'imagekit.optimize' => false,
            'quality'           => 100,
            'filename'          => "{safeName}-{$hash}-tmp.{extension}",
            'overwrite'         => true,
            'upscale'           => true,
          ];

          if($width > $height) {
            $params['width'] = 500;
          } else {
            $params['height'] = 500;
          }

          // Do color caclulation in thumb file and delete
          // it after done.
          $tmpThumb = new Thumb($media, $params);
          
          if(!is_null($tmpThumb->error)) {
            throw new Exception('Could not create temporary thumbnail for ' . $media->root() . '. Please check your thumb configuration.');
          }

          $tmpFile = $tmpThumb->destination->root;

          try {
            $color = utils::rgb2hex(ColorThief::getColor($tmpFile));
          } catch(RuntimeException $e) {
            if($e->getMessage() == self::COLOR_THIEF_TRANSPARENCY_EXCEPTION) {
              $color = 'transparent';
            }
          }
          
          f::remove($tmpFile);

        } else {
          // get dominant color from source file.

          try {
            $color = utils::rgb2hex(ColorThief::getColor($media->root(), 10));
          } catch(RuntimeException $e) {
            if($e->getMessage() == self::COLOR_THIEF_TRANSPARENCY_EXCEPTION) {
              $color = 'transparent';
            }
          }
        }
          
        if($useCache) {
          static::$fileCache->set($media, 'color', $color);
          $cache[$root] = $color;
        }

      }
    }

    return $cache[$root];
  }

  public static function hasTransparency($media, $useCache = true) {
    static $cache = [];

    if(is_null(static::$fileCache)) static::$fileCache = Cache::instance();

    $root      = $media->root();
    $extension = strtolower($media->extension());
    
    if(in_array($extension, ['jpg', 'jpeg'])) {
      // JPEGs obviously never have an alpha channel
      return false;
    } else {

      $kirby = kirby();

      if($useCache) {
        
        $cacheValue = $useCache ? static::$fileCache->get($media, 'alpha') : null;

        // Try to get alpha value from cache
        if(array_key_exists($root, $cache)) {
          // Cache is already in memory
          return $cache[$root];
        } else if(!is_null($cacheValue)) {
          // Try to load cache from disk
          $cache[$root] = $cacheValue;
          return $cache[$root];
        }
      }

      $hasAlpha = false;

      $driver   = $kirby->option('thumbs.driver');
      $bin      = $kirby->option('thumbs.bin', 'convert');
      $identify = dirname($bin) . DS . 'identify';

      if(!f::exists($identify)) {
        // Falling back to GD driver, if `identify` executable
        // does not exist in same directory, as `convert`.
        $driver = 'gd';
      }

      if($driver === 'im') {
        // If imagemagick is available, use it. The biggest
        // advantage is, that is will not interfere with
        // PHP’s memory limit.
        $command = implode(" ", [$identify, '-verbose', '"' . $root . '"']);
        $output = [];
        
        @exec($command, $output);
        
        if(is_array($output)) {
          preg_match_all('/Channel statistics:.*Alpha:\s*min:\s*(\d+)\s+\(\d(?:\.\d+)?\)\s*/siU', implode($output, "\n"), $matches);

          if(sizeof($matches[1]) > 0) {
            $min = (int) $matches[1][0];
            if($min < 255) {
              $hasAlpha = true;
            }
          }
        }

      } else if($driver === 'gd') {
        // Walk through all pixels using GD library.
        
        if($extension === 'png') {
          $img    = imagecreatefrompng($root);
        } else if($extension === 'gif') {
          $img    = imagecreatefromgif($root);
        } else {
          throw new Exception('Unsupported image format.');
        }
        
        $width     = imagesx($img);
        $height    = imagesy($img);
        $trueColor = imageistruecolor($img);
        $hasAlpha  = false;


        if($trueColor) {

          if($width >= 100 && $height>= 100) {
            // Try to get samples from the image first as a
            // very coarse resolution.
            for($y = 0, $yStep = floor($height / 10); $y < $height; $y += 10) {
              for($x = 0, $xStep = floor($width / 10); $x < $width; $x += 10) {
                if(((imagecolorat($img, $x, $y) & 0x7F000000) >> 24) > 0) {
                  $hasAlpha = true;
                  // As soon as the first transparent pixel was found, there is no reason to continue.
                  break;
                }
              }
            }
          }

          if(!$hasAlpha) {
            // If no transparent pixels where found yet, scan
            // every single pixel to look for a transparent
            // one.
            for($y = 0; $y < $height; $y++) {
              for($x = 0; $x < $width; $x++) {
                if(((imagecolorat($img, $x, $y) & 0x7F000000) >> 24) > 0) {
                  $hasAlpha = true;
                  // As soon as the first transparent pixel was found, there is no reason to continue.
                  break;
                }
              }
              if($hasAlpha) break;
            }
          }

        } else {
          // Indexed Images
          $transparentColor = imagecolortransparent($img);

          if($transparentColor !== -1) {

            if($width >= 100 && $height>= 100) {
              // Try to get samples from the image first as a
              // very coarse resolution.
              for($y = 0, $yStep = floor($height / 10); $y < $height; $y += 10) {
                for($x = 0, $xStep = floor($width / 10); $x < $width; $x += 10) {
                  if(imagecolorat($img, $x, $y) === $transparentColor) {
                    $hasAlpha = true;
                    // As soon as the first transparent pixel was found, there is no reason to continue.
                    break;
                  }
                }
              }
            }

            if(!$hasAlpha) {
              // If no transparent pixels where found yet, scan
              // every single pixel to look for a transparent
              // one.
              for($y = 0; $y < $height; $y++) {
                for($x = 0; $x < $width; $x++) {
                  if(imagecolorat($img, $x, $y) === $transparentColor) {
                    $hasAlpha = true;
                    // As soon as the first transparent pixel was found, there is no reason to continue.
                    break;
                  }
                }
                if($hasAlpha) break;
              }
            }


          }
        }

        imagedestroy($img);
      }

      if($useCache) {
        // Save to cache file      
        static::$fileCache->set($media, 'alpha', $hasAlpha);
        
        // Store in memory for current script execution
        $cache[$root] = $hasAlpha;
      }

      return $hasAlpha;
    }
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

  /**
   * Quick ’n’ Dirty HTML minifier. Removes all line breaks
   * and spaces between elements and also replaces multiple
   * spaces by single spaces. Do not use with regular HTML
   * code, as it might break spacing inline elements and
   * surrounding text and does not respect the contents of
   * <script> or <style> tags.
   * 
   * @param  string $html HTML input to compress.
   * @return string The compressed HTML output.
   * 
   */
  public static function compressHTML($html) {

    // Remove line breaks
    $html = preg_replace('/(\r\n|\n|\r)/siU', '', $html);

    // Remove spaces between HTMl tags
    $html = preg_replace('/>[\r\n\s]+</siU', ">\n<", $html);

    // Remove spaces before closing backet ">" of HTML tags
    $html = preg_replace('/([a-z0-9]|"|\')\s+>/siU', '\1>', $html);

    // Replace multiple spaces by a single space
    do {
      $html = str_replace('  ', ' ', $html);
    } while(strstr($html, '  '));

    return trim($html);
  }
}
