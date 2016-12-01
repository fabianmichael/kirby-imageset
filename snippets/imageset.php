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
?>
<img src="<?=$image->src()?>" width="<?=$image->width()?>" height="<?=$image->height()?>" alt="<?=htmlspecialchars($imageset->alt())?>"/>
<?php else: ?>
<span class="<?= $imageset->wrapperClass() ?>">
  <?php if($imageset->hasCssRules()): ?>
  <style<?= $imageset->styleIdentifierAttribute() ?>><?= $imageset->cssRules() ?></style>
  <?php endif ?>
  <span class="<?= $imageset->className('__ratio-fill') ?>" <?= $imageset->option('noscript.priority') === 'compatibility' ? 'style="padding-top: ' . utils::formatFloat(1 / $imageset->ratio() * 100, 10) . '%;"' : '' ?>></span>
  <?= $imageset->placeholder() ?>
  <?php if($imageset->outputStyle() === 'picture'): ?> 
  <picture>
    <?php foreach($imageset->sources() as $source): ?>
    <?= $source ?>

    <?php endforeach; ?>
    <img src="<?= utils::blankInlineImage() ?>" class="<?= $imageset->elementClass() ?>" alt="<?= $imageset->alt() ?>"<?= empty($imageset->sizes()) ? ' data-sizes="auto"' : '' ?>>
  </picture>
  <?php else: ?>
  <img src="<?= utils::blankInlineImage() ?>" srcset="<?= utils::blankInlineImage() ?> 1w" <?= html::attr($imageset->option('lazyload') ? 'data-srcset' : 'srcset', $imageset->srcset()) ?><?= $imageset->sizesAttributes() ?> class="<?= $imageset->elementClass() ?>" alt="<?= $imageset->alt() ?>">
  <?php endif ?>  
  <?php if($imageset->option('noscript')): ?>
  <noscript>
    <?php if($imageset->option('noscript.priority') === 'ratio'): ?>
      <?php if($imageset->outputStyle() === 'picture'): ?> 
      <picture>
        <?php
        $sources = $imageset->sources();
        for($i = 0, $l = sizeof($sources); $i < $l - 1; $i++): ?>
        <?= $sources[$i]->tag('source', [], false) ?>

        <?php endfor; ?>
        <img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" class="<?= $imageset->className('__fallback') ?>" alt="<?= $imageset->alt() ?>"<?= $imageset->sizesAttributes(false) ?>>
      </picture>
      <?php else: ?>
      <img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" class="<?= $imageset->className('__fallback') ?>" alt="<?= $imageset->alt() ?>"<?= $imageset->sizesAttributes(false) ?>>
      <?php endif ?>  
    <?php else: ?>
    <img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" sizes="<?= $imageset->sizes() ?>" alt="<?= $imageset->alt() ?>" class="<?= $imageset->className('__fallback') ?>" sizes="<?= $imageset->sizes() ?>"<?= $imageset->sizesAttributes(false) ?>>
  <?php endif ?>
  </noscript>
  <?php endif ?>
</span>
<?php endif  ?>
