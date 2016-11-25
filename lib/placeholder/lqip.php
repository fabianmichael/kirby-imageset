<?php
/**
 * ImageSet - reponsive, lazyloading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet\Placeholder;

use Html;
use Kirby\Plugins\ImageSet\Utils;


class Lqip extends Base {

  protected function __construct($source, $options = [], $kirby = null) {
    $this->extension = 'jpg';
    parent::__construct($source, $options, $kirby);
  }

  public function make() {
    $this->thumb = $this->source->thumb([
      'imagekit.lazy'            => false,
      'width'                    => 100,
      'quality'                  => 60,
      'blur'                     => true,
      'blurpx'                   => 1,
      'destination'              => [$this, 'destination'],
    ]);
  }

  public function html() {
    
    $width  = $this->thumb->width();
    $height = $this->thumb->height();
    $id     = 'imageset-filter-' . uniqid();

    $html = [
      '<svg color-interpolation-filters="sRGB" viewbox="0 0 ' . $width . ' ' . $height . '" preserveAspectRatio="xMidYMid slice" class="imageset__placeholder" aria-hidden="true">',
      '<filter id="' . $id . '"><feGaussianBlur in="SourceGraphic" stdDeviation="0.75" /></filter>',
      '<image width="' . $width . '" height="' . $height . '" xlink:href="' . $this->thumb->dataUri() . '" filter="url(#' . $id . ')" />',
      '</svg>',
    ];

    return implode('', $html);

    // $color = utils::dominantColor($this->source);
    
    // $img = html::tag('span', [
    //   'style' => 'background-image: url(' . $this->thumb->dataUri() . ');',
    // ]);

    // return html::tag('span', $img, [
    //   'class' => $this->option('class'),
    //   'style' => 'background-color: ' . $color . ';',
    // ]);
  }
}
