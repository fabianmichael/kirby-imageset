<?php
/**
 * ImageSet - responsive, lazy-loading images for Kirby CMS
 * 
 * @copyright (c) 2016 Fabian Michael <https://fabianmichael.de>
 * @link https://github.com/fabianmichael/kirby-imageset
 */

namespace Kirby\Plugins\ImageSet;
use Html;

// This template is used to generate markup for an imageset.
// If you want to make modifications to this file, place a copy
// of this file into your `site/snippets` folder.

if($imageset->outputStyle() === 'plain'):
  // Generate imageset markup for `simple` output style . Simple output
  // is mostly meant for external applications, where your need a more generic
  // markup for your images, like RSS feeds, APIs etc. `simple` output does not
  // have any classes, no srcset-attribute or other fancy stuff by default. If you
  // need any of those, adjust it in this template:

  $sources = $imageset->sources();
  if(sizeof($sources) > 1):
  ?><picture><?php
    for($i = 0; $i < sizeof($sources) - 1; $i++):
      $tag = $sources[$i]->tag(null, false);
      echo substr($tag, 0, strlen($tag) - 1) . ' />';
    endfor;
    $source = $imageset->lastSource();
    ?><img src="<?= $source->src() ?>" srcset="<?= $source->srcset() ?>" alt="<?= $imageset->alt() ?>"<?= $source->sizesAttributes() ?> style="max-width: 100%; height: auto;" /><?php
  ?></picture><?php
  else:
  ?><img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" alt="<?= $imageset->alt() ?>"<?= $imageset->sizesAttributes() ?> style="max-width: 100%; height: auto;" /><?php
  endif;
else: ?>
<span class="<?= $imageset->wrapperClass() ?>">
  <?php if($imageset->hasCssRules()): ?>
  <style<?= $imageset->styleIdentifierAttribute() ?>><?= $imageset->cssRules() ?></style>
  <?php endif ?>
  <?php if($imageset->option('ratio') || $imageset->option('lazyload') || $imageset->option('placeholder')): ?>
  <span class="<?= $imageset->className('__ratio-fill') ?>"<?= (!$imageset->hasCssRules() || $imageset->option('noscript.priority') === 'compatibility') ? ' style="padding-top: ' . utils::formatFloat(1 / $imageset->ratio() * 100, 10) . '%;"' : '' ?>></span>
  <?php endif ?>
  <?= $imageset->placeholder() ?>
  <?php if($imageset->outputStyle() === 'picture'): ?> 
  <picture>
    <?php foreach($imageset->sources() as $source):
      echo $source;
    endforeach; ?>
    <img src="<?= utils::blankInlineImage() ?>" class="<?= $imageset->elementClass() ?>" alt="<?= $imageset->alt() ?>"<?= (empty($imageset->sizes()) && $imageset->option('lazyload')) ? ' data-sizes="auto"' : '' ?>>
  </picture>
  <?php else: ?>
  <img src="<?= utils::blankInlineImage() ?>" srcset="<?= utils::blankInlineImage() ?> 1w" <?= html::attr($imageset->option('lazyload') ? 'data-srcset' : 'srcset', $imageset->srcset()) ?><?= $imageset->sizesAttributes() ?><?= (empty($imageset->sizes()) && $imageset->option('lazyload')) ? ' data-sizes="auto"' : '' ?> class="<?= $imageset->elementClass() ?>" alt="<?= $imageset->alt() ?>">
  <?php endif ?>  
  <?php if($imageset->option('noscript')): ?>
  <noscript><?php
    if($imageset->option('noscript.priority') === 'ratio'):
      if($imageset->outputStyle() === 'picture'):
      ?><picture><?php
        $sources = $imageset->sources();
        for($i = 0, $l = sizeof($sources); $i < $l - 1; $i++):
          echo $sources[$i]->tag([], false);
        endfor;
        ?><img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" class="<?= $imageset->className('__fallback') ?>" alt="<?= $imageset->alt() ?>"<?= $imageset->sizesAttributes(false) ?>><?php
      ?></picture><?php
      else:
      ?><img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" class="<?= $imageset->className('__fallback') ?>" alt="<?= $imageset->alt() ?>"<?= $imageset->sizesAttributes(false) ?>><?php
      endif;
    else:
    ?><img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" alt="<?= $imageset->alt() ?>" class="<?= $imageset->className('__fallback') ?>"<?= $imageset->sizesAttributes(false) ?>><?php
    endif; ?></noscript><?php
  endif; ?>
</span>
<?php endif  ?>
