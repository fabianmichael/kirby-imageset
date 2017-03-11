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
?>

<?php if($imageset->outputStyle() === 'plain'):
  // Generate imageset markup for `simple` output style . Simple output
  // is mostly meant for external applications, where your need a more generic
  // markup for your images, like RSS feeds, APIs etc. `simple` output does not
  // have any classes, no srcset-attribute or other fancy stuff by default. If you
  // need any of those, adjust it in this template.
?>
  
  <?php if($imageset->count() > 1): /* ImageSet with multiple ratios */ ?>

    <picture>
      <?php foreach($imageset->alternativeSources() as $source): ?>
        <?= $source->tag(['lazyload' => false, 'output.xhtml' => true]) ?>
      <?php endforeach ?>
      <img <?= $imageset->srcAttributes() ?>
           <?= $imageset->sizesAttributes() ?>
           <?= $imageset->imgClassAttribute() ?>
           <?= $imageset->altAttribute(['output.xhtml' => true]) ?>
           style="max-width: 100%; height: auto;" />
    </picture>

  <?php else: /* image set with single ratio */ ?>

    <img <?= $imageset->srcAttributes(['lazyload' => false]) ?>
         <?= $imageset->sizesAttributes() ?>
         <?= $imageset->imgClassAttribute() ?>
         <?= $imageset->altAttribute(['output.xhtml' => true]) ?>
         style="max-width: 100%; height: auto;" />

  <?php endif ?>

<?php else: /* Full-featured output mode */ ?>
  
  <span class="<?= $imageset->wrapperClass() ?>">
    <?php if($imageset->hasCssRules()): ?>
      <style<?= $imageset->styleIdentifierAttribute() ?>><?= $imageset->cssRules() ?></style>
    <?php endif ?>

    <?php if($imageset->option('ratio') || $imageset->option('lazyload') || $imageset->option('placeholder')): ?>
      <span class="imageset-ratio-fill"<?= (!$imageset->hasCssRules()) ? ' style="padding-top: ' . utils::formatFloat(1 / $imageset->ratio() * 100, 10) . '%;"' : '' ?>></span>
    <?php endif ?>
  
    <?php if($placeholder = $imageset->placeholder()) echo $placeholder->html(); ?>
  
    <?php if($imageset->count() > 1): /* image set with multiple ratios */ ?> 
    
      <picture>
        <?php foreach($imageset->sources() as $source): ?>
          <?= $source->tag() ?>
        <?php endforeach ?>
        
        <img <?= $imageset->srcAttributes() ?>
             <?= $imageset->sizesAttributes() ?>
             <?= $imageset->altAttribute() ?>
             class="<?= $imageset->elementClass() ?>"
             <?= $imageset->trailingSlash() ?>>
      </picture>

    <?php else: /* image set with single ratio */ ?>

      <img <?= $imageset->srcAttributes() ?>
           <?= $imageset->sizesAttributes() ?>
           <?= $imageset->altAttribute() ?>
           class="<?= $imageset->elementClass() ?>"
           <?= $imageset->trailingSlash() ?>>
  
    <?php endif ?>

    <?php if($imageset->option('noscript')): ?>

      <noscript>
          
        <?php if($imageset->count() > 1): ?>
          
          <picture>
            <?php foreach($imageset->alternativeSources() as $source): ?>
              <?= $source->tag(['lazyload' => false]) ?>
            <?php endforeach ?>
            <img <?= $imageset->srcAttributes(['lazyload' => false], true) ?>
                 <?= $imageset->sizesAttributes(['lazyload' => false], true) ?>
                 class="imageset-fallback"
                 <?= $imageset->altAttribute() ?>
                 <?= $imageset->trailingSlash() ?>>
          </picture>

        <?php else: ?>

          <img <?= $imageset->srcAttributes(['lazyload' => false], true) ?>
               <?= $imageset->sizesAttributes(['lazyload' => false], true) ?>
               class="imageset-fallback"
               <?= $imageset->altAttribute() ?>
               <?= $imageset->trailingSlash() ?>>

        <?php endif ?>

      </noscript>
      
    <?php endif ?>

  </span>

<?php endif ?>
