<?php

namespace Kirby\Plugins\ImageSet\Traits;

use Kirby\Plugins\ImageSet\Utils;
use Str;


trait Template {

  protected $cssRules;

  public function className($className = '') {
    return $this->option('css.namespace') . $className;
  }


  public function uniqueClassName() {
    return $this->className('--' . dechex($this->id));
  }

  public function wrapperClass() {
    $className = [];

    $className[] = $this->className();

    if($this->hasMultipleRatios()) {
      $className[] = $this->uniqueClassName();
    }

    if($this->option('ratio')) {
      $className[] = $this->className('--ratio');
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

  public function elementClass() {
    $className = [];

    $className[] = $this->className('__element');

    if($this->option('lazyload')) {
      $className[] = '/';
      $className[] = 'lazyload';
    }

    return implode(' ', $className);
  }

  public function hasCssRules() {
    return !empty($this->cssRules());
  }


  public function cssRules() {
    
    if(is_null($this->cssRules)) {
      if(!$this->option('ratio') || sizeof($this->sources) === 1 || !$this->hasMultipleRatios()) {
        $this->cssRules = '';
        return $this->cssRules;
      }

      $rules = [];

      foreach(array_reverse($this->sources) as $source) {
        $rule = ".{$this->uniqueClassName()} .{$this->className('__ratio-fill')}{padding-top:" . utils::formatFloat(1 / $source->ratio() * 100, 10) . "%;}";
        if($media = $source->media()) {
          $rule = '@media ' . $media . '{' . $rule . '}';
        }
        $rules[] = $rule;
      }

      if($this->option('prettyprint')) {
        array_unshift($rules, '');
        array_push($rules, '');
      }

      $this->cssRules = implode(PHP_EOL, $rules);      
    }

    return $this->cssRules;
  }

}
