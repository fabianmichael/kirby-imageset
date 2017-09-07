<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

use Kirby\Plugins\ImageSet\ImageSet;


$kirby = kirby();

kirbytext::$tags['image'] = [
  'attr' => [
    'width',
    'height',
    'alt',
    'text',
    'title',
    'class',
    'imgclass',
    'linkclass',
    'caption',
    'link',
    'target',
    'popup',
    'rel',
    'size',
  ],

  'html' => function($tag) use ($kirby) {

    $url     = $tag->attr('image');
    $alt     = $tag->attr('alt');
    $title   = $tag->attr('title');
    $link    = $tag->attr('link');
    $caption = $tag->attr('caption');
    $file    = $tag->file($url);
    
    // ImageSet
    $size              = $tag->attr('size', $kirby->option('imageset.tags.image.sizes.default'));
    $makeImageSet      = $file && !empty($size) && $file->isWebsafe();
    $sizeClassTemplate = $kirby->option('imageset.tags.image.class', 'size-{size}');
    $sizeClass         = $makeImageSet ? str::template($sizeClassTemplate, [ 'size' => $size ]) : '';

    // use the file url if available and otherwise the given url
    $url = $file ? $file->url() : url($url);

    // alt is just an alternative for text
    if($text = $tag->attr('text')) $alt = $text;

    // try to get the title from the image object and use it as alt text
    if($file) {

      if(empty($alt) && $file->alt() != '') {
        $alt = $file->alt();
      }

      if(empty($title) and $file->title() != '') {
        $title = $file->title();
      }

    }

    // at least some accessibility for the image
    if(empty($alt)) $alt = ' ';

    // link builder
    $_link = function($image) use($tag, $url, $link, $file, $sizeClass, $makeImageSet) {

      if(empty($link)) return $image;

      // build the href for the link
      if($link == 'self') {
        $href = $url;
      } else if($file and $link == $file->filename()) {
        $href = $file->url();
      } else if($tag->file($link)) {
        $href = $tag->file($link)->url();
      } else {
        $href = $link;
      }

      return html::a(url($href), $image, array(
        'rel'    => $tag->attr('rel'),
        'class'  => trim($tag->attr('linkclass') . ' ' . $sizeClass),
        'title'  => $tag->attr('title'),
        'target' => $tag->target()
      ));

    };

    // image builder
    $_image = function($class) use($file, $tag, $url, $alt, $title, $size, $makeImageSet, $link, $sizeClass) {
      if($makeImageSet) {
        return imageset($file, $size, [
          'class' => trim($class . (empty($link) ? ' ' . $sizeClass : '')),
          'alt'   => $alt,
        ]);
      } else {
        return html::img($url, array(
          'width'  => $tag->attr('width'),
          'height' => $tag->attr('height'),
          'class'  => $class,
          'title'  => $title,
          'alt'    => $alt
        ));
      }
    };

    if(kirby()->option('kirbytext.image.figure') or !empty($caption)) {
      $image  = $_link($_image($tag->attr('imgclass')));
      $figure = new Brick('figure');
      $figure->addClass($tag->attr('class'));

      if(!empty($sizeClass)) {
        $figure->addClass($sizeClass);
      }

      $figure->append($image);
      
      if(!empty($caption)) {
        $figure->append('<figcaption>' . html($caption) . '</figcaption>');
      }

      return $figure;
    } else {
      $class = trim($tag->attr('class') . ' ' . $tag->attr('imgclass'));
      return $_link($_image($class));
    }

  }
];
