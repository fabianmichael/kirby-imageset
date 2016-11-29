<?php 
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */


namespace Kirby\Plugins\ImageSet\Widget;

use Str;
use Tpl;


return [
  'title' => [
    'text'       => 'ImageSet License',
    'link'       => false,
    'compressed' => false
  ],
  'html' => function() {
    return tpl::load(__DIR__ . DS . 'imageset.html.php', array(
      'text' => 'ImageSet is running in trial mode. Please support the development of this plugin and <a href="https://sites.fastspring.com/fabianmichael/product/imageset" target="_blank">buy a license</a>. If you already have a license key, please add it to your <code title="site/config/config.php" style="border-bottom: 1px dotted; font-family: monospace;">config.php</code> file.',
    ));
  }
];
