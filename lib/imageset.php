<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;

use Exception;
use F;
use Html;
use Media;
use Str;

use Kirby\Plugins\ImageSet\Placeholder\Base as Placeholder;
use ColorThief\ColorThief;


/**
 * The main class of ImageSet, holding an array of
 * SourceSets, comparable to to HTML5 picture element. ALso
 * defines how an ImageSet should behave in terms of
 * lazyloading, output style and placeholder.
 */
class ImageSet extends SourceSet {

  /**
   * @var array An associative array holding the default
   *            options ImageSets.
   */
  public static $defaults = [
    // User-defined class, added to the imageset.
    'class'               => '',

    // Include an intrinsic ratio to avoid reflows upon
    // images are loaded.
    'ratio'               => true,


    // Style of the placeholder image.
    'placeholder'         => 'mosaic',

    // Lazyload imageset?
    'lazyload'            => true,

    // Should the resulting code contain a fallback
    // for devices with disabled JavaScript/No JavaScript
    // support?
    'noscript'            => true,
    'noscript.priority'   => 'ratio', // ratio | compatibility
    

    // Output style
    'output'              => 'auto',
    
    // Alternative text
    'alt'                 => '',

    // The CSS namespace, should not be changed without
    // further adjustments to the JavaScript and CSS
    // configuration.
    'css.namespace'       => 'imageset',
    'lazyload.attr'       => 'data-{attr}',
  ];

  protected static $instanceCount = 0;
  protected $id                   = 0;
  protected $cache = [];
  
  /**
   * Creates a new ImageSet.
   * 
   * @param Media|File $image
   * @param string|array|int $sizes;
   * @param array $options
   * @param Kirby $paramname
   */
  public function __construct(Media $image = null, $sizes = 'default', $options = null, Kirby $kirby = null) {
    parent::__construct($image, array_merge(static::$defaults, is_array($options) ? $options : []));
    $this->sources = $this->setupSources($sizes);
    $this->id      = ++static::$instanceCount;
    $this->kirby   = $kirby ?: kirby();
  }

  /**
   * Loads the settings defined in your `config.php` file
   * and overrides the plugin defaults.
   * 
   * @param $kirby The Kirby instance to read settings from.
   */
  public static function loadConfig($kirby = null) {
    $kirby = $kirby ?: kirby();

    foreach(static::$defaults as $key => $value) {
      $configValue = $kirby->option("imageset.$key");
      if(!is_null($configValue)) {
        static::$defaults[$key] = $configValue;
      }
    }
  }

  /**
   * Takes a sizes parameter and transforms it into an array of SourceSet instances.
   * @param  array|string|int $sizes Sizes to use on this SourceSet.
   * @return array An array of SourcSets
   */
  public function setupSources($sizes) {

    $sources = [];
    $sourceWidth  = $this->image->width();
    $sourceHeight = $this->image->height();

    if(is_string($sizes) && presets::exists($sizes)) {
      // Load preset if set
      $sizes = presets::get($sizes);
    }

    if(!is_array($sizes) || utils::isArrayAssoc($sizes)) {
       // Single size given, wrap in array
       $sizes = [$sizes];
    }

    foreach($sizes as $size) {
      $subSizes = static::parseSizesDescriptor($size);
      
      if(!isset($subSizes[0])) {
        continue;
      }
      
      $sourceSet = new SourceSet($this->image, array_intersect_key($subSizes[0], SourceSet::$defaults), $this->kirby);
      
      foreach($subSizes as $subSize) {

        if(@$subSize['upscale'] || @$subSize['blur'] || @$subSize['crop']) {
          // Always add a source, if upscaling, cropping or
          // blur filter is enabled. Mimicking the behaviour
          // of Kirby’s thumbs API.
          $addSource = true;
        } else if((isset($subSize['width'])  && $subSize['width']  <= $sourceWidth) ||
                  (isset($subSize['height']) && $subSize['height'] <= $sourceHeight)) {
          // If upscaling cropping and blur are disabled,
          // only add size if source image is large enough.
          $addSource = true;
        } else {
          $addSource = false;
        }

        if($addSource) {
          $sourceSet->push(new Source($this->image, $subSize, $this->kirby));
        }
      }

      if($sourceSet->count() === 0) {
        // Don’t create empty source sets!
        $sourceSet->push($this->image);
      }

      $sources[] = $sourceSet;
    }

    return $sources;
  }

  /**
   * @return int The id of the imageset, where id is
   *             increased by 1 for each instance of
   *             this class created.
   */
  public function id() {
    return $this->id;
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
        
        $sizes = array_map('intval', explode(',', $sizes));
        sort($sizes, SORT_NUMERIC);

        foreach($sizes as $value) {
          if($value < 1) {
            throw new Exception('Image dimensions must have value of 1 or greater.');
          }

          $values[] = ['width' => (int) $value];
        }

      } else if(preg_match('/^(\d+)\s*-\s*(\d+)\s*(?:,\s*(\d+))?$/', $sizes, $matches)) {
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
          $values[] = ['width' => (int) round($min + ($i * $step))];
        }

      } else if(preg_match('/^(\d+x\d+)\s*(?:,\s*(\d+x\d+))*$/', $sizes, $matches)) {
        // '200x400,600x400'

        for($i = 1; $i < sizeof($matches); $i++) {
          list($width, $height) = array_map('intval', explode('x', $matches[$i]));

          if($width < 1 || $height < 1) {
            throw new Exception('Width and height parameters for cropped thumbnails must be both numbers greater zero.');
          }

          $values[] = ['width' => $width, 'height' => $height, 'crop' => true];
        }

      } else if(preg_match('/^(\d+x\d+)\s*-\s*(\d+x\d+)\s*(?:,\s*(\d+))?$/', $sizes, $matches)) {
        // '300x200-600x400' or '300x200-600x400,3'
        list($minW, $minH) = array_map('intval', explode('x', $matches[1]));
        list($maxW, $maxH) = array_map('intval', explode('x', $matches[2]));
        $intermediate      = isset($matches[3]) ? (int) $matches[3] : 2;

        if($minW === 0 || $minH === 0 || $maxW === 0 || $maxH === 0) {
          throw new Exception('Any value must not be zero.');
        }

        if($minW >= $maxW || $minH >= $maxH) {
          throw new Exception('Minimum size must not be greater than maximum size');
        }

        if(!utils::compareFloats($minW / $minH, $maxW / $maxH)) {
          throw new Exception('Apsect-ratio of minium and maximum sizes must match.');
        }

        if($intermediate < 1) {
          throw new Exception('Intermediate sizes must be equal 1 or greater.');
        }

        $stepW = ($maxW - $minW) / ($intermediate + 1);
        $stepH = ($maxH - $minH) / ($intermediate + 1);
        
        for($i = 0; $i < $intermediate + 2; $i++) {
          $values[] = [
            'width'  => (int) round($minW + ($i * $stepW)),
            'height' => (int) round($minH + ($i * $stepH)),
            'crop'   => true,
          ];
        }

      } else {
        throw new Exception('Unrecognized sizes string from imageset.');
      }

    } else if(is_array($sizes)) {

      if(!utils::isArrayAssoc($sizes)) {
  
        if(sizeof($sizes) === 1 && utils::isArraySequential($sizes[0])) {
          // Remove unnecessary wrapper array if there is one.
          $sizes = $sizes[0];
        }

        $sizes = array_map('intval', $sizes);
        sort($sizes, SORT_NUMERIC);

        foreach($sizes as $i => $value) {
          // [200, 300, 400] etc.
          if($value < 1) {
            throw new Exception('A size must be a numeric array of integers greater zero.');
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

  /**
   * Generates and returns a hash based on the page of
   * imageset’s main image, image filename and instance id.
   * 
   * @return string A hash string that can be used as a
   *                unique identifier for this imageset 
   *                for targeting it with CSS rules.
   */
  public function hash() {
    if(!isset($this->cache['hash'])) {

      $image = $this->image();
      $hash  = [];

      if(is_a($image, 'File')) {
        $hash[] = $image->page->hash();
      } else {
        $hash[] = base_convert(sprintf('%u', crc32(url::path())));
      }
      
      $hash[] = base_convert(sprintf('%u', crc32($image->root())) + $this->id(), 10, 36);

      $this->cache['hash'] = implode('', $hash);
    }

    return $this->cache['hash'];
  }


  /**
   * Returns the main image of this ImageSet
   * 
   * @return File|Media
   */
  public function image() {
    return $this->image;
  }

  /**
   *  Returns the dominant color of the imageset’s source
   *  image. As this calculation is very expensive, the
   *  resulting color is always cached in a file.
   * 
   *  @return string An HTML hes representation of the color (e.g. #cccccc)
   */
  public function color() {

    if(!array_key_exists('color', $this->cache)) {
      $image     = $this->image();
      $cacheFile = utils::thumbDestinationDir($image);
      $cacheFile = $this->kirby->roots()->thumbs() . DS . str_replace('/', DS, $cacheFile) . DS . $image->filename() . '-color.cache';

      if(!f::exists($cacheFile) || (f::modified($cacheFile) < $image->modified())) {
        $color = ColorThief::getColor($this->image()->root(), max(20, round($image->width() / 50)));
        $color = utils::rgb2hex($color);
        f::write($cacheFile, $color); 
        $this->cache['color'] = $color;
      } else {
        $this->cache['color'] = f::read($cacheFile);
      }
    }

    return $this->cache['color'];
  }


  /**
   * Returns the full classname for a partial of this
   * imageset, with CSS namespace prepended.
   * 
   * @param  string The class name that should be prefixed.
   * @return string Namespaced CSS class name.
   */
  public function className($className = '') {
    return $this->option('css.namespace') . $className;
  }

  /**
   * Returns the unique classname of this imageset, can
   * be used for targeting it with CSS rules.
   * 
   * @return string Unique CSS class name of this imageset.
   */
  public function uniqueClassName() {
    return $this->className('--' . $this->hash());
  }

  /**
   * Returns the wrapper class.
   * 
   * @return string
   */
  public function wrapperClass() {
    $className = [];

    $className[] = $this->className();

    if($this->hasMultipleRatios()) {
      $className[] = $this->uniqueClassName();
    }

    if($this->option('ratio') || $this->option('placeholder') || $this->option('lazyload')) {
      $className[] = $this->className('--ratio');
    }

    if($this->hasMultipleRatios()) {
      $className[] = $this->className('--multiple-ratios');
    }

    if($this->option('lazyload')) {
      $className[] = $this->className('--lazyload');
    }

    if($placeholder = $this->option('placeholder')) {
      $className[] = $this->className('--placeholder--' . $placeholder);
    }

    if($cls = $this->option('class')) {
      $className[] = '/';
      $className[] = $cls;
    }

    return implode(' ', $className);
  }

  /**
   * Returns the class name of this ImageSet’s main `<img>` tag.
   */
  public function elementClass() {
    $className = [];

    $className[] = $this->className('__element');

    if($this->option('lazyload')) {
      $className[] = '/';
      $className[] = 'lazyload';
    }

    return implode(' ', $className);
  }

  /**
   * Returns CSS rules, if ImageSet has multiple ratios and
   * ratio placeholders enabled.
   * 
   * @return string A multip
   */
  public function cssRules() {
    
    if(!array_key_exists('cssRules', $this->cache)) {
      
      if(!$this->option('ratio') || sizeof($this->sources) === 1 || !$this->hasMultipleRatios()) {
        
        $this->cache['cssRules'] = '';

      } else {
        
        $rules = [];

        $compatMode = ($this->option('noscript.priority') === 'compatibility');
        $jsSelector = ($compatMode ? '.js ' : '');
        $important  = ($compatMode ? ' !important' : '');

        foreach(array_reverse($this->sources) as $source) {
          // !important is used to override the fallback ratio set on the `.ratio__fill` element.
          $property   = "padding-top: " . utils::formatFloat(1 / $source->ratio() * 100, 10) . "%{$important};";
          
          $rule = "{$jsSelector}.{$this->uniqueClassName()} .{$this->className('__ratio-fill')} { {$property} }";

          if($media = $source->media()) {
            $rule = '@media ' . $media . ' { ' . $rule . ' }';
          } else if ($compatMode) {
            $rule = '';
          }

          if(!empty($rule)) {
            $rules[] = $rule;
          }
        }

        $this->cache['cssRules'] = implode(' ', $rules);
      }
    }

    return $this->cache['cssRules'];
  }

  public function hasCssRules() {
    return !empty($this->cssRules());
  }

  /**
   * Returns the HTML representation of this Imageset
   *
   * @return string The HTML represenation of this ImageSet.
   */
  public function html() {

    $sources = [];
    $image   = null;    

    $data = [
      'imageset' => $this,
    ];

    return $this->kirby->component('snippet')->render('imageset', $data, true);
  }

  /**
   * Returns the HTML representation of this Imageset
   *
   * @return string The HTML represenation of this ImageSet.
   */
  public function __toString() {
    return $this->html();
  }

  /**
   * @return bool Returns `true`, if this imageset has
   *              multiple aspect ratios, otherwise `false`.
   */
  public function hasMultipleRatios() {
    $ratios = [];
    foreach($this->sources as $source) {
      $ratios[] = (string) utils::formatFloat($source->ratio(), 8);
    }

    return (sizeof(array_unique($ratios)) !== 1);
  }

  /**
   * @return string Alternative text of this ImageSet
   */
  public function alt() {
    return $this->option('alt');
  }

  public function styleIdentifierAttribute() {
    if($this->kirby->option('imageset.styles.consolidate')) {
      return ' data-imagekit-styles';
    } else {
      return '';
    }
  }

  /**
   * @return Kirby\Plugins\ImageSet\Placeholder\Base Returns the placeholder, if activated in options.
   */
  public function placeholder() {
    if(!$this->option('placeholder') && !$this->option('ratio')) {
      return null;
    }

    if(!array_key_exists('placeholder', $this->cache)) {
      $placeholderStyle = $this->option('placeholder');

      if($placeholderStyle !== false) {
        $settings = [
          'style' => $placeholderStyle,
          'class' => $this->className('__placeholder')
        ];

        $this->cache['placeholder'] = Placeholder::create($this->image, $settings, $this->kirby);
      } else {
        $this->cache['placeholder'] = null;
      }
    }

    return $this->cache['placeholder'];
  }

  /**
   * @return string Either 'picture', 'img' or 'plain'
   */
  public function outputStyle() {
    $style = $this->option('output');

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

  public function ratio() {
    return $this->lastSource()->ratio();
  }

  public function srcset() {
    return $this->lastSource()->srcset();
  }

  public function src() {
    return $this->lastSource()->src();
  }

  public function sizesAttributes($lazyload = null) {
    return $this->lastSource()->sizesAttributes($lazyload);
  }

  // =====  Debugging Helper  =============================================== //

  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }
}
