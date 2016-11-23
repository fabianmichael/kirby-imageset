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
function imageset($image, $sizes = null, $params = null) {
  return (new ImageSetClass($image, $sizes, $params));
}

// Register file helper method.
kirby()->set('file::method', 'imageset', function($file, $sizes = null, $params = null) {
  return (new ImageSetClass($file, $sizes, $params));
});

class imageset {
  public static function presets($action, $value = null) {
    if($action === 'reset') {
      return presets::reset();
    } else if($action === 'load') {
      return presets::load($value);
    } else if($action === 'save') {
      return presets::save($value);
    } else if(is_array($action)) {
      return presets::set($action);
    }
  }
}
