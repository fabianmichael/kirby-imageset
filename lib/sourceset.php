<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;

use A;
use Exception;
use Html;


class SourceSet {

  public $image;
  public $sources = [];
  public $options = [];

  public static $defaults  = [
    'media'        => '',
    'sizes'        => '',
    'attr'         => [],
    'descriptor'   => 'width',
    'lazyload'     => true,
    'output.xhtml' => false,
  ];

  public function __construct($image = null, $options = [], $kirby = null) {
    $this->image   = $image;
    $this->options = array_merge(self::$defaults, $options);
    $this->kirby   = $kirby ?: kirby();
  }

  public function push($source) {
    $this->sources[] = $source;
  }

  public function option($key, $default = null) {
    return a::get($this->options, $key, $default);
  }

  public function firstSource() {
    return isset($this->sources[0]) ? $this->sources[0] : null;
  }

  public function lastSource() {
    $last = sizeof($this->sources) - 1;
    return isset($this->sources[$last]) ? $this->sources[$last] : null;
  }

  public function count() {
    return count($this->sources);
  }

  public function sources() {
    return $this->sources;
  }

  public function descriptor() {
    return 'width';
  }
  
  public function media() {
    return $this->option('media');
  }

  public function density() {
    return 1;
  }

  public function sizes() {
    return $this->option('sizes');
  }

  public function src() {
    if($this->lastSource() instanceof Source) {
      return $this->lastSource()->src();
    } else {
      // File or Media object
      return $this->lastSource()->url();
    }
  }

  public function ratio() {
    return $this->lastSource()->ratio();
  }

  public function srcset() {
    $srcset = [];

    foreach($this->sources as $source) {
      
      if($source instanceof SourceSet) {
        $srcset[] = $source->srcset();
      } else {
        $srcset[] = $source->url() . ' ' . ($this->descriptor() === 'width' ? $source->width()   . 'w' : $source->density() . 'x'); 
      }
    }
      
    return implode(', ', $srcset);
  }


  // =====  Output Methods  ================================================= //


  public function tag($options = null) {

    $options = array_merge($this->options, is_array($options) ? $options : []);
    $attr    = [];

    if($options['lazyload']) {
      $attr['srcset']      = utils::blankInlineImage() . ' 1w';
      $attr['data-srcset'] = $this->srcset();
    } else {
      $attr['srcset'] = $this->srcset();
    }

    if(!empty($this->media())) {
      $attr['media'] = $this->media();
    }

    $attr = array_merge(
      $attr,
      $options['attr'],
      $this->getSizesAttributes($options)
    );

    $tag = html::tag('source', $attr);
    
    if($options['output.xhtml']) {
      $tag = substr_replace($tag, ' /', strlen($tag) - 1, 0);
    }

    return $tag;
  }

  public function getSizesAttributes($options = null) {
    
    $options  = array_merge($this->options, is_array($options) ? $options : []);
    $attr     = [];
    $multiple = ($this->count() > 1);

    if($multiple) {
      if(!empty($this->sizes())) {
        $attr['sizes'] = $this->sizes();
      } else {
        $attr['sizes'] = '100vw';
        if($options['lazyload']) {
          $attr['data-sizes'] = 'auto';
        }
      }
    }

    return $attr;
  }

  public function sizesAttributes($options = null) {
    return html::attr($this->getSizesAttributes($options));
  }

  public function trailingSlash() {
    return $this->option('output.xhtml') ? ' /' : '';
  }

  public function __toString() {
    return $this->tag();
  }


  // =====  Debugging Helper  =============================================== //


  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }
}
