<?php

namespace Kirby\Plugins\ImageSet;


class Utils {
  
  public static function isArrayAssoc($arr) {
    return (is_array($arr) && array_keys($arr) !== range(0, sizeof($arr) - 1));
  }

  public static function isArraySequential($arr) {
    return (is_array($arr) && array_keys($arr) === range(0, sizeof($arr) - 1));
  }

  public function blankInlineImage() {
    return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

}
