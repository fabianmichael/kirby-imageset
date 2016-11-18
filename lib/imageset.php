<?php

namespace Kirby\Plugins\ImageSet;

use Exception;
use F;
use Html;
use Media;
use Str;

use Kirby\Plugins\ImageSet\Placeholder\Base as Placeholder;
use ColorThief\ColorThief;

class ImageSet extends SourceSet {

  use Traits\Template;

  public static $defaults = [
    'css.namespace'       => 'imageset',

    'class'               => '',
    'fallback.noscript'   => true,
    'ratio'               => true,
    'placeholder'         => 'mosaic',
    
    'lazyload'            => true,
    'lazyload.attr'       => 'data-{attr}',

    'output.style'        => 'auto',
    'alt'                 => '',
    'prettyprint'         => true,
    'noscript'            => true,
  ];

  public static $instanceCount = 64161;
  public $id                   = 0;

  protected $placeholder;
  protected $color;

  /**
   * 
   */
  public function __construct($image = null, $sizes = 'default', $options = [], $kirby = null) {
    parent::__construct($image, array_merge(static::$defaults, is_array($options) ? $options : []));
    $this->sources = $this->setupSources($sizes);
    $this->id      = ++static::$instanceCount;
    $this->kirby   = $kirby ?: kirby();
  }

  /**
   * Takes a sizes parameter and transforms it into an array of SourceSet instances.
   * @param  array|string|int $sizes Sizes to use on this SourceSet.
   * @return array An array of SourcSets
   */
  public function setupSources($sizes) {

    $sources = [];

    if(!is_array($sizes) || utils::isArrayAssoc($sizes)) {
       // Single size given, wrap in array
       $sizes = [ $sizes ];
    }

    foreach($sizes as $size) {
      $subSizes = static::parseSizesDescriptor($size);
      
      if(!isset($subSizes[0])) {
        continue;
      }
      
      $sourceSet = new SourceSet($this->image, array_intersect_key($subSizes[0], SourceSet::$defaults), $this->kirby);
      
      foreach($subSizes as $subSize) {
        $sourceSet[] = new Source($this->image, $subSize, $this->kirby);
      }

      $sources[] = $sourceSet;
    }

    return $sources;
  }

  /**
   * Transforms a Single Sizes descriptor into an array of
   * thumbnail creation instructions.
   *
   * array|string|int $sizes
   * @return array An array of Thumb creation params.
   */
  public static function parseSizesDescriptor($sizes) {
    $values = [];

    if(utils::isArraySequential($sizes) && sizeof($sizes) === 1 && is_string($sizes[0])) {
      // Unwrap ['200,400'] etc.
      $sizes = $sizes[0];
    }

    if(is_string($sizes) || is_int($sizes)) {

      $sizes = trim($sizes);

      if(preg_match('/^(\d+)\s*(?:,\s*(\d+))*$/', $sizes)) {
         // "200" or "200,400,600"
        foreach(array_map('intval', explode(',', $sizes)) as $value) {
          if($value < 1) {
            throw new Exception('Image dimensions must have value of 1 or greater.');
          }

          $values[] = ['width' => (int) $value];
        }

      } else if(preg_match('/^(\d+)-(\d+)\s*(?:,\s*(\d+))?$/', $sizes, $matches)) {
        // '200-600' or '200-600,3'
        //         
        $min          = (int) $matches[1];
        $max          = (int) $matches[2];
        $intermediate = isset($matches[3]) ? (int) $matches[3] : 2;
        
        if($min >= $max || $min === 0 || $max === 0) {
          throw new Exception('Min size must be smaller than max size and both numbers must be greater zero.');
        }

        if($intermediate < 1) {
          throw new Exception('Intermediate sizes must be equal 1 or greater.');
        }

        $step = ($max - $min) / ($intermediate + 1);
        
        for($i = 0; $i < $intermediate + 2; $i++) {
          $values[] = ['width' => (int) ceil($min + ($i * $step))];
        }

      } else if(preg_match('/^(\d+(?:x\d+)?)\s*(?:,\s*(\d+(?:x\d+)?))*$/', $sizes, $matches)) {
        // '200x400,600x400'

        for($i = 1; $i < sizeof($matches); $i++) {
          list($width, $height) = array_map('intval', explode('x', $matches[$i]));

          if($width < 1 || $height < 1) {
            throw new Exception('Width and height parameters for cropped thumbnails must be both numbers greater zero.');
          }

          $values[] = ['width' => $width, 'height' => $height, 'crop' => true];
        }

      } else {
        throw new Exception('Unrecognized sizes string from imageset.');
      }

    } else if(is_array($sizes)) {
      if(!utils::isArrayAssoc($sizes)) {
        
        if(sizeof($sizes) === 1 && Utils::isArraySequential($sizes[0])) {
          // Remove unnecessary wrapper array if there is one.
          $sizes = $sizes[0];
        }

        foreach($sizes as $i => $value) {
          // [200, 300, 400] etc.
          $value = (int) $value;
          if(!is_int($i) || $value < 1) {
            throw new Exception('A size must be an indexed array of integers greater zero.');
          }
          $values[] = ['width' => $value];
        }
      } else if(isset($sizes[0])) {
        // [$image, '200-600'] or ['200-600']
        
        $image = null;
        if(isset($sizes[1]) && is_object($sizes[1])) {
          $image = $sizes[1];
          unset($sizes[1]);
        }
        
        $subSizes = static::parseSizesDescriptor($sizes[0]);
        unset($sizes[0]);

        foreach($subSizes as $size) {
          $values[] = array_merge($sizes, $size);
        }
      }

    } else if(isset($sizes[0])) {
      throw new Exception('Unrecognized sizes parameter.');
    }

    return $values;
  }


  public function image() {
    return $this->image;
  }

  /**
   *  Returns the dominant color of the imageset’s source
   *  image. As this calculation is very expensive, the color
   *  is always cached in a file.
   *
   *  @return string An HTML hes representation of the color (e.g. #cccccc)
   */
  public function color() {

    if(!$this->color) {
      $image     = $this->image();
      $cacheFile = utils::thumbDestinationDir($image);
      $cacheFile = $this->kirby->roots()->thumbs() . DS . str_replace('/', DS, $cacheFile) . DS . $image->filename() . '-color.cache';

      if(!f::exists($cacheFile) || (f::modified($cacheFile) < $image->modified())) {
        $this->color = ColorThief::getColor($this->image()->root(), max(20, round($image->width() / 50)));
        $this->color = utils::rgb2hex($this->color);
        f::write($cacheFile, $this->color); 
      } else {
        $this->color = f::read($cacheFile);
      }
    }

    return $this->color;
  }

  /**
   * Returns the HTML representation of this Imageset
   *
   * @return string
   */
  public function html() {

    $sources = [];
    $image   = null;    

    // $sourcesCount = sizeof($this->sources);
    // for($i = 0; $i < $sourcesCount; $i++) {
    //   $source = $this->sources[$i];

    //   if($i < $sourcesCount - 1) {
    //     $sources[] = $source;
    //   } else {
    //     if(!empty($source->media())) {
    //       throw new Exception('The last image size that is specified must not have a media attribute, because it‘s treated as fallback.');          
    //     }
        
    //     $image = $source;
    //   }
    // }

    $data = [
      'imageset' => $this,
      'sources'  => $this->sources,
    ];

    return $this->kirby->component('snippet')->render('imageset', $data, true);
  }

  /**
   * Returns the HTML representation of this Imageset
   *
   * @return string
   */
  public function __toString() {
    return $this->html();
  }

  public function hasMultipleRatios() {
    $ratios = [];
    foreach($this->sources as $source) {
      $ratios[] = (string) utils::formatFloat($source->ratio(), 8);
    }

    return (sizeof(array_unique($ratios)) !== 1);
  }



  public function alt() {
    return $this->option('alt');
  }


  public function placeholder() {
    if(!$this->option('placeholder') && !$this->option('ratio')) {
      return null;
    }

    if(is_null($this->placeholder)) {
      $this->placeholder = Placeholder::create($this->image, ['style' => $this->option('placeholder'), 'class' => $this->className('__placeholder')], $this->kirby);
    }

    return $this->placeholder;
  }

  public function outputStyle($value = null) {
    if(!is_null($value)) {
      // setter 
      return $this->option('output.style', $value);
    } else {
      $style = $this->option('output.style');

      if($style !== 'auto') {
        // forced style
        return $style;
      }

      // calculate output style
      if(sizeof($this->sources) > 1) {
        return 'picture';
      } else {
        return 'img';
      }
    }
  }

  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }
}
