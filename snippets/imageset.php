<?php

namespace Kirby\Plugins\ImageSet;
use Html;

/*

# The world-famous ImageSet template

This template is used to generate markup for an imageset.
If you want to make modifications to this file, place a copy
of this file into your `site/snippets` folder.

*/

if ($imageset->outputStyle() === 'simple'):
  // Generate imageset markup for `simple` output style . Simple output
  // is mostly meant for external applications, where your need a more generic
  // markup for your images, like RSS feeds, APIs etc. `simple` output does not
  // have any classes, no srcset-attribute or other fancy stuff by default. If you
  // need any of those, adjust it in this template:
  ?><img src="<?=$image->src()?>" width="<?=$image->width()?>" height="<?=$image->height()?>" alt="<?=htmlspecialchars($imageset->alt())?>"/><?php

else:

  ?>

<span class="<?= $imageset->wrapperClass() ?>">
  <?php if($imageset->hasCssRules()): ?>
  <style><?= $imageset->cssRules() ?></style>
  <?php endif ?>
  <span class="<?= $imageset->className('__ratio-fill') ?>" <?= r(!$imageset->hasCssRules(), 'style="' . utils::formatFloat(1 / $imageset->ratio() * 100, 10) . '%;"') ?>></span>
  <?= $imageset->placeholder() ?>
  <?php if($imageset->outputStyle() === 'picture'): ?> 
  <picture>
<?php

    foreach($imageset->sources as $source) {
      echo '    ' . $source . PHP_EOL;
    }

    echo '    ' . html::img(utils::blankInlineImage(), [
      'class' => $imageset->elementClass(),
      'alt'   => $imageset->alt() ?: ' ',
    ]);

?>

  </picture>
  <?php
    else:
    ?><img src="<?= utils::blankInlineImage() ?>"<?php

        $image_class = $imageset->className('__element');

        $srcset_attr = $imageset->option('lazyload') ? 'data-srcset' : 'srcset';
        echo ' ' . html::attr($srcset_attr, $image->srcset());

        if ($imageset->option('lazyload')):
          $image_class .= ' / ' . $imageset->option('lazyload.class');
        endif;

        echo ' ' . html::attr('class', $image_class);

      ?> alt="<?=htmlspecialchars($imageset->alt())?>"><?php
    endif;
  ?>
  <?php if($imageset->option('noscript')): ?>
  <noscript><img src="<?= $imageset->src() ?>" srcset="<?= $imageset->srcset() ?>" sizes="<?= $imageset->sizes() ?>" alt="<?= $imageset->alt() ?>"></noscript>
  <?php endif ?>
</span><?php
endif;
