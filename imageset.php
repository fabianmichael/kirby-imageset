<?php

namespace Kirby\Plugins\ImageSet;

use C;


load([
  'kirby\\plugins\\imageset\\imageset'              => 'lib' . DS . 'imageset.php',
  'kirby\\plugins\\imageset\\presets'               => 'lib' . DS . 'presets.php',
  'kirby\\plugins\\imageset\\sourceset'             => 'lib' . DS . 'sourceset.php',
  'kirby\\plugins\\imageset\\source'                => 'lib' . DS . 'source.php',
  'kirby\\plugins\\imageset\\utils'                 => 'lib' . DS . 'utils.php',
  'kirby\\plugins\\imageset\\traits\\sourceset'     => 'lib' . DS . 'traits' . DS . 'sourceset.php',
], __DIR__);

// Include helper functions / template API.
require_once __DIR__ . DS . 'helpers.php';

// Load presets from config.
if($presets = c::get('imageset.presets')) {
  Presets::set($presets);
}

// Register image tag, if config says so.
if(kirby()->option('imageset.tags.image')) {
  require_once __DIR__ . DS . 'tags' . DS . 'image.php';
}
