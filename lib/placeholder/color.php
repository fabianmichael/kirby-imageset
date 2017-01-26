<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet\Placeholder;

use F;
use Html;
use Kirby\Plugins\ImageSet\Utils;


class Color extends Base {

  protected function __construct($source, $options = [], $kirby = null) {
    parent::__construct($source, $options, $kirby);
  }

  public function make() {
    // Nothing to do here, as we don’t need to create a
    // thumbnail for this placeholder style …
  }

  public function html() {
    
    $attr =[
      'class'       => $this->option('class'),
      'aria-hidden' => 'true',
    ];

    if(strtolower($this->source->extension()) !== 'svg') {
      $attr['style'] = 'background-color: ' . utils::dominantColor($this->source) . ';';
    }

    return html::tag('span', $attr);
  }
  
}
