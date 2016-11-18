<?php

/**
 * Helper function for using imageset in templates.
 * 
 * @param  [type] $image  [description]
 * @param  [type] $sizes  [description]
 * @param  [type] $params [description]
 * @return [type]         [description]
 */
function imageset($image, $sizes = null, $params = null) {
  return (new Kirby\Plugins\ImageSet\ImageSet($image, $sizes, $params));
}

// Register file helper method.
kirby()->set('file::method', 'imageset', function($file, $sizes = null, $params = null) {
  return (new Kirby\Plugins\ImageSet\ImageSet($file, $sizes, $params));
});

// class imageset {
//   public static function preset() {

//   }
// }
