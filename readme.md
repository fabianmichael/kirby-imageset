<img src="https://fabianmichael.de/shared/imagekit-logo-github.png" alt="Imagekit Logo" width="120" height="120" />

# ImageSet

![GitHub release](https://img.shields.io/github/release/fabianmichael/kirby-imageset.svg?maxAge=2592000) ![License](https://img.shields.io/badge/license-commercial-green.svg) ![Kirby Version](https://img.shields.io/badge/Kirby-2.3%2B-red.svg)

A flexible, responsive image component for [Kirby CMS](http://getkirby.com), featuring lazy-loading, fancy placeholders and much more.

**NOTE:** This is not be a free plugin. In order to use it on a production server, you need to buy a license. For details on ImageSet’s license model, scroll down to the [License](#license) section of this document.

{{{ SCREENSHOTS }}}

***

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [1 Key Features](#1-key-features)
- [2 Download and Installation](#2-download-and-installation)
  - [2.1 Requirements](#21-requirements)
  - [2.2 Kirby CLI](#22-kirby-cli)
  - [2.3 Git Submodule](#23-git-submodule)
  - [2.4 Copy and Paste](#24-copy-and-paste)
- [3 Usage](#3-usage)
- [4 How it works](#4-how-it-works)
  - [4.1 Discovery mode](#41-discovery-mode)
- [5 Basic Configuration](#5-basic-configuration)
- [6 Image Optimization](#6-image-optimization)
  - [6.1 Setup](#61-setup)
  - [6.2 Overriding Global Settings](#62-overriding-global-settings)
  - [6.3 Available Optimizers](#63-available-optimizers)
    - [6.3.1 mozjpeg](#631-mozjpeg)
    - [6.3.2 jpegtran](#632-jpegtran)
    - [6.3.3 pngquant](#633-pngquant)
    - [6.3.4 optipng](#634-optipng)
    - [6.3.5 gifsicle](#635-gifsicle)
- [7 Troubleshooting](#7-troubleshooting)
- [8 License](#8-license)
- [9 Technical Support](#9-technical-support)
- [10 Credits](#10-credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

***

## 1 Key Features

- **Responsive Images:** Add responsive images in different sizes to your website, using HTML5 compatible markup (`<picture>` element and `srcset`-attribute).
- **Lazy-Loading:** ImageSet supports lazy-loading for saving valuable bandwidth on mobile and faster page loads for everyone.*
-  **Placeholders & Ratios:** ImageSet comes with placeholders in 4 beautiful styles and reserves screen space for images before they are loaded to avoid reflows *page-jumps*.
-  **Noscript-Fallback:** In case of doubt, it even works without  JavaScript or HTML5 support.
-  **Art Direction:** Define different sizes for different screen sizes and/or media types. Supports different crop ratios as well as multiple source images per ImageSet.

*) Lazy-loading uses lazysizes and requires JavaScript to be activated in the user’s browser.

***

## 2 Download and Installation

### 2.1 Requirements

#### 2.1.1 Server

-  PHP 5.4.0+
-  Kirby 2.3.0+
-  GD Library for PHP or ImageMagick command-line tools to resize images.

#### 2.1.2 Client

ImageSet should has been tested in the following browsers, but should work with any browser that supports modern web standards:

| Internet Explorer | Edge    | Firefox | Safari | Safari (iOS) | Opera | Chrome |
|:-----------------:|:-------:|:-------:|:------:| :-----: | :-----: | :----: |
| 10+               | ✓       | ✓       | 9+     | 9+      | 28+ | 41+ |

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



## 3 Usage

### 3.2 Template Usage

### 3.3 Kirbytext

### 3.4 Size Presets

## 4 

## 5 Configuration

| Option              | Default value | Description                                                                                                                                                                                                                                                     |
|:--------------------|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imagekit.license`    | `''`          | Enter your license code here, once your site goes live.<br>[<img src="https://img.shields.io/badge/%E2%80%BA-Buy%20a%20license-green.svg" alt="Buy a license">](http://sites.fastspring.com/fabianmichael/product/imagekit)                                                                                                                                                                       |
| `imagekit.lazy`       | `true`        | Set to `false` to temporary disable asynchronous thumbnail generation. This will restore the default behavior of Kirby.                                                                                                                                         |
| `imagekit.complain`   | `true`        | If enabled, ImageKit will try to return a placeholder showing an error symbol whenever thumbnail creation fails. If you don’t like this behavior, you can turn this feature off and ImageKit will fail silently.
| `imagekit.widget`     | `true`        | Enables the dashboard widget.                                                                                                                                                                                                                                   |
| `imagekit.widget.step` | `5`           | Sets how many pending thumbnails will be generated by the widget in one step. If thumbnail generation exceeds the max execution time on your server, you should set this to a lower value. If your server is blazingly fast, you can safely increase the value. |
| `imagekit.widget.discover` | `true`   | If enabled, the widget scans your whole site before creating thumbnails. If this feature is not compatible with your setup, disable it. It can also take very long on large site, every single page has to be rendered in order to get all pending thumbnails. In order to do this, the plugin will flush your site cache before running. |

## 6 Image Optimization

### 6.1 Setup

As of *version 1.1*, ImageKit is also capable of optimizing thumbnails. There are different optimizers, providing both lossless and lossy optimization. It works similar to third-party services (e.g. [TinyPNG](https://tinypng.com/), [Kraken.io](https://kraken.io/)), but on your own server. If you want to use this feature, you have to install the corresponding command-line utilities first—if they’re not already installed on your server.

ℹ️ If your hosting provider doesn’t let you compile software on your webspace (most likely for shared hosting), you can get binaries for most operation systems from a WordPress plugin called [EWWW-Image-Optimizer](https://wordpress.org/plugins/ewww-image-optimizer/). Just download the plugin and upload it’s the pre-compiled utilities to your server (look into the folder `binaries` within the ZIP archive). There are many other places, where you can get pre-compiled versions of the image optimation tools, but please be careful and do not download any of these tools from some strange russian server. The only tool I couldn’t find as a pre-compiled binary for Linux / OS X hosts is `mozjpeg`.


| Option              | Default value | Description |
|:--------------------|:--------------|:------------|
| `imagekit.optimize`   | `false`       | Set to `true` to enable optimization. In addition, you have to configure at least one of the optimizers listed below. |
| `imagekit.driver` | `null` | This option only needs to be set, if your Kirby installation uses a custom ImageMagick driver, that has a different name than `'im'`. If this is the case, set this value to `'im'` to tell ImageKit, that you’re using ImageMagick for thumbnail processing, as there is no other way to detect this reliably. In most cases, you can safely ignore this setting.<br>*This settings does not change the thumbs driver to ImageMagick! If you want to use ImageMagick as your image processing backend, please refer to the corresponding pages in the Kirby documentation or have a look into the troubleshooting section of this document.*  |

By default, all optimizers will be loaded and ImageKit checks if you have set the path to a valid binary (e.g. `imagekit.mozjpeg.bin`). If the binary is set and executable, ImageKit will then activate the optimizer automatically for supported image types. All optimizers come with a sane default configuration, but you can tweak them according to your needs.

### 6.2 Overriding Global Settings

If you need different optimization configuration settings for different images, you can override any of the settings (except for the path to an optimizers’s binary) you defined in `config.php` by passing them to the `thumb()` method. The parameter `imagekit.optimize` can also take an array of optimizers. Note, that optimizers will only become active, if the input image is in a format supported by them (e.g. If you provide a JPEG to the example below, `pngquant` will be skipped, because it can only handle PNG images.)

```php
$page->image()->thumb([
  'width'                    => 600,
  'imagekit.optimize'        => ['mozjpeg', 'pngquant'],
  'imagekit.mozjpeg.quality' => 60,
]);
```

Overriding global settings might become useful, if you want to apply lossless optimization for some images and lossy optimization for others. A typical use-case would be a photo gallery with lots of small preview images on an index page, where you want to squeeze the last byte out of your thumbnails using `mozjpeg`. For the enlarged view of a photo, image quality might be more important than filesize, so you might prefer `jpegtran` over `mozjpeg` for lossless optimization.

### 6.3 Available Optimizers

#### 6.3.1 mozjpeg

Mozjpeg is an improved JPEG encoder that produces much smaller images at a similar perceived quality as those created by GD Library, ImageMagick, or Photoshop. I really recommend to try out this optimizer, because it can significantly reduce the size of your thumbnails.

[<img src="https://img.shields.io/badge/%E2%80%BA-Download%20mozjpeg-lightgrey.svg" alt="Download mozjpeg">](https://github.com/mozilla/mozjpeg) 

| Option              | Default value | Possible Values | Description |
|:--------------------|:--------------|:------------|:------------|
| `imagekit.mozjpeg.bin`   | `null`       | — | Enter the path to mozjpeg’s encoder executable (`cjpeg`) to activate this optimizer.<br>*(tested with mozjpeg 3.1)* |
| `imagekit.mozjpeg.quality` | `85` | `0-100` | Sets the quality level of the generated image. Choose from a scale between 0-100, where 100 is the highest quality level. The scale is not identical to that of other JPEG encoders, so you should try different settings and compare the results if you want to get the optimal results for your project.
| `imagekit.mozjpeg.flags` | `''` | — | Use this parameter to pass additional options to the optimizer. Have a look at mozjpeg’s documentation for available flags. |

ℹ️ I recommend that you don’t upscale images that have been compressed by `mozjpeg`, bacause it will add a lot of artifacts to thumbnails. Those are mostly invisible when the image is viewed at full size or downscaled. But they can give your images an unpleasant look, if they’re upscaled.

#### 6.3.2 jpegtran

Jpegtran applies lossless compression to your thumbnails by optimizing the JPEG data and stripping out metadata like EXIF. If you use mozjpeg, there is no reason to also use jpegtran, as my tests did not show any benefit in thumbnail size, when both are used together.

[<img src="https://img.shields.io/badge/%E2%80%BA-Download%20jpegtran-lightgrey.svg" alt="Download jpegtran">](http://jpegclub.org/jpegtran/)

| Option              | Default value | Possible Values | Description |
|:--------------------|:--------------|:------------|:------------|
| `imagekit.jpegtran.bin` | `null` | — | Enter the path to the optipng executable to activate this optimizer.<br>*(tested with jpegtran 0.7.6)* |
| `imagekit.jpegtran.optimize` | `true` | `true`, `false` | Enables lossless optimization of image data. |
| `imagekit.jpegtran.copy` | `'none'` | `'all'`, `'comments'`, `'none'` | Sets which metadata should be copied from source file. |
| `imagekit.jpegtran.flags` | `''` | — | Use this parameter to pass additional options to the optimizer. Have a look at jpegtran’s documentation for available flags. |

#### 6.3.3 pngquant

Pngquant performs lossy optimization on PNG images by converting 24-bit images to indexed color (8-bit), while alpha-transparency is kept. The files can be displayed in all modern browsers and this kind of lossy optimization works great for most non-photographic images and screenshots. You may notice some color shifts on photographic images with a lot of different colors (you usually should not use PNG for displaying photos on the web anyway …).

[<img src="https://img.shields.io/badge/%E2%80%BA-Download%20pngquant-lightgrey.svg" alt="Download pngquant">](https://pngquant.org/)

| Option              | Default value | Possible Values | Description |
|:--------------------|:--------------|:------------|:------------|
| `imagekit.pngquant.bin` | `null` | — | Enter the path to the `pngquant` executable to activate this optimizer.<br>*(tested with optipng 2.7.2)* |
| `imagekit.pngquant.quality` | `null` | `null`, `'min-max'` (e.g. `'0-100'`) | Sets minimum and maximum quality of the resulting image. Has to be a string. |
| `imagekit.pngquant.speed` | `3` | `1` = slow,<br>`3` = default,<br>`11` = fast & rough |Slower speed means a better quality, but optimization takes longer *(for large images from a few megapixels and above, we’re talking about tens of seconds or even minutes, when using a speed setting of `1`)*. |
| `imagekit.pngquant.posterize` | `false` | `false`,<br>`0-4` | Output lower-precision color if set to further reduce filesize. |
| `imagekit.pngquant.colors` | `false` | `false`, `2`-`256`| Sets the number of colors for optimized images. Less colors mean smaller images, but also reduction of quality. |
| `imagekit.pngquant.flags` | `''` | — | Use this parameter to pass additional options to the optimizer. Have a look at pngquant’s documentation for available flags. |

#### 6.3.4 optipng

Optipng performs lossless optimizations on PNG images by stripping meta data and optimizing the PNG data itself.

[<img src="https://img.shields.io/badge/%E2%80%BA-Download%20optipng-lightgrey.svg" alt="Download optipng">](http://optipng.sourceforge.net/)

| Option              | Default value | Possible Values | Description |
|:--------------------|:--------------|:------------|:------------|
| `imagekit.optipng.bin` | `null` | — | Enter the path to the `optipng` executable to activate this optimizer.<br>*(tested with optipng 0.7.6)* |
| `imagekit.optipng.level` | `2` | `0`-`7` | Sets the optimization level. Note, that a high optimization level can make processing of large image files very slow, while having only little impact on filesize. |
| `imagekit.optipng.strip` | `'all'` | `'all'`, `false` | Strips all metadata from the PNG file. | 
| `imagekit.optipng.flags` | `''` | — | Use this parameter to pass additional options to the optimizer. Have a look at optipng’s documentation for available flags. |

#### 6.3.5 gifsicle

Gifsicle optimizes the data of GIF images. Especially for animations, using this optimizer can lead to a great improvement in file size, but can also take very long for large animations. Static GIF images will also benefit from using Gifsicle.

[<img src="https://img.shields.io/badge/%E2%80%BA-Download%20gifsicle-lightgrey.svg" alt="Download gifsicle">](https://www.lcdf.org/gifsicle/) 

| Option              | Default value | Possible Values | Description |
|:--------------------|:--------------|:------------|:------------|
| `imagekit.gifsicle.bin` | `null` | — | Enter the path to the `optipng` executable to activate this optimizer.<br>*(tested with optipng 1.88)* |
| `imagekit.gifsicle.level` | `3`  | `false`, `1`-`3` | Sets the level of optimization, where `3` is the highest possible value. |
| `imagekit.gifsicle.colors` | `false` | `false`, `2`-`256` | Sets the amount of colors in the resulting thumbnail. By default, color palettes are not reduced. |
| `imagekit.gifsicle.flags` | `''` | — | Use this parameter to pass additional options to the optimizer. Have a look at gifsicle’s documentation for available flags. |

## 7 Troubleshooting

**How can I activate ImageMagick?**<br>
As ImageKit acts as a proxy for Kirby’s built-in thumbnail engine, you have to activate it on your `config.php` file, just as you would do without ImageKit like below:
```
c::set('thumbs.driver','gd');
c::set('thumbs.bin', '/usr/local/bin/convert');
```
&rarr; Kirby documentation for [`thumbs.driver`](https://getkirby.com/docs/cheatsheet/options/thumbs-driver) and [`thumbs.bin`](https://getkirby.com/docs/cheatsheet/options/thumbs-bin)

*Please note, that Kirby uses the command-line version of ImageMagick, rather than its PHP extension. In order to use ImageMagick as your processing backend, the ImageMagick executable (`convert`) has to be installed on your server.*

**Thumbnail creation always fails …**<br>
This may happen because of several reasons. First, make sure that your thumbs folder is writable for Kirby. If you’re using the GD Library driver, make sure that PHP’s memory limit is set to a high-enough value. Increasing the memory limit allows GD to process larger source files. Or if you favor ImageMagick (I do), make sure that the path to the `convert` executable is correctly configured.

**The Discovery Feature does not work with my site:**<br>
Discovery works by creating a sitemap of your entire site and then sends an HTTP request to every of those URLs to trigger rendering of every single page. When doing so, ImageKit sees everything from a logged-in user’s perspective. It tries it’s best to find pagination on pages, but it cannot create thumbnails whose are – for example – only available on a search results page, where entries are only displayed when a certain keyword was entered into a form. Also make sure, that your Server’s PHP installation comes with `libxml`, which is used by PHP’s DOM interface.

**Can I also optimize the images in my content folder?**<br>
This is currently not possible, because it would need a whole UI for the admin panel and would also be very risky to apply some bulk processing on your source images without knowing the actual results of optimization. If you need optimized images in your content folder, I really recommend that you use tools like [ImageOptim](https://imageoptim.com/mac) and [ImageAlpha](https://pngmini.com/) to optimize your images prior to uploading them. This saves space on your server and also speeds up your backups.

## 8 License

ImageKit can be evaluated as long as you want on how many private servers you want. To deploy ImageKit on any public server, you need to buy a license. See `license.md` for terms and conditions.

[<img src="https://img.shields.io/badge/%E2%80%BA-Buy%20a%20license-green.svg" alt="Buy a license">](http://sites.fastspring.com/fabianmichael/product/imagekit)

However, even with a valid license code, it is discouraged to use it in any project, that promotes racism, sexism, homophobia, animal abuse or any other form of hate-speech.

## 9 Technical Support

Technical support is provided via Email and on GitHub. If you’re facing any problems with running or setting up ImageKit, please send you request to [support@fabianmichael.de](mailto:support@fabianmichael.de) or [create a new issue](https://github.com/fabianmichael/kirby-imagekit/issues/new) in this GitHub repository. No representations or guarantees are made regarding the response time in which support questions are answered.

## 10 Credits

ImageKit is developed and maintained by [Fabian Michael](https://fabianmichael.de), a graphic designer & web developer from Germany.
