<?php

use Kirby\Plugins\ImageSet\ImageSet as ImageSetClass;
use Kirby\Plugins\ImageSet\Presets;

/**
 * Helper function for using imageset in templates.
 * 
 * @param  [type] $image  [description]
 * @param  [type] $sizes  [description]
 * @param  [type] $params [description]
 * @return [type]         [description]
 */
function imageset($image, $sizes = 'default', $options = null) {
  return (new ImageSetClass($image, $sizes, $options));
}

// Register file helper method.
kirby()->set('file::method', 'imageset', function($file, $sizes = 'default', $options = null) {
  return (new ImageSetClass($file, $sizes, $options));
});

class imageset {
  
  /**
   * API functions for getting/setting presets.
   */
  public static function presets($action, $value = null) {
    if($action === 'reset') {
      return presets::reset();
    } else if($action === 'load') {
      return presets::load($value);
    } else if($action === 'save') {
      return presets::save($value);
    } else if($action === 'clear') {
      return presets::clear();
    } else if(is_array($action)) {
      return presets::set($action);
    } else {
      throw new Exception('Unknown presets API method "' . $action . '".');
    }
  }

  public static function outputStyle($style) {
    ImageSetClass::$defaults['output'] = $style;
  }

  /**
   * Static helper method to override imageset defaults in 
   * template files.
   */
  public static function set($key, $value = null) {
    if(is_array($key)) {
      ImageSetClass::$defaults = array_merge(ImageSetClass::$defaults, $key);
    } else {
      ImageSetClass::$defaults[$key] = $value;
    }
  }
}
