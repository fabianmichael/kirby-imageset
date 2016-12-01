<img src="https://fabianmichael.de/shared/imagekit-logo-github.png" alt="Imagekit Logo" width="120" height="120" />

# ImageSet

![GitHub release](https://img.shields.io/github/release/fabianmichael/kirby-imageset.svg?maxAge=2592000) ![License](https://img.shields.io/badge/license-commercial-green.svg) ![Kirby Version](https://img.shields.io/badge/Kirby-2.3%2B-red.svg)

A flexible, responsive image component for [Kirby CMS](http://getkirby.com), featuring lazy-loading, fancy placeholders and much more.

**NOTE:** This is not be a free plugin. In order to use it on a production server, you need to buy a license. For details on ImageSet’s license model, scroll down to the [License](#license) section of this document.

![Placeholder styles available in ImageSet](https://fabianmichael.de/shared/imageset-animation.gif)

***

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [1 Key Features](#1-key-features)
- [2 Download and Installation](#2-download-and-installation)
  - [2.1 Requirements](#21-requirements)
    - [2.1.1 Server](#211-server)
    - [2.1.2 Browser Support](#212-browser-support)
  - [2.2 Plugin Installation](#22-plugin-installation)
    - [2.2.1 Kirby CLI](#221-kirby-cli)
    - [2.2.2 Git Submodule](#222-git-submodule)
    - [2.2.3 Copy and Paste](#223-copy-and-paste)
  - [2.3 Template Setup](#23-template-setup)
- [3 Usage](#3-usage)
  - [3.2 Template Usage](#32-template-usage)
  - [3.3 Available options](#33-available-options)
  - [3.3 Kirbytext](#33-Kirbytext)
  - [3.4 Size Presets](#34-size-presets)
- [5 Global Configuration](#5-global-configuration)
- [7 FAQ & Troubleshooting](#7-faq-&-troubleshooting)
- [8 License](#8-license)
- [9 Technical Support](#9-technical-support)
- [10 Credits](#10-credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

***

## 1 Key Features

- **Responsive Images** Add responsive images in different sizes to your website with ease by using ImageSet’s simple API.
- **HTML5 compatible** ImageSet generates HTML5-compatible markup (`<picture>` element and `srcset`-attribute).
- **Lazy-Loading** ImageSet supports lazy-loading for saving valuable bandwidth on mobile and faster page loads for everyone.*
-  **Placeholders & Ratios** ImageSet comes with placeholders in 4 beautiful styles and reserves screen space for images before they are loaded to avoid reflows (aka *page-jumps*) while the page is being loaded.
-  **Art Direction** Define different sizes and crop ratios for different screen sizes and/or media types.
-  **Noscript-Fallback** In case of doubt, it even works without JavaScript or HTML5 support.
-  **Works with AJAX** ImageSet works with dynamic content, as new ImageSet’s are automatically detected and handled.

*) Lazy-loading uses the very performant [lazysizes](https://github.com/aFarkas/lazysizes) script and requires JavaScript to be activated in the user’s browser. However, ImageSet also provides an optional `<noscript>`-fallback which is active by default.

***

## 2 Download and Installation

### 2.1 Requirements

#### 2.1.1 Server Requirements

-  PHP 5.4.0+
-  Kirby 2.3.0+
-  GD Library for PHP or ImageMagick command-line tools to resize images.
-  [ImageKit for Kirby CMS](https://github.com/fabianmichael/kirby-imagekit) 1.1.0+ *(optional, but recommended for pages lots of imagesets and/or image sizes)*

#### 2.1.2 Browser Support

ImageSet has been tested in the following browsers, but should work with any browser that supports modern web standards:

| Internet Explorer | Edge    | Firefox | Safari (OS X) | Safari (iOS) | Chrome | Opera | Opera mini |
|:-----------------:|:-------:|:-------:|:------:|:------:| :-----: | :-----: | :----: |
| 10+               | ✓       | ✓       | 9+     | 9+      | 41+ | 28+ | ✓* |

*) Does not work with dynamic content (e.g. widgets loaded via XHR) due the limited JavaScript support in Opera mini.

### 2.2 Plugin Installation

#### 2.2.1 Kirby CLI

If you’re using the [Kirby CLI](https://github.com/getkirby/cli), you need to `cd` to the root directory of your Kirby installation and run the following command:

```
kirby plugin:install fabianmichael/kirby-imageset
```

This will download and copy *ImageSet* into `site/plugins/imageset`.

#### 2.2.2 Git Submodule

To install this plugin as a git submodule, execute the following command from the root of your kirby project:

```
$ git submodule add https://github.com/fabianmichael/kirby-imageset.git site/plugins/imageset
```

#### 2.2.3 Copy and Paste

1. [Download](https://github.com/fabianmichael/kirby-imageset/archive/master.zip) the contents of this repository as ZIP-file.
2. Rename the extracted folder to `imageset` and copy it into the `site/plugins/` directory in your Kirby project.

### 2.3 Template Setup

In order to make ImageSet work properly, you have to include the corresponding CSS and JavaScript files to your templates. Add the following line to your header snippet:

```php
<?= css('assets/plugins/imageset/css/imageset.min.css') ?>
```

If you use lazy-loading, also add the following line anywhere in your template, I would recommend to add it before the closing `</body>` tag:

```php
<?= js('assets/plugins/imageset/js/dist/imageset.js') ?>
```

As not all important browsers [support](http://caniuse.com/#feat=picture) the `<picture>` element natively. If your site does not already include a polyfill for this, you might also want to add the following lines within the `<head>` of your site to load the *respimage* polyfill conditionally.

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

ℹ️ For a dev environment or low-traffic sites, this method is completely fine. However, if performance is critical for your project, it is highly recommended to place a copy of the JS and CSS files linked above in your `assets` directory and link to these or to bundle up ImageSet’s files with your regular CSS and JS.

## 3 Global Configuration

The settings listed below are meant to be defined in your `config.php` file.

| Option              | Default value | Possible values | Description                                                                                                                                                                                                                                                     |
|:--------------------|:--------------|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imageset.license`    | `''`          | — |Enter your license code here, once your site goes live.<br>[<img src="https://img.shields.io/badge/%E2%80%BA-Buy%20a%20license-green.svg" alt="Buy a license">](http://sites.fastspring.com/fabianmichael/product/imagekit) |
| `imageset.styles.consolidate` | `false` | `true`, `false` | If you use ImageSets with multiple aspect-ratios, the plugin needs a `<style>` element for every of those. This is common practice in web design and works in every browser, but throws a validation error as it’s not officially part of the HTML5 spec. If this is an issue for you, you can enable this setting. |
| `imageset.tags.image` | `true` | `true`, `false` | If enabled, ImageSet will replace Kirby’s built-in `(image: …)` Kirbytag with one that will generate ImageSets instead of plain image tags. |
| `imageset.tags.image.sizes.default` | `''` | Any defined preset name. | Set the default size of imagesets generated via the `(image: …)` Kirbytag. If this option is set, ImageSet will always generate ImageSets whenever the image Kirbytag is used, and no size parameter was given. |

To configure the default behavior of ImageSets, have a look at the [Available Options](#bla) section below.

## 4 Usage

### 4.1 Template API

ImageSet offers a convenient API for including ImageSet’s into your Template-Code. Use the global `imageset()` function for adding ImageSets to your templates:

**The `imageset()` function**

```php
imageset(Media $image, mixed $sizes = 'default', array $options = null)
```

**Parameters:**

`$image`
: The source image used to generate all resized versions.

`$sizes` 
: The sizes to generate. Can be the name of a preset or a sizes descriptor. If no sizes are given, ImageSet will look whether a sizes preset called `'default'` is defined and will use this.

`$options`
: An associative array of options, letting you override default settings and adjust things like placeholder style, noscript-behavior etc. (see [Available Options](#bla))

**Working with `File` objects:**

Whenever your source image is from inside Kirby's content folder, you should use Kirby’s API to get the image a `File` object and the corresponding `imageset()` method. In this case, you don’t have to specify the `$image` parameter:

```php
if($image = $page->image('sample.jpg')):
  echo $image->imageset('200,400,600');
}
```

### 4.1 Describing Sizes

#### 4.1.1 Single Aspect-Ratio

As most image sizes are defined by their width, ImageKit provides a convenient syntax for. You can either provide a string of comma-separated widths or an array, choose whatever you prefer:

**List of image widths**

```php
echo $image->imageset('200,400,600');
echo $image->imageset([200, 400, 600]);
```

This will generate 3 thumbnails with a width of 200, 400 and 600 pixels. You can provide the sizes either as array or as string of comma-separated values. For better readability, you may also add a space after each comma.

**Range between widths**

```php
echo $image->imageset('200-600');
```

When you specifiy a range, ImageKit will calculate the intermediate sizes automatically. By default, the plugin will generate 2 intermediate sizes, so the example above will create a total of 4 thumbnails at widths of 200, 334, 467 and 600 pixels.

```php
echo $image->imageset('200-600,3');
```

If you need more than 2 intermediate sizes, you can optionally add a parameter to tell ImageSet, how many sizes it should calculate. The example above will create a total of 5 thumbnails at widths of 200, 300, 400, 500 and 600 pixel

**List of cropped sizes**

```php
echo $image->imageset('400x200,800x400');
```

You can also describe explicit width and height parameters for images to create cropped thumbnails.

ℹ️ All images described in one size should have the same aspect-ratio. If you need different crop-ratios for different viewport-sizes, continue reading for more detailed information on more complex usage scenarios.

**Range between cropped sizes**

```php
echo $image->imageset('400x200-800x400');
echo $image->imageset('400x200-800x400,5')
```

You can also provide a range between the smallest and the largest cropped thumbnail you need. Intermediate sizes are calculated automatically. By default, the plugin will generate 2 intermediate sizes. If you need more intermediate sizes, you can specify the number of intermediate sizes you need by appending a comma and the number of sizes you need like shown in the example above.

#### 4.1.2 Multiple Aspect-Ratios

Some scenarios require your images to be cropped in different ratios. Take the full-width hero image of a blog example for example. On large screens, it might be suitable to use a 16:9 format, on smaller devices like a smartphone, a square image might be better so the image needs to be cropped differently.

```php
<?= imageset($page->image('marina.jpg'), [
  [ '320x180-1920x1080,5', 'media' => '(min-aspect-ratio: 3/2)' ],
  [ '320x320-1000x1000,5' ],
]); ?>
```

The example will create an ImageSet with 2 different  aspect-ratios, based on viewport-size. This first size in 16:9 format is only shown when the viewport has an aspect-ratio of 3/2. On taller viewports, the square version of the ImageSet is shown.

#### 4.1.3 The sizes option

The HTML spec requires you to specify the sizes attribute for every `<source>` or `<img>` element with a srcset, that uses width descriptors to make your site pass the HTML validator. 

By default, ImageKit will add `sizes="100vw"` to your images. As long as you use lazy-loading (enabled by default), the plugin will automatically calculate the size based on the current width of an ImageSet. If you disable lazy-loading or the behavior of the `<noscript>`-fallback of ImageSets, you should pass a valid sizes descriptor.

```php
<?= $image->imageset([ '160-1280,6', 'sizes' => '(min-width: 640px) 100vw, 50vw' ]) ?>
```

Further Reading:

- Eric Portis (2014): [Srcset and sizes](http://ericportis.com/posts/2014/srcset-sizes/)

### 4.2 Available options

The following options define the behavior of an ImageSets and need to be passed as an additional parameter when calling the `imageset()` function:

```php
<?= $image->imageset([ '160-1280,6', 'sizes' => '(min-width: 640px) 100vw, 50vw' ], [
    'class'      => 'awesome-image',
    'placeholder => 'blurred',
  ]) ?>
```

You can also define default values for all options by passing setting them in your `config.php` file with a prefix of `imageset.[option name]`:

```php
c::set('imageset.placeholder', 'color');
c::set('imageset.noscript',    false);
```

| Option              | Default value | Possible values | Description                                                                                                                                                                                                                                                     |
|:--------------------|:--------------|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `class` | `''` | – | Additional classes added to the wrapper tag of imagesets. |
| `ratio` | `true` | `true`, `false` | Add ratio-placeholders to imagesets. This reserves space for the images while the page is loading and avoids reflows (aka *page-jumps*) |
| `placeholder` | `'mosaic'` | `false`, `'mosaic'`, `'blurred'`, `'lqip'`, `'color'` | Set‘s the visual style of the placeholder shown while the main image is being loaded. Set to `false` if you don’t want to use a placeholder at all. If placeholders are enabled, the `ratio` option is also automatically enabled. |
| `lazyload` | `true` | `true`, `false` |  Enable/Disable lazy-loading of ImageSets. |
| `noscript` | `true` | `true`, `false` | Includes a fallback for clients with JavaScript disabled. |
| `noscript.priority` | `'ratio'` | `'ratio'`, `'compatibility'` | `ratio` = ImageSet will use the same screen-estate when JavaScript is disabled. Use this option, when a change of an image’s aspect-ratio would destroy your layout. In browsers where neither `object-fit` nor the `<picture>` element is supported, this will lead to skewed images when an ImageSet has different aspect-ratios different viewport sizes *(i.e IE10-11, Edge)*.<br>`compatibility` = ImageSets will always show their fallback-size when JavaScript is disabled. Sizes with different aspect-ratios are ignored. This works in any browser I tested with. |

### 4.3 Kirbytext



### 5 Working with Size Presets


## 7 FAQ & Troubleshooting

**Will ImageSet affect my site’s performance`**<br>

bla …

## 8 License

ImageKit can be evaluated as long as you want on how many private servers you want. To deploy ImageKit on any public server, you need to buy a license. See `license.md` for terms and conditions.

[<img src="https://img.shields.io/badge/%E2%80%BA-Buy%20a%20license-green.svg" alt="Buy a license">](http://sites.fastspring.com/fabianmichael/product/imageset)

However, even with a valid license code, it is discouraged to use it in any project, that promotes racism, sexism, homophobia, animal abuse or any other form of hate-speech.

## 9 Technical Support

Technical support is provided via Email and on GitHub. If you’re facing any problems with running or setting up ImageSet, please send your request to [support@fabianmichael.de](mailto:support@fabianmichael.de) or [create a new issue](https://github.com/fabianmichael/kirby-imageset/issues/new) in this GitHub repository. No representations or guarantees are made regarding the response time in which support questions are answered.

## 10 Credits

ImageSet is developed and maintained by [Fabian Michael](https://fabianmichael.de), a graphic designer & web developer from Germany.
