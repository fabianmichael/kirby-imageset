<?php

namespace Kirby\Plugins\ImageSet\Placeholder;

use Html;
use Kirby\Plugins\ImageSet\Utils;


class Mosaic extends Base {

  protected function __construct($source, $options = [], $kirby = null) {
    $this->extension = 'gif';
    parent::__construct($source, $options, $kirby);
  }

  public function make() {
    
    $wasAlreadyThere = $this->isThere();

    $this->thumb = $this->source->thumb([
      'imagekit.lazy'            => false,
      'imagekit.gifsicle.colors' => 16,
      'width'                    => 8,
      'destination'              => [$this, 'destination'],
    ]);

    if(!$wasAlreadyThere && !utils::optimizerAvailable('gifsicle')) {
      $this->applyMosaicEffect($this->destination->root);
    }
  }

  public function html() {
    return html::img($this->thumb->dataUri(), [
      'class' => $this->option('class'),
      'alt'   => ' ', // one space generates creates empty alt attribute 
      'role'  => 'presentation',
    ]);
  }
 
  // http://php.net/manual/de/function.imagetruecolortopalette.php#44803
  protected function applyMosaicEffect($root, $dither = true, $paletteColors = 16) {  
  
    $image = imagecreatefromgif($root);
    imagepalettetotruecolor($image);
  
    $width        = imagesx($image);
    $height       = imagesy($image);
    $colorsHandle = imagecreatetruecolor($width, $height);
    
    imagecopymerge($colorsHandle, $image, 0, 0, 0, 0, $width, $height, 100);
    imagetruecolortopalette($image, $dither, $paletteColors);
    imagecolormatch($colorsHandle, $image);
    imagedestroy($colorsHandle);
    
    imagegif($image, $root);
  }
}
