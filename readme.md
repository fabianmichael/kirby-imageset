# ImageSet

![GitHub release](https://img.shields.io/github/release/fabianmichael/kirby-imageset.svg?maxAge=2592000) ![License](https://img.shields.io/badge/license-commercial-green.svg) ![Kirby Version](https://img.shields.io/badge/Kirby-2.3%2B-red.svg)

A flexible, responsive image component for [Kirby CMS](http://getkirby.com), featuring lazy loading, fancy placeholders and more.

**NOTE:** This is a commercial plugin. In order to use it on a production server, you need to buy a license. For details on ImageSet’s license model, scroll down to the [License](#10-license) section of this document.

***

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [1 Key Features](#1-key-features)
- [2 Download and Installation](#2-download-and-installation)
  - [2.1 Requirements](#21-requirements)
    - [2.1.1 Server Requirements](#211-server-requirements)
    - [2.1.2 Browser Support](#212-browser-support)
    - [2.1.3 Recommended Content Workflow](#213-recommended-content-workflow)
  - [2.2 Plugin Installation](#22-plugin-installation)
    - [2.2.1 Kirby CLI](#221-kirby-cli)
    - [2.2.2 Git Submodule](#222-git-submodule)
    - [2.2.3 Copy and Paste](#223-copy-and-paste)
  - [2.3 Template Setup](#23-template-setup)
- [3 Global Configuration](#3-global-configuration)
- [4 Usage](#4-usage)
  - [4.1 Template API](#41-template-api)
  - [4.2 Describing Sizes](#42-describing-sizes)
    - [4.2.1 Single Aspect-Ratio](#421-single-aspect-ratio)
    - [4.2.2 Multiple Aspect-Ratios](#422-multiple-aspect-ratios)
    - [4.2.3 Using the `sizes` Attribute](#423-using-the-sizes-attribute)
  - [4.3 Setting Options](#43-setting-options)
    - [4.3.1 Available Options](#431-available-options)
  - [4.4 Working with Size Presets](#44-working-with-size-presets)
    - [4.4.1 Defining Presets](#441-defining-presets)
    - [4.4.2 Dynamic Presets API](#442-dynamic-presets-api)
  - [4.5 Kirbytext](#45-kirbytext)
- [6 Plain Output for RSS Feeds](#6-plain-output-for-rss-feeds)
- [7 Generating Customized Markup](#7-generating-customized-markup)
- [8 FAQ & Troubleshooting](#8-faq--troubleshooting)
- [9 Known Bugs & Limitations](#9-known-bugs--limitations)
- [10 License](#10-license)
- [11 Technical Support](#11-technical-support)
- [12 Credits](#12-credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

***

## 1 Key Features

- **Responsive Images** Add responsive images in different sizes to your website with ease by using ImageSet’s convenient template API.
- **Easy to Use** ImageSet provides a convenient API for generating responsive imagesets from within your templates and it also works with Kirbytext.
- **Lazy Loading** It supports lazy loading for saving valuable bandwidth (especially on mobile) and faster page loads for everyone.*
- **Placeholders & Ratios** ImageSet comes with placeholders in 5 beautiful styles and reserves screen space for images before they are loaded to avoid reflows (aka *page-jumps*) while the page is being loaded.
- **Art Direction** Define different sizes and crop ratios for different screen sizes and/or any other media query conditions.
- **Progressive Enhancement** In case of doubt, the plugin works without JavaScript or native support for responsive images as a conditionally loaded polyfill is included for older browsers.
- **Web Standards** ImageSet produces HTML5-based markup (using the `<picture>` element and `srcset`-attribute).
- **Works with AJAX** ImageSet works with dynamic content, as new image sets are automatically detected and handled.
- **Error Handling** When an image could not be loaded (e.g. due to a connection error), the plugin will display a broken image icon and alt text if supplied.
- **Small Footprint** Frontend code has been designed for performance and comes with a minimal footprint. Less than ~2 kB CSS + ~8 kB JavaScript (+ ~6 kB Polyfill for older browsers), when minified & gzipped.

*) Lazy loading uses the very performant [lazysizes](https://github.com/aFarkas/lazysizes) script and requires JavaScript to be activated on the client. However, the plugin provides a `<noscript>`-fallback which is enabled by default.

***

## 2 Download and Installation

### 2.1 Requirements

#### 2.1.1 Server Requirements

-  PHP 5.6.0+
-  Kirby 2.3.0+
-  GD Library for PHP or ImageMagick command-line tools to resize images.
-  [ImageKit for Kirby CMS](https://github.com/fabianmichael/kirby-imagekit) 1.1.0+ *(optional, but recommended for pages containing lots of image sets and/or image sizes)*

#### 2.1.2 Browser Support

ImageSet has been tested in the following browsers, but should work with any browser that supports modern web standards:

| IE | Edge    | Firefox | Safari (OS X) | Safari (iOS) | Chrome | Opera | Opera mini |
|:-----------------:|:-------:|:-------:|:------:|:------:| :-----: | :-----: | :----: |
| 11+               | ✓       | ✓*       | 9+     | 9+      | ✓ | ✓ | ✓** |

*) Includes Firefox ESR

**) Does not work with dynamic content (e.g. widgets loaded via XHR/AJAX) due to the limited JavaScript support in Opera mini.

#### 2.1.3 Recommended Content Workflow

ImageSet works best with high-resolution source images, so they can be scaled according to your needs. This way, your content will also be more future-proof as in a couple of years, new devices might demand for images with even higher resolution. This also ensures an easier transition if new image formats like WebP become more popular. Make sure, that your server can handle scaling of thus large image files, though. If you use the GD library (Kirby’s default setting), also make sure that your server provides enough RAM to PHP, so large-sized images can be processed.

### 2.2 Plugin Installation

#### 2.2.1 Kirby CLI

If you’re using the [Kirby CLI](https://github.com/getkirby/cli), you need to `cd` to the root directory of your Kirby installation and run the following command:

```
kirby plugin:install fabianmichael/kirby-imageset
```

This will download and copy *ImageSet* into `site/plugins/imageset`.

#### 2.2.2 Git Submodule

To install this plugin as a git submodule, execute the following command from the root of your Kirby project:

```
git submodule add https://github.com/fabianmichael/kirby-imageset.git site/plugins/imageset
```

#### 2.2.3 Copy and Paste

1. [Download](https://github.com/fabianmichael/kirby-imageset/archive/master.zip) the contents of this repository as ZIP-file.
2. Rename the extracted folder to `imageset` and copy it into the `site/plugins/` directory in your Kirby project.

### 2.3 Template Setup

In order to make ImageSet work properly, you have to include the corresponding CSS and JavaScript files to your templates. Add the following lines to your header snippet:

```php
<!-- replaces "no-js" class on html element with "js" -->
<script>(function(d,c,r){d[c]=r.test(d[c])?d[c].replace(r,'$1js$2'):[d[c],'js'].join(' ')})(document.documentElement,'className',/(?:(^|\s)no-js(\s|$))/)</script>

<?= css('assets/plugins/imageset/css/imageset.min.css') ?>
```

If you use lazy loading, also add the following line anywhere after the previous code in your template, it is recommended to include the file before the closing `</head>` tag to ensure that it loads as fast as possible. If this is not possible, you can also include the script right before the closing body tag, but this leads to later execution and can easily result in the flashing of un-rendered placeholders.

```php
<?= js('assets/plugins/imageset/js/dist/imageset.min.js') ?>
```

Not all browsers are providing [native support](http://caniuse.com/#feat=picture) for the `<picture>` element. If your site does not already include a polyfill for this, you might also want to add the following lines within the `<head>` of your site to load the *respimage* polyfill conditionally and as fast as possible.

```php
<script>
(function(w, d){
  function loadJS(u){var r = d.getElementsByTagName("script")[0], s = d.createElement("script");s.src = u;r.parentNode.insertBefore( s, r );}
  if(!window.HTMLPictureElement){
    d.createElement('picture');
    loadJS("<?= url('assets/plugins/imageset/js/dist/respimage.min.js') ?>");
  }
})(window, document);
</script>
```

Alright, your site should now be prepared for using ImageSet! :-D

<table><tr><td>ℹ️ For a dev environment or low-traffic sites, it is completely fine to link plugin assets directly. However, if performance is critical for your project, it is highly recommended to place a copy of the JS and CSS files linked above in your <code>assets</code> directory and link to them or to bundle up these assets with your regular CSS and JavaScript using the build tool of your choice.</td></tr></table>

## 3 Global Configuration

The settings listed below are meant to be defined in your `config.php` and change the global behavior of the plugin. To learn about configuring the default behavior of image sets in your templates (lazy loading, placeholders, fallback behavior etc.), have a look at [4.3.1 Available Options](#431-available-options).

| Option              | Default value | Possible values | Description                                                                                                                                                                                                                                                     |
|:--------------------|:--------------|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imageset.license`    | `''`          | — |Enter your license code here, once your site goes live.<br>*See the [License](#10-license) section of this document for more information.* |
| `imageset.styles.consolidate` | `false` | `true`, `false` | If you use image sets with multiple aspect-ratios, the plugin needs an inline `<style>` element for each of those. This is common practice in web design and works in every browser, but throws a validation error as this is not officially part of the HTML5 spec. Enabling this setting will consolidate all inline style decorations and move them to head `<head>` of your document.<br><br>⚠️ *You should only enable this feature, if passing the validator is really important for your project and if you don’t use AJAX to load markup containing image sets dynamically.* |
| `imageset.tags.image` | `true` | `true`, `false` | If enabled, ImageSet will replace Kirby’s built-in *image* Kirbytag with one that will generate image sets instead of plain image tags. |
| `imageset.tags.image.sizes.default` | `''` | any defined preset name | Set the default size of image sets generated via the *image* Kirbytag. If this option is set, ImageSet will always generate image sets whenever the image Kirbytag is used, and no size parameter was given. |
| `imageset.tags.image.class` | `'size-{size}'` | — | Added to the `class` attribute of every image set generated by the *image* Kirbytag.<br>`{size}` will be replaced by the name of the corresponding preset. |

## 4 Usage

### 4.1 Template API

ImageSet offers a convenient API for including image sets into your Template-Code. Just use the global `imageset()` function in your templates:

**The `imageset()` function**

```php
imageset(Media $image, mixed $sizes = 'default', array $options = null)
```

**Parameters:**

<dl>
<dt><code>$image</code></dt>
<dd>The source image used to generate all resized versions. Must be an instance of the <code>Media</code> or <code>File</code> objects.</dd>

<dt><code>$sizes</code></dt>
<dd>Describes the image sizes, which should be generated. Must be a size descriptor or a preset. If no sizes are given, the function will check for a sizes preset called <code>'default'</code> and uses it, if defined.<br>→ <a href="#42-describing-sizes">4.2 Describing Sizes</a></dd>

<dt><code>$options</code></dt>
<dd>An associative array of options, letting you override default settings and adjust things like placeholder style, fallback behavior etc.<br>→ <a href="#43-setting-options">4.3 Setting Options</a></dd>
</dl>

**Working with `File` objects:**

Whenever your source image is inside Kirby's content folder, you should use Kirby’s API to retrieve the image as a `File` object, so you can use the `imageset()` method. In this case, you don’t have to specify the `$image` parameter:

```php
if($image = $page->image('sample.jpg')) {
  echo $image->imageset('200,400,600');
}
```

**Styling Image Sets**

The markup generated by the plugin is wrapped in a `<span>` tag which has the class `imageset` and additional classes depending on your options. By default, image sets always span the full width of their parent container. You can override this behavior by either wrapping them with another container element that has a constrained width or by using something like `.text .imageset { width: 50% ; }` in your CSS.

Image sets also have have `display: inline-block` on their container element by default to make them behave similar to regular `<img>` tag with all its upsides and downsides. You can safely override this by adding `.imageset.-ratio { display: block; }` somewhere to your stylesheet after `imageset.scss` was included, if you would like image sets to behave like block elements.

### 4.2 Describing Sizes

#### 4.2.1 Single Aspect-Ratio

As thumbnail sizes are usually defined by their width, ImageSet provides a convenient syntax for this.

**List of widths**

```php
echo $image->imageset('200,400,600');
echo $image->imageset([200, 400, 600]);
```

This will generate 3 thumbnails with a width of 200, 400 and 600 pixels. You can provide the sizes either as array or as string of comma-separated values. For better readability, you may also add a space after each comma.

**Range between widths**

```php
echo $image->imageset('200-600');
```

When you specifiy a range, ImageSet will calculate the intermediate sizes automatically. By default, the plugin will generate 2 intermediate sizes, so the example above will create a total of 4 thumbnails at widths of 200, 333, 467 and 600 pixels.

```php
echo $image->imageset('200-600,3');
```

If you need more than 2 intermediate sizes, you can optionally tell the function, how many intermediate sizes it should calculate. The example above will create a total of 5 thumbnails at widths of 200, 300, 400, 500 and 600 pixel

**List of cropped sizes**

```php
echo $image->imageset('400x200,800x400');
```

You can also describe explicit width and height parameters for images to create cropped thumbnails.

<table><tr><td> ℹ️ All images described in one size must have the same aspect-ratio. If you want to serve differently cropped images based on viewport-size, continue reading for more detailed information on more complex usage scenarios. </td></tr></table>

**Range between cropped sizes**

```php
echo $image->imageset('400x200-800x400');   // (1)
echo $image->imageset('400x200-800x400,5'); // (2)
```

You can also provide a range between the smallest and the largest cropped thumbnail you need (1) and tell the plugin how many intermediate sizes it should generate (2).

The examples above should be enough for most scenarios. If your layout does not require different crop ratios for differently-sized viewports, you can safely continue at [4.3 Setting Options](#43-setting-options). 😌

#### 4.2.2 Multiple Aspect-Ratios

Some scenarios require your images to be cropped in different aspect-ratios for different viewports.

Take the full-width hero image of a blog example for example; If a screen is much wider than tall, a hero image in 16:9 format might be a good choice, but on other screens — like a smartphone held upright, showing a square image might be the better option. The examples below demonstrates that:

```php
<?= imageset($page->image('marina.jpg'), [
  [ '320x180-1920x1080,5', 'media' => '(min-aspect-ratio: 3/2)' ],
  [ '320x320-1000x1000,5' ],
]); ?>
```

The example will create an image set with 2 different aspect-ratios, based on the viewport’s aspect-ratio. The first size in 16:9 format is only shown when the viewport has an aspect-ratio of at least 3:2. On taller viewports, a square version of the image is shown instead.

#### 4.2.3 Using the `sizes` Attribute

The HTML spec requires you to specify the `sizes` attribute for every `<source>` or `<img>` element with a `srcset`, that uses width descriptors. Otherwise, the HTML code does not pass the validator. 

By default, ImageSet will add `sizes="100vw"` to your images to make your markup valid. As long as you use lazy loading *(enabled by default)*, the plugin will automatically calculate the size based on the current width of each image set. If you disable lazy loading or a lot of your visitors use plugins like NoScript, you should pass a valid sizes descriptor to avoid the download of larger image files than needed.

```php
<?= $image->imageset([ '160-1280,6', 'sizes' => '(min-width: 640px) 100vw, 50vw' ]) ?>
```

Further Reading:

- Eric Portis (2014): [Srcset and sizes](http://ericportis.com/posts/2014/srcset-sizes/)

### 4.3 Setting Options

The options described in this section define the behavior of a single image set and can be passed as additional parameter when calling the `imageset()` function in your templates:

```php
<?= $image->imageset([
    '160-1280,6', 'sizes' => '(min-width: 640px) 100vw, 50vw'
  ], [
    'class'       => 'awesome-image',
    'placeholder' => 'blurred',
  ]) ?>
```

You can also define default values for all options by setting them in your `config.php` file with a prefix of `imageset.[option name]`:

```php
c::set('imageset.placeholder', 'color');
c::set('imageset.noscript', false);
```

#### 4.3.1 Available Options

| Option              | Default value | Possible values | Description                                                                                                                                                                                                                                                     |
|:--------------------|:--------------|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `class` | `''` | – | Additional classes added to the wrapper tag of the image set. |
| `alt` | `''` | any string | Sets the alternative text for this image set. |
| `ratio` | `true` | `true`, `false` | Adds a ratio-placeholder/intrinsic size to the image set. This reserves space for the images while the page is loading and avoids reflows *(aka “page-jumps”)*. This option is ignored, if `placeholder` has any other value than `false` or `lazyload` is enabled and always behaves like it had a value of `true` in these cases. |
| `placeholder` | `'mosaic'` | `false`, `'triangles'`*, `'mosaic'`, `'blurred'`, `'lqip'`, `'color'` | Sets the visual style of the placeholder shown while the main image is being loaded. Set to `false` if you don’t want to use a placeholder at all. Have a look at [the Demo page](http://imagesetdemo.fabianmichael.de/) to preview all available placeholder styles. *) May not render correctly in IE 10/11. |
| `lazyload` | `true` | `true`, `false` |  Enables lazy loading of image sets.<br>*Remember to include the corresponding JavaScript file into your markup as described in [2.3 Template Setup](#23-template-setup).*  |
| `noscript` | `true` | `true`, `false` | Includes a fallback for clients without JavaScript support or disabled JavaScript. |
| `output` | `'auto'` | `'auto'`, `'plain'` | `'auto'` = Image set will produce full-featured HTML according to your options.<br>`'plain'` = HTML output will be plain HTML without any classes, placeholders etc. `img` and `source` tags are also rendered in XHTML-compatible syntax. |
| `output.xhtml` | `false` | `true`, `false` | When enabled, ImageSet will generate XHTML/XML-compatible markup for all image sets. This means that a trailing slash is added to void elements and a different handling of special chars. |
| `cache`  | `true` | `true`, `false` | When enabled, the HTML output of image sets is always cached, resulting for major speed improvements. |

### 4.4 Working with Size Presets

#### 4.4.1 Defining Presets

Your project probably has a lot of re-occuring image sizes. You can configure a set of default presets in your `config.php` to use them in your templates:

```php
# site/config/config.php
c::set('imageset.presets', [
  'default' => [
    [ '300-1500,7' ],
  ],
  'hero'    => [
    [ '320x180-1920x1080,5', 'media' => '(min-aspect-ratio: 3/2)' ],
    [ '320x320-1000x1000,5' ],
  ],
  'small'   => [
    [ '200,300,600,800' ]
  ],
]);
```

```php
<?php if($hero = $page->hero()->toFile()): ?>
<div class="hero">
  <?= $hero->imageset('hero') ?>
</div>
<?php endif ?>
```

#### 4.4.2 Dynamic Presets API

In more complex scenarios, you might want to use different size presets depending on the current template, snippet or content area. 
Maybe your project uses Kirbytext in differently sized columns and you don’t want to use size names like “sidebar-small” in your Kirbytext markup. In these cases, you should have a look ate the dynamic presets API:

<dl>
<dt><code>imageset::presets([ 'default' =&gt; … , 'small' =&gt; … ])</code></dt>
<dd>Defines new Presets. Extending presets will be overridden if a name preset of the same name already existed. A preset can be anything you can pass as <code>$sizes</code> parameter to the <code>imageset()</code> function.</dd>

<dt><code>imageset::presets('clear')</code></dt>
<dd>Clears all currently available presets, leaving you with no presets at all. However, this does not delete presets which have been defined in <code>config.php</code> via the <code>imageset.presets</code>. You can still load any presets that have been saved before by calling <code>imageset::presets('save', …)</code>.</dd>

<dt><code>imageset::presets('load', $name)</code></dt>
<dd>Replaces all current set of presets with those that have been saved as <code>$name</code> before.</dd>

<dt><code>imageset::presets('reset')</code></dt>
<dd>Restores the presets defined in your <code>config.php</code> file.</dd>

<dt><code>imageset::presets('save', $name)</code></dt>
<dd>Saves all currently available presets for later use, where <code>$name</code> has to be anything that would be a valid PHP array key, except for the word 'inital', which is reserved.</dd>
</dl>

**Example**

```php
# /site/snippets/imageset-presets.php
<?php

// Presets for page content
imageset::presets([
  'default' => '200-1000,5',
  'small'   => '150-500',
  'square'  => '200x200-1000x1000,4',
]);

imageset::presets('save', 'content');
imageset::presets('reset');


// Presets for sidebar
imageset::presets([
  'default' => '200-500',
  'small'   => '100,150,200',
]);

imageset::presets('save', 'sidebar');
imageset::presets('reset');
```

```php
# /site/snippets/header.php

<?php snippet('imageset-presets') ?>
<!DOCTYPE html>
<html>
[…]
```

In `imageset-presets.php`, two different sets of presets are defined, one for the main content (`'content'`) and one for the narrower sidebar content (`'sidebar'`). This file was included in `header.php` to ensure that it loaded with every template. The following templates offers two different areas, where Kirbytext appears. Before calling the Kirbytext command, the corresponding set of size presets is loaded, so image tags inside your Kirbytext will be resized. After all Kirbytext has been generated, presets are reset to their initial state by calling `imageset::presets('reset')`.

```php
# /site/templates/default.php

<?php snippet('header') ?>

<main class="container">
  
  <article class="main-content">
    <?php imageset::presets('load', 'content') ?>
    <?= $page->text()->kirbytext() ?>
  </article>
  
  <aside class="sidebar">
    <?php imageset::presets('load', 'sidebar') ?>
    <?php if($image = $page->sidebar_image()->toFile()): ?>
      <?= $image->imageset() ?>
    <?php endif ?>
    <?= $page->sidenotes()->kirbytext() ?>
  </aside>
  
  <?php imageset::presets('reset') ?>
  
</main>
[…]
```

<table><tr><td>⚠️ If you’re using a snippet file for storing presets, it must <strong>not</strong> be named <code>imageset.php</code> as this name is reserved for a custom image set snippet as described in <a href="#7-generating-custom-markup">7 Generating Custom Markup</a>.</td></tr></table>

### 4.5 Kirbytext

ImageSet replaces Kirby’s built-in `(image: …)` Kirbytag by default to also allow usage of the plugin in your content. You can disable this custom image tag by setting `imageset.tags.image` to `false` in your `config.php`. It will also be ignored, if you have a file named `image.php` placed in the `/site/tags` directory.

The tag just works like Kirby’s [image tag](https://getkirby.com/docs/content/text#images), but has an additional attribute called `size`. Using this parameter lets you use any of your size presets within Kirbytext:

```
(image: marina.jpg size: small)
```

If you want to transform every image within your content to an image set automatically, you can also specify a default size in your `config.php`:

```php
c::set('imageset.tags.image.sizes.default', 'small');
```

If you do so, every image tag without the size attribute will be resized according to the preset you defined as default.

<table><tr><td>ℹ️ Only images in JPG, PNG or GIF format will be converted into ImageSets, other image types like SVG will just act like the original image tag and generate the same markup, as Kirby’s built-in image tag would do.</td></tr></table>

<table><tr><td>ℹ️ ImageSet will add the class defined in <code>imageset.tags.image.class</code> to the wrapper element of the generated markup to provide you a CSS hook for setting an image’s width according to your preset. The wrapper tag is either <code>&lt;a&gt;</code> (if image has the <code>link</code> parameter), <code>&lt;figure&gt;</code> (if enabled in Kirby’s configuration or image has a caption) or the wrapping <code>&lt;span&gt;</code> tag of the ImageSet itself.</td></tr></table>

## 6 Plain Output for RSS Feeds

If your site generates RSS-feeds, including full-blown image sets into the markup might not work with most RSS readers due to their lack of JavaScript and CSS support. You can force ImageSet to generate plain, RSS/XHTML-compatible markup by setting the `output` option.

```php
# site/templates/feed.rss.php
[…]
<?= $image->imageset('200-800', [ 'output' => 'plain' ]) ?>
[…]
```

Because this is not suitable for Kirbytext, you can also change the global setting dynamically:

**The `imageset::outputStyle()` function**

```php
imageset::outputStyle(string $style = 'auto')
```

`$style`
: Takes either a value of `'plain'` or `'auto'` (default value). 

**Example**

```php
# site/templates/feed.rss.php
<?php
imageset::outputStyle('plain')
// All image sets created from this point will generate plain markup.
?>
[…]
<?= $image->imageset('200-800') ?>
[…]
<?php
imageset::outputStyle('auto');
// All image sets created from this point will generate regular markup again.
```

## 7 Generating Customized Markup

If the code generated by ImageSet does not satisfy the requirements of your project, you may override the snippet file, which is used to generate the markup for image sets.

Just place a copy of `site/plugins/imageset/snippets/imageset.php` in your snippets directory and make sure this file is also named `imageset.php`. Make your adjustments in the cloned file and ImageSet will load your custom snippet automatically. 

<table><tr><td>⚠️ Keep in mind, that you might have to update your custom snippet file whenever ImageSet gets an update that makes changes to the vanilla snippet file. If you’re missing a feature that could be useful for other users as well, consider to <a href="https://github.com/fabianmichael/kirby-imageset/issues/new">open an issue</a> describing your idea instead.</td></tr></table>

## 8 FAQ & Troubleshooting

<details>
  <summary><strong>So much markup for a single image?</strong></summary>
  Yes … ImageSet was designed with broad compatibility among different browsers and progressive enhancement in mind. This does not work without more extensive markup. As browsers evolve, I will investigate into reducing the markup needed to be generated for image sets.
</details>

<details>
    <summary><strong>Will ImageSet slow down my site?</strong></summary>
    ImageSet has been designed for performance. But as it uses Kirby’s built-in thumbs API, the plugin needs check the existence of every thumb on every page load. On pages with dozens of image sets and hundreds of corresponding thumbs, you may notice a performance impact. In these cases, it is recommended to enable Kirby’s page cache or to switch to a web hosting plan that comes with fast SSD storage. When a page has to generate hundreds of thumbnails on load, this may also exceed your maximum script execution time. In the latter case, consider to use the <a href="https://github.com/fabianmichael/kirby-imagekit">ImageKit</a> plugin for asynchronous thumbnail creation or cloud-based service.
</details>

<details>
  <summary><strong>Frontend performance</strong></summary>
  ImageSet uses JavaScript based filters for most placeholder styles to ensure good cross-browser support and nice-looking placeholders. However, these filters need some CPU time and low-quality sources have to be loaded for every image set. This can noticeably slow down page load on slow devices and also increases the overall download size of a page. If your page holds a huge number of ImageSets, you should consider to disable placeholders or use the `color` placeholder style, which is very lightweight. Rendering of placeholders is also much faster for images without an alpha channel, so prefer JPEGs or non-transparent PNGs wherever possible.
</details>

<details>
  <summary><strong>Does it support SVG images?</strong></summary>
  There is only basic support for SVG images. That means, if you supply an SVG image as source file for your image set, the plugin will generate markup for the SVG image, using the <code>&lt;img&gt;</code> tag. But at SVG is a very complex document format, there is no simple way in PHP to generate placeholder thumbnails (imagemagick does not work reliably with every SVG file), so placeholder style will be ignored and the SVG file will be shown in its original aspect-ratio. Everything set in the <code>$sizes</code> parameter will be ignored.
</details>

<details>
  <summary><strong>Is it a good idea to apply custom CSS to my image sets?</strong></summary>
  In general, it is not recommended to apply any custom CSS to anything inside the wrapper tag, as the HTML & CSS structure may possibly change with an update of ImageSet. It is recommended to apply all styles regarding custom positioning or sizing to the wrapping <code>&lt;span class=&quot;imageset […]&quot;&gt;</code>code> tag. You can use the <code>class</code> option to add custom classes, if you need different styles for different image sets.
</details>

## 9 Known Bugs & Limitations

**Safari 10**

When an image set appears within an element that uses CSS multi-colum layout (`column-count > 1`), the fade-in animation for lazy-loaded image sets does not work. However, the loaded image is displayed correctly. Currently, there is no way to fix this as far as I know.

**Printing**

Although it’s possible to trigger loading of images when a user hits the print button, that does not necessarily mean that images are generated before the browser generates its print preview or the user starts to print. A workaround for this is to preload all images after the page has been loaded. This ensures that image sets are loaded after other resources like JS and CSS files, but loads every image on the page and thus basically disables lazy-loading:

<pre><code>&lt;script&gt;
window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.preloadAfterLoad = true;
&lt;/script&gt;
</code></pre>

## 10 License

ImageSet can be evaluated as long as you want on how many private servers you want. To deploy ImageSet on any public server, you need to buy a license. See `license.md` for terms and conditions.

*The plugin is also available as a bundle with [ImageKit](https://github.com/fabianmichael/kirby-imagekit), a plugin that brings asynchronous thumbnail creation and advanced image optimization for your site.*

→ [Buy ImageSet](http://sites.fastspring.com/fabianmichael/product/imageset)  
→ [Buy the ImageKit + ImageSet Bundle](http://sites.fastspring.com/fabianmichael/product/imgbundle1)


However, even with a valid license code, it is discouraged to use it in any project, that promotes racism, sexism, homophobia, animal abuse or any other form of hate-speech.

## 11 Technical Support

Technical support is provided via Email and on GitHub. If you’re facing any problems with running or setting up ImageSet, please send your request to [support@fabianmichael.de](mailto:support@fabianmichael.de) or [create a new issue](https://github.com/fabianmichael/kirby-imageset/issues/new) in this GitHub repository. No representations or guarantees are made regarding the response time in which support questions are answered.

## 12 Credits

ImageSet is developed and maintained by [Fabian Michael](https://fabianmichael.de), a graphic designer & web developer from Germany.

The plugin includes the following third-party components:

- [lazysizes](https://github.com/aFarkas/lazysizes) and [respimage](https://github.com/aFarkas/respimage) by [Alexander Farkas](https://github.com/aFarkas).  
  Both projects are licensed under the MIT License (MIT).
- [Color Thief PHP](https://github.com/ksubileau/color-thief-php) by [Kevin Subileau](https://github.com/ksubileau).
  Licensed under the [Creative Commons Attribution 2.5 License](http://creativecommons.org/licenses/by/2.5/).
- [StackBlur for Canvas](https://github.com/Quasimondo/QuasimondoJS) by [Mario Klingemann](http://mario@quasimondo.com).  
  Licensed under an MIT-style License (MIT).
