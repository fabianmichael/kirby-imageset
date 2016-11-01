<?php

namespace Kirby\Plugins\ImageSet;

use Exception;
use Media;

class ImageSet {

  use Traits\SourceSet;

  // ~~<source srcset="a.jpg 4100w, a.jpg 1x" type="image/jpeg" media="min-width: 400px">~
  // <img src="a.jpg" srcset="b.jpg 1x, c.jpg 2x" alt="" class="imageset__image">
  // <img src="a.jpg" alt="">

  // imageset::simple()
  // imageset::picture()
  // imageset::srcset()
  // 
  // Sources
  
  // - a 1x, b 2x, c 2x
  
  // - 1x: a, b, c
  // - 2x: a@2x, b@2x, c@2x
  // 
  // [200, 400, 500, 600]
  // [
  //   ['width' => 200, 'media' => '…'],
  //   ['width' => 400, 'media' => '…'],
  // ]
  // 
  // [
  //   ['width' => [200, 400, 600], 'ratio' => 1,    'media' => '…'], 
  //   ['width' => [600, 800, 100], 'ratio' => '16:9', 'media' => '…'], 
  // ]
  // 
  // 
  // 
  // echo imageset($image, [
  //   ['width' => 200],
  //   ['width' => 400],
  // ]);
  // 
  // echo imageset($image, '200-600');
  // echo imageset($image, '200-600,1'); => 200, 400, 600
  // echo imageset($image, '200-600,2'); => 200, 333, 467, 600
  // 
  // echo imageset($image, '200,400,600');
  // 
  // echo imageset($image, [200, 400, 600]);
  // 
  // echo imageset($image, [
  //   [ 'width' => 400, 'ratio' => 1, 'media' => '(max-width: 600px)' ],
  //   [ 'width' => [600, 800, 1200] ],
  // ]);
  // 
  // echo imageset([
  //   [$image, 'width' => 400, 'ratio' => 1]
  // ]);
  // 
  // # Sizes by height
  // 
  // 
  // echo imageset($image, 600);
  // 
  // echo imageset($image, [
  //   [ 'height' => [200,400,600] ],
  // ]);
  // 
  // echo imageset($image, [
  //  [ 'height' => '200,400,600' ],
  // ])
  // 
  // echo imageset($image, [
  //   [ 'height' => '200-600,2' ]
  // ])
  // 
  // echo imageset($image, '200-600')
  // 
  // 
  // # Sizes by width*height
  // 
  // ~~echo imageset($image, '200x133,640x480') // Fit in dimensions
  // 
  // ~~echo imageset($image, '200x133c') // Crop
  // 
  // ImageSet:  Allgemeiner Container, enthält alle Informationen
  // SourceSet: Eine oder mehrere Thumbnails mit Informationen wie Media,
  // Source:    Repräsentation eines Bildes in einer oder mehrere Größen

  public $image;
  public $sources;
  //public $sizes;
  public $params = [];

  // protected $options = [
  //   'placeholder'  => false,
  //   'sizes'        => false,
  //   'density'      => [
  //     [ 1, false ],
  //     [ 2, 1.1   ],
  //   ],
  // ];

  public function __construct($image = null, $sizes = 'default', $params = null, $options = null) {

    if(is_null($image) || !($image instanceof Media)) {
      throw new Exception('$image argument must be an instance of Media.');
    }

    print_r($options);

    $this->image   = $image;
    $this->params  = array_merge($this->params,  is_array($params)  ? $params  : []);
    $this->options = array_merge($this->options, is_array($options) ? $options : []);

    $this->setupSources($sizes);
    
    // echo '<pre>';
    // print_r($this->sources);
    // echo '</pre>';

    // if(is_array($sizes)) {

    //   if(utils::isArrayAssoc($sizes)) {
    //     // Single size given as associative array is
    //     // wrapped in a numeric array.
    //     $sizes = [ $sizes ];
    //   }

    //   if(utils::isArrayAssoc($sizes[0])) {
    //     $this->sizes = [];

    //     // multiple sizes given, each one has to be an associative array
    //     foreach($sizes as $size) {
    //       if(!utils::isArrayAssoc($size)) {
    //         throw new Exception('Invalid sizes parameter');
    //       }

    //       if(isset($size['width'])) {
    //         $size['width'] = static::parseSizesParameter($size['width']);
    //       }
          
    //       if(isset($size['height'])) {
    //         $size['height'] = static::parseSizesParameter($size['height']);
    //       }

    //       $this->sizes[] = $size;        
    //     }
    //   }

    // } else {
    //   try {
    //     $this->sizes = [ [ 'width' => static::parseSizesParameter($sizes) ] ];
    //   } catch(Exception $e) {
    //     throw $e;
    //   }

    //}


    //$this->normalizeSources($sizes);


    // if(is_array($sizes)) {
    //   $this->add($sizes);
    // } else if(is_string($sizes) && preset::exists($sizes)) {
    //   $this->add(preset::get($sizes));
    // }
  }

  public function setupSources($sizes) {

    if(!is_array($sizes) || utils::isArrayAssoc($sizes)) {
       // Single size given, wrap in array
       $sizes = [$sizes];
    }

    foreach($sizes as $size) {
      echo "s:";
      var_dump($size);
      $subSizes = static::parseSizesParameter($size);
      $sourceSet = new SourceSet($this->image);
      foreach($subSizes as $subSize) {
        $sourceSet->add(new Source($this->image, $subSize));
      }

      $this->add($sourceSet);
    }

    
    // $sourceset = new SourceSet($this->image);
    // foreach(static::parseSizesParameter($sizes) as $size) {
    //   var_dump($size);
    // //   $sourceset->add(new Source($this->image, array_merge($this->params, [
    // // //         'width' => $width,
    // // //       ])));
    // } 

      //var_dump($size);

    //   $sourceset = new SourceSet($this->image);
    
    //   if(Utils::isArrayAssoc($size)) {
    //     //if(is_array($width))
    //     $sourceset->add(new SourceSet($this->image, array_merge($this->params, $size)));
    //     //$this->sources[] = 

    //     //;new SourceSet($this->image, array_merge($this->params, $size));
    //   } else if (Utils::isArraySequential($size)) {
    //     // var_dump($size);
    //     // die("young!");
    //     foreach($size as $width) {
    //       $sourceset->add(new Source($this->image, array_merge($this->params, [
    //         'width' => $width,
    //       ])));
    //     }
    //     // var_dump($this->params); exit;
    //      // $sourceset->add(new Source($this->image, array_merge($this->params, [
    //      //  'width' => $size,
    //     //])));
    //   }
      
    //   $this->sources[] = $sourceset;
    // }
  }


  public static function parseSizesParameter($sizes) {

    $values = [];

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
        
        $subSizes = static::parseSizesParameter($sizes[0]);
        unset($sizes[0]);

        foreach($subSizes as $size) {
          $values[] = array_merge($sizes, $size);
        }



        // static::parseSizesParameter($sizes[0])
        // foreach($subsizes as $size) {
        // $value = [];

        // if(isset($sizes[1]) && is_object($sizes[1])) {
        //   $value['image'] = $sizes[1];
        //   unset($sizes[1]);
        // }

        // //$value['width'] = static::parseSizesParameter($sizes[0]);

        // unset($sizes[0]);

        // $values[] = array_merge($sizes, $value);
      }

    } else if(isset($sizes[0])) {
      throw new Exception('Unrecognized sizes parameter.');
    }

    return $values; // (sizeof($values) === 1 ? $values[0] : $values);

  }

  public function tag() {
    $html = [];

      // var_dump($this->sources);
      // exit;

    foreach($this->sources as $source) {
      $html[] = $source->tag();
    }

    return implode("\n", $html);
  }

  public function __toString() {
    //var_dump($this->srcset());
    return $this->tag();
    //return $this->html();
  }

  public function __debugInfo() {
    return [
      'image'   => !is_null($this->image) ? str_replace(kirby()->roots()->index() . DS, '', $this->image->root()) : null,
      'sources' => $this->sources,
    ];
  }


  // public function add($sizes) {
  //   if(utils::isArrayAssoc($sizes)) {
  //     // add a single size
  //     $this->addSize($sizes);
  //   } else if(is_array($sizes)) {
  //     // add multiple sizes
  //     foreach($sizes as $size) {
  //       $this->addSize($size);
  //     }
  //   } else {
  //     throw new Exception('Parameter $sizes must be an array.');
  //   }
  // }


  /*
    
  $image->imageset([200, 400, 600])

  [
    [ 'width' => 200 ],
    [ 'width' => 400 ],
    [ 'width' => 600 ],
  ]

  $image->imageset([
    [ 'width' => '600', 'density' => [1], media' => '…' ],
    [ 'width' => '400', 'media' => '…' ],
    [ 'width' => '200' ],
  ], [
    [ 'density' => [1, 2] ],
  ]);
  
  [
    ['width' => 600, 'densitiy' => [1], 'media' => '' ],
    ['width' => 400, 'densitiy' => [1, 2], 'media' => '' ],
    ['width' => 200, 'densitiy' => [1, 2] ],
  ]


  $image->imageset([
    [ 'width' => [200,400,600], 'media' => '…' ],
    [ 'width' => [350,500] ],
  ]);

  */

  // public function normalizeSources($sources) {
  //   if(is_array($sources)) {
      
  //     if(sizeof($sources) > 0 && !utils::isArrayAssoc($sources)) {
  //       // Sources parameter was a numeric array of one or multiple sizes
  //       foreach($sources as $i => $source) {
  //         if(!utils::isArrayAssoc($source) || !isset($source['width'])) {
  //           throw new Exception('When providing multiple sources, every source must be an associative array with a width parameter.');
  //         }
          
  //         $sources[$i] = $this->normalizeSources($source);
  //       }
  //     }

  //   } else if(is_string($sources)) {
      
  //     if(preg_match('/^(\d+)\s*(?:,\s*(\d+))*$/', $sources)) {
  //        // "200" or "200,400,600"
        
  //       $widths  = array_map('intval', explode(',', $sources));
  //       $sources = [];

  //       foreach($widths as $width) {
  //         $sources[] = [ 'width' => $width ];
  //       }
  //     } else if(preg_match('/^(\d+)-(\d+)(?:,(\d+))?$/', $sources, $matches)) {
  //       // 200-600 or 200-600,3
        
  //       $min = (int) $matches[1];
  //       $max = (int) $matches[2];
  //       $intermediate = (isset($matches[3]) && (int) $matches[3] > 0) ? (int) $matches[3] : 2;
        
  //       if($min >= $max) {
  //         throw new Exception('Min size must be smaller than max size.');
  //       }

  //       $step = ($max - $min) / ($intermediate + 1);
  //       $sources   = [];
  //       for($i = 0; $i < $intermediate + 2; $i++) {
  //         $sources[] = [ 'width' => round($min + ($i * $step)) ];
  //       }

  //       var_dump($sources);
  //       exit;

  //     } else {
  //       throw new Exception('Unrecognized sizes string form imageset.');
  //     }

  //   } else if(is_int($sources)) {
  //     $sources = [ [ 'width' => $sources ] ];
  //   }

  //   return $sources;
  ////return print_r($this->sizes, true);
  // }
}
