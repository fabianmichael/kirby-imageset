<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;


load([
  'kirby\\plugins\\imageset\\plugin'                                 => 'lib' . DS . 'plugin.php',
  'kirby\\plugins\\imageset\\imageset'                               => 'lib' . DS . 'imageset.php',
  'kirby\\plugins\\imageset\\presets'                                => 'lib' . DS . 'presets.php',
  'kirby\\plugins\\imageset\\sourceset'                              => 'lib' . DS . 'sourceset.php',
  'kirby\\plugins\\imageset\\source'                                 => 'lib' . DS . 'source.php',
  'kirby\\plugins\\imageset\\utils'                                  => 'lib' . DS . 'utils.php',
  'kirby\\plugins\\imageset\\component\\stylesconsolidatorresponse'  => 'lib' . DS . 'component' . DS . 'stylesconsolidatorresponse.php',

  'kirby\\plugins\\imageset\\placeholder\\base'                      => 'lib' . DS . 'placeholder' . DS . 'base.php',
  'kirby\\plugins\\imageset\\placeholder\\mosaic'                    => 'lib' . DS . 'placeholder' . DS . 'mosaic.php',
  'kirby\\plugins\\imageset\\placeholder\\lqip'                      => 'lib' . DS . 'placeholder' . DS . 'lqip.php',
  'kirby\\plugins\\imageset\\placeholder\\blurred'                   => 'lib' . DS . 'placeholder' . DS . 'blurred.php',
  'kirby\\plugins\\imageset\\placeholder\\color'                     => 'lib' . DS . 'placeholder' . DS . 'color.php',
], __DIR__);

require __DIR__ . DS . 'vendor' . DS . 'autoload.php';


// =====  Register Snippets, Tags and Methods  ============================== */

$kirby = kirby();

// Include helper functions / template API.
require_once __DIR__ . DS . 'helpers.php';

// Load presets from config.
if($presets = $kirby->option('imageset.presets')) {
  presets::init($presets);  
}

// Load defaults
foreach(ImageSet::$defaults as $key => $val) {
  $option = $kirby->option("imageset.$key");
  if(!is_null($option) && $val !== $option) {
    ImageSet::$defaults[$key] = $opion;
  }
}

// Register Snippet for ImageSet output. Can be overriden by
// placing a file called `imageset.php` within your snippets
// directory.
$kirby->set('snippet', 'imageset', __DIR__ . DS . 'snippets' . DS . 'imageset.php');

// Register image tag, if neither disabled in config nor
// overriden by a user-defined function.
if($kirby->option('imageset.tags.image') !== false && !file_exists($kirby->roots()->tags() . DS . 'image.php')) {
  require_once __DIR__ . DS . 'tags' . DS . 'image.php';
}

// Register style consolidator if enabled in options
if($kirby->option('imageset.styles.consolidate')) {
  $kirby->set('component', 'response', __NAMESPACE__ . '\\Component\\StylesConsolidatorResponse');
}

if(plugin::instance()->license()->type === 'trial') {
  $kirby->set('widget', 'imageset', __DIR__ . DS . 'widgets' . DS . 'imageset');
}
