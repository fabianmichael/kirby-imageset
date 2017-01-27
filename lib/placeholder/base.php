<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet\Placeholder;

use Exception;
use F;
use Focus; // Focus plugin
use Html;
use Media;
use Obj;
use Kirby\Plugins\ImageSet\Utils;


class Base {

  public $source;
  public $thumb;

  public $options;
  public $style;

  protected $focus;
  
  public static $defaults = [
    'style'        => null,
    'class'        => 'placeholder',
    'alpha'        => false,
    'output.xhtml' => false,

    // Support for focus plugin
    'focus'        => null,
  ];

  protected $extension;
  protected $destination;

  public static function create($source, $options, $kirby = null) {
    
    if(!isset($options['style'])) {
      throw new Exception('Cannot create placeholder without a "style" beeing given.');
    }

    $style = $options['style'];

    if(strtolower($source->extension()) === 'svg') {
      // SVG files do not support rendered placeholders
      $style = 'base';
    }

    $placeholderClass = __NAMESPACE__ . "\\$style";

    if(!class_exists($placeholderClass)) {
      throw new Exception('Unknown placeholder style "' . $style . '".');
    }

    $placeholder = new $placeholderClass($source, $options, $kirby);
    $placeholder->style = $style;

    return $placeholder;
  }
  
  protected function __construct($source, $options = [], $kirby = null) {
    $this->kirby   = !is_null($kirby) ? $kirby : kirby();
    $this->source  = $source;
    $this->options = array_merge(static::$defaults, is_array($options) ? $options : []);

    $this->destination();
    $this->make();
  }

  protected function make() {}

  public function style() {
    return $this->style;
  }

  public function option($name, $value = null) {
    if(!is_null($value)) {
      // setter
      $this->options[$name] = $value;
      return $this;
    } else {
      // getter
      if(array_key_exists($name, $this->options)) {
        return $this->options[$name];
      } else {
        throw new Exception('Trying to access undefined option "' . $name . '" on ' . get_called_class() . '.');
      }
    }
  }

  public function destination() {
    if(empty($this->destination)) {
      $path = $this->path();

      $this->destination = new Obj([
        'root' => $this->kirby->roots()->thumbs() . DS . str_replace('/', DS, $path),
        'url'  => $this->kirby->urls()->thumbs()  . '/' . $path,
      ]);
    }
    
    return $this->destination;
  }

  protected function path() {
    return ltrim(utils::thumbDestinationDir($this->source) . '/' . $this->filename(), '/');
  }

  /**
   * Returns the filename for a thumb including the 
   * identifying option hash
   * 
   * @param Generator $thumb
   * @return string
   */
  protected function filename() {
    if(!empty($this->extension)) {
      $extension = $this->extension;
    } else {
      $extension = $this->source->extension();
    }

    return f::safeName($this->source->name()) . '-placeholder-' . $this->option('style') . '.' . $extension;

  }

  public function html() {
    return html::tag('span', ['class' => 'imageset__placeholder']);
  }

  public function __toString() {
    return $this->html();
  }

  public function isThere() {
    // if the thumb already exists and the source hasn't been updated
    // we don't need to generate a new thumbnail
    if(file_exists($this->destination->root) && f::modified($this->destination->root) >= $this->source->modified()) return true;

    return false;
  }

  public function trailingSlash() {
    return $this->options['output.xhtml'] ? ' /' : '';
  }
  
}
