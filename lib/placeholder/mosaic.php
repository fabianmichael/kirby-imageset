<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet\Placeholder;

use Exception;
use Html;
use Kirby\Plugins\ImageSet\Utils;


class Mosaic extends Base {

  protected function __construct($source, $options = [], $kirby = null) {
    $this->extension = utils::hasTransparency($source) ? 'png' : 'gif';
    parent::__construct($source, $options, $kirby);
  }

  public function make() {
    
    $wasAlreadyThere = $this->isThere();

    $params = [
      'imagekit.lazy'            => false,
      'imagekit.gifsicle.colors' => 16,
      'destination'              => [$this, 'destination'],
    ];

    // if($this->source->height() > $this->source->width()) {
    //   $params['width'] = 8;
    // } else {
    //   $params['height'] = 8;
    // }
    $params['width'] = 8;

    $this->thumb = $this->source->thumb($params);

    if(!$wasAlreadyThere && !utils::optimizerAvailable('gifsicle')) {
      $this->applyMosaicEffect($this->destination->root);
    }
  }

  public function html() {
    $attr = [
      'src'          => $this->thumb->dataUri(),
      'class'        => $this->option('class'),
      'alt'          => ' ', // one space generates creates empty alt attribute 
      'aria-hidden'  => 'true',
    ];

    return '<img ' . html::attr($attr) . $this->trailingSlash() . '>';
  }
 
  // http://php.net/manual/de/function.imagetruecolortopalette.php#44803
  protected function applyMosaicEffect($root, $dither = true, $paletteColors = 16) {  
    
    if($this->extension === 'png') {
      $image = imagecreatefrompng($root);
    } else {
      $image = imagecreatefromgif($root);
    }
    
    imagepalettetotruecolor($image);
  
    $width        = imagesx($image);
    $height       = imagesy($image);
    $colorsHandle = imagecreatetruecolor($width, $height);
    
    imagecopymerge($colorsHandle, $image, 0, 0, 0, 0, $width, $height, 100);
    imagetruecolortopalette($image, $dither, $paletteColors);
    imagecolormatch($colorsHandle, $image);
    imagedestroy($colorsHandle);
    
    if($this->extension === 'png') {
      imagegif($image, $root);
    } else {
      imagepng($image, $root);
    }
  }
  
}
