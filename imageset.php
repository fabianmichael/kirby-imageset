<?php

namespace Kirby\Plugins\ImageSet;

use C;

load([
  'kirby\\plugins\\imageset\\plugin'               => 'lib' . DS . 'plugin.php',
  'kirby\\plugins\\imageset\\imageset'             => 'lib' . DS . 'imageset.php',
  'kirby\\plugins\\imageset\\presets'              => 'lib' . DS . 'presets.php',
  'kirby\\plugins\\imageset\\sourceset'            => 'lib' . DS . 'sourceset.php',
  'kirby\\plugins\\imageset\\source'               => 'lib' . DS . 'source.php',
  'kirby\\plugins\\imageset\\utils'                => 'lib' . DS . 'utils.php',
  'kirby\\plugins\\imageset\\traits\\template'     => 'lib' . DS . 'traits' . DS . 'template.php',

  'kirby\\plugins\\imageset\\placeholder\\base'    => 'lib' . DS . 'placeholder' . DS . 'base.php',
  'kirby\\plugins\\imageset\\placeholder\\mosaic'  => 'lib' . DS . 'placeholder' . DS . 'mosaic.php',
  'kirby\\plugins\\imageset\\placeholder\\lqip'    => 'lib' . DS . 'placeholder' . DS . 'lqip.php',
  'kirby\\plugins\\imageset\\placeholder\\blurred' => 'lib' . DS . 'placeholder' . DS . 'blurred.php',
  'kirby\\plugins\\imageset\\placeholder\\color'   => 'lib' . DS . 'placeholder' . DS . 'color.php',
], __DIR__);

require __DIR__ . DS . 'vendor' . DS . 'autoload.php';

// =====  Register Snippets, Tags and Methods  ============================== */

$kirby = kirby();

// Include helper functions / template API.
require_once __DIR__ . DS . 'helpers.php';

// Load presets from config.
if($presets = c::get('imageset.presets')) {
  Presets::set($presets);
}


$kirby->set('snippet', 'imageset', __DIR__ . DS . 'snippets' . DS . 'imageset.php');


// Register image tag, if config says so.
if($kirby->option('imageset.tags.image')) {
  require_once __DIR__ . DS . 'tags' . DS . 'image.php';
}
