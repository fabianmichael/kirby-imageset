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
   * @const string The attribute used by the Styles
   *               Consolidator component to identify style
   *               block that belong to ImageSet.
   */
  const STYLES_IDENTIFIER_ATTRIBUTE = 'data-imagekit-styles';

  /**
   * @const string CSS selector to match CSS rules that only
   *               apply after ImageSet’s JavaScript has
   *               been executed and the corresponding class
   *               has been added to the `<html>` element.
   */
  const JS_CSS_SELECTOR = '.imageset-js';

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

    // If set to true, will add a trailing slash to all
    // void element’s in the plugin’s HTML output to make
    // it XHTMl compatible. Special chars in the `alt`
    // attribute will also be treated differently to be also
    // XML compatible.
    'output.xhtml'        => false,

    // Alternative text
    'alt'                 => '',

    // The CSS namespace, should not be changed without
    // further adjustments to the JavaScript and CSS
    // configuration.
    'css.namespace'       => 'imageset',
    'lazyload.attr'       => 'data-{attr}',
  ];

  /**
   * @var int Used internally to generate the ImageSet’s
   *          hash value.
   */
  protected static $instanceCount = 0;

  /**
   * @var int ID of this instance of the ImageSet object.
   */
  protected $id                   = 0;

  /**
   * @var array Used to store things like the placeholder or
   *            the unique has value of this ImageSet, so
   *            these value don’t have to be re-calculated
   *            every time they are needed.
   */
  protected $cache = [];
  
  /**
   * Creates a new ImageSet.
   * 
   * @param Media|File $image
   * @param string|array|int $sizes;
   * @param array $options
   * @param Kirby $kirby
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
   * Takes a sizes parameter and transforms it into an array 
   * of SourceSet instances.
   * 
   * @param  array|string|int $sizes Sizes to use on this
   *                                 SourceSet.
   * @return array                   An array of SourcSets
   */
  public function setupSources($sizes) {

    $sources = [];

    if(strtolower($this->image->extension()) === 'svg') {

      $sourceSet = new SourceSet($this->image);
      $sourceSet->push(new Source($this->image, null, $this->kirby));
      $sources[] = $sourceSet;

      return $sources;
    }

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
      
      $options = array_intersect_key(array_merge($this->options, $subSizes[0]), SourceSet::$defaults);
      $sourceSet = new SourceSet($this->image, $options, $this->kirby);
      
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
   * Returns the ID of the current ImageSet.
   * 
   * @return int The id of the imageset, where id is
   *             increased by 1 for each instance of
   *             this class created.
   */
  public function id() {
    return $this->id;
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
        $hash = (int) sprintf('%u', crc32($image->page->uri()));
      } else {
        $hash = (int) sprintf('%u', crc32(url::path()));
      }

      $hash += (int) sprintf('%u', crc32($image->root())) + $this->id();

      $this->cache['hash'] = utils::base62($hash);
    }

    return $this->cache['hash'];
  }

  /**
   * Returns the source image of this ImageSet.
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

  public function alpha() {
    return utils::hasTransparency($this->image());
  }

  /**
   * Returns `true`, if this ImageSet has sizes with at
   * least 2 different aspect-ratios, otherwise `false`.
   * 
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
   * Returns the alternative Text of this ImageSet. Can be
   * set via `alt` option.
   * 
   * @return string Alternative text of this ImageSet
   */
  public function alt() {
    return $this->option('alt');
  }

  /**
   * Returns the corresponding placeholder of this ImageSet,
   * if it has one.
   * 
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
          'style'        => $placeholderStyle,
          'class'        => $this->className('__placeholder'),
          'output.xhtml' => $this->options['output.xhtml'],
        ];

        $this->cache['placeholder'] = Placeholder::create($this->image, $settings, $this->kirby);
      } else {
        $this->cache['placeholder'] = null;
      }
    }

    return $this->cache['placeholder'];
  }

  /**
   * Returns the aspect-ratio of the fallback size.
   * 
   * @return float The aspect-ratio of the fallback size.
   */
  public function ratio() {
    return $this->lastSource()->ratio();
  }

  /**
   * Returns the srcset of the fallback sizes.
   * 
   * @return string A string of comma-separated source
   *                candidates to be used in the `srcset`
   *                attribute.
   */
  public function srcset() {
    return $this->lastSource()->srcset();
  }

  /**
   * Returns the url of the largest image of the fallback size.
   * 
   * @return string The URL of the fallback-image’s largest thumbnail.
   */
  public function src() {
    return $this->lastSource()->src();
  }

  /**
   * Returns all sizes but the the last one. If this ImageSet
   * only has one size, this method will just return an empty
   * array.
   * 
   * @return array An array containg all alternative sizes.
   */
  public function alternativeSources() {
    return ($this->count() > 1) ? array_slice($this->sources, 0, sizeof($this->sources) - 1) : [];
  }

  
  // =====  Output Methods  ================================================= //


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

    $html = $this->kirby->component('snippet')->render('imageset', $data, true);
    
    // Compress all HTML output from snippet into one line
    return utils::compressHTML($html);
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
   * Returns the output style of this ImageSet.
   * If `output` option was not set to `plain`, this method
   * will return `img`, if the ImageSet has only one size or
   * `picture`, if this ImageSet has multiple different
   * sizes.
   * 
   * @return string Either 'picture', 'img' or 'plain'
   */
  public function outputStyle() {
    $style = $this->option('output');

    if($style !== 'auto') {
      // forced style
      return $style;
    }

    return 'normal';
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
   * Returns the class name of this ImageSet’s main `<img>` tag.
   * 
   * @return string The class string of this ImageSet’s main image.
   */
  public function elementClass() {
    $className = [];

    $className[] = $this->className('__element');

    if($this->option('lazyload')) {
      $className[] = '/ lazyload';
    }

    return implode(' ', $className);
  }

  /**
   * Returns the wrapper class.
   * 
   * @return string The wrapping `<span>`’s class attribute value.
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

    if($placeholder = $this->option('placeholder')) {
      $className[] = $this->className('--placeholder');
      $className[] = $this->className('--placeholder--' . $placeholder);
    }

    if($this->hasMultipleRatios()) {
      $className[] = $this->className('--multiple-ratios');
    }

    if($this->alpha()) {
      $className[] = $this->className('--alpha');
    }

    if($this->option('lazyload')) {
      $className[] = $this->className('--lazyload');
    }

    if($cls = $this->option('class')) {
      $className[] = $cls;
    }

    return implode(' ', $className);
  }

  public function placeholderAttribute() {
    if($placeholder = $this->option('placeholder')) {
      return html::attr(['data-placeholder' => $placeholder]);
    } else {
      return '';
    }
  }

  /**
   * Returns a class attribute for the main `<img>` element
   * in plain output mode.
   * 
   * @return string The class html attribute.
   */
  public function imgClassAttribute() {
    return !empty($this->option('class')) ? html::attr(['class' => $this->option('class')]) : '';
  }

  /**
   * Returns CSS rules, if ImageSet has multiple ratios and
   * ratio placeholders enabled.
   * 
   * @return string ImageSet’s CSS rules, if there are any.
   */
  public function cssRules() {
    
    if(!array_key_exists('cssRules', $this->cache)) {
      
      if(!$this->option('ratio') || sizeof($this->sources) === 1 || !$this->hasMultipleRatios()) {
        
        $this->cache['cssRules'] = '';

      } else {
        
        $rules = [];

        $compatMode   = ($this->option('noscript.priority') === 'compatibility');
        $jsSelector   = ($compatMode ? static::JS_CSS_SELECTOR . ' ' : '');
        $important    = ($compatMode ? ' !important' : '');
        $multiple     = $this->hasMultipleRatios();
        $placeholder  = ($this->placeholder() && $this->option('placeholder') !== 'color');

        if($multiple) {
          $imageRatio   = $this->image->ratio();
        }


        foreach(array_reverse($this->sources) as $source) {
          // !important is used to override the fallback ratio set on the `.ratio__fill` element.
          $property   = "padding-top: " . utils::formatFloat(1 / $source->ratio() * 100, 10) . "%{$important};";
          $media      = $source->media();
          
          $rule = "{$jsSelector}.{$this->uniqueClassName()} .{$this->className('__ratio-fill')} { {$property} }";

          if($placeholder && $multiple) {
            $sourceRatio = $source->ratio();
            if(!utils::compareFloats($imageRatio, $sourceRatio)) {
              $selector = "{$jsSelector}.{$this->uniqueClassName()} .{$this->className('__placeholder')}";
              if($sourceRatio > $imageRatio) {
                $rule .= " $selector { width: 100%; height: auto; }";
              } else {
                $rule .= " $selector { height: 100%; width: auto; }";
              }
            }
          }
          //$rule .= "/* " . $source->ratio() . " */";

          if($media) {
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

  /**
   * Checks whether this ImageSet has extra CSS rules that have to be included
   * within a `<style>` element.
   * 
   * @return boolean `true`, if the ImageSet has some CSS rules, otherwise `false`.
   */

  public function hasCssRules() {
    return !empty($this->cssRules());
  }

  /**
   * Returns the styles identifier attribute needed by the
   * Styles Consolidator Component, if
   * `imageset.styles.consolidate` was activated in the 
   * `config.php` file.
   * 
   * @return string The styles identifier attribute preceded
   *                by a space, if style consolidation if
   *                enabled. Otherwise an empty string.
   */
  public function styleIdentifierAttribute() {
    if($this->kirby->option('imageset.styles.consolidate')) {
      return ' ' . static::STYLES_IDENTIFIER_ATTRIBUTE;
    } else {
      return '';
    }
  }

  /**
   * The neccessary `sizes` and `data-sizes` attributes for
   * the main `<img>` element of this ImageSet.
   * 
   * @return string A string of HTML attributes.
   */
  public function sizesAttributes($options = null, $noscript = false) {

    $options     = array_merge($this->options, is_array($options) ? $options : []);
    $attr        = [];
    $multiple    = ($this->lastSource()->count() > 1);
  
    if($this->outputStyle() === 'plain') {
      // Plain output style
      if($multiple) {
        if(!empty($this->sizes())) {
          $attr['sizes'] = $this->sizes();
        } else {
          $attr['sizes'] = '100vw';
        }
      } else {
        // ImageSets with only one size can rely can use the
        // `src` attribute instead of `srcset` and thus
        // don’t need and may not have a sizes attribute.
      }
    } else {
      // Normal output style
      
      if($noscript) {
        if($multiple) {
          $attr['sizes'] = $this->sizes() ?: '100vw';
        }
      } else if($this->count() > 1) {       
        if($options['lazyload']) {
          $attr['data-sizes'] = 'auto';
        }
      } else {       
        if(!empty($this->sizes())) {
          $attr['sizes'] = $this->sizes();
        } else {
          if($options['lazyload']) {
            if($multiple) {
              $attr['sizes']      = '100vw';
              $attr['data-sizes'] = 'auto';
            }
          }
        }

      }
    }

    return html::attr($attr);
  }

  /**
   * The neccessary `src`, `data-src`, 'srcset` and
   * `data-srcset` attributes for the main `<img>`
   * element of this ImageSet.
   * 
   * @return string A string of HTML attributes.
   */
  public function srcAttributes($options = null, $noscript = false) {

    $options     = array_merge($this->options, is_array($options) ? $options : []);
    $attr        = [];
    $multiple    = ($this->lastSource()->count() > 1);
    $outputStyle = $this->outputStyle();

    if($this->outputStyle() === 'plain') {
      // Plain output style
      $attr['src']    = $this->src();
      if($multiple) {
        $attr['srcset'] = $this->srcset();
      }
    } else {
      // Full-featured output style
      
      $attr['src'] = utils::blankInlineImage();

      if($this->count() > 1 && !$noscript) {
        $attr['src'] = utils::blankInlineImage();
      } else {
        if($noscript) {
          $attr['src'] = $this->src();
          if($multiple) {
            $attr['srcset'] = $this->srcset();
          }
        } else {
          if($options['lazyload']) {
            $attr['src']           = utils::blankInlineImage();
            if($multiple) {
              $attr['srcset']      = utils::blankInlineImage() . ' 1w';
              $attr['data-srcset'] = $this->srcset();
            } else {
              $attr['src']         = utils::blankInlineImage();
              $attr['data-src']    = $this->src();
            }
          } else {       
            $attr['src']           = $this->src();
            if($multiple) {
              $attr['srcset']      = $this->srcset();
            }
          }
        }
      }
    }

    return html::attr($attr);
  }

  /**
   * Return the alt attribute, escaping all HTML inside the
   * given alternative text. If XHTML output is enabled,
   * entities will be transformed into XML-compatible markup.
   * Otherwise, only HTML special chars will be escaped.
   * 
   * @return string The alt attribute as string.
   */
  public function altAttribute($options = null) {
    $options   = array_merge($this->options, is_array($options) ? $options : []);
    $alt       = $options['alt'];

    if(empty($alt)) {
      return 'alt=""';
    } else {
      if($options['output.xhtml']) {
        return html::attr('alt', html::encode($alt, false));
      } else {
        return html::attr('alt', htmlspecialchars($alt));
      }
    }
  }


  // =====  Debugging Helper  =============================================== //


  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }
}
