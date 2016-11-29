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
  - [3.3 Kirbytext](#33-kirbytext)
  - [3.4 Size Presets](#34-size-presets)
- [5 Global Configuration](#5-global-configuration)
- [7 FAQ & Troubleshooting](#7-faq-&-troubleshooting)
- [8 License](#8-license)
- [9 Technical Support](#9-technical-support)
- [10 Credits](#10-credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

***

## 1 Key Features

- **Responsive Images** Add responsive images in different sizes to your website, using HTML5 compatible markup (`<picture>` element and `srcset`-attribute).
- **Lazy-Loading** ImageSet supports lazy-loading for saving valuable bandwidth on mobile and faster page loads for everyone.*
-  **Placeholders & Ratios** ImageSet comes with placeholders in 4 beautiful styles and reserves screen space for images before they are loaded to avoid reflows *page-jumps*.
-  **Art Direction** Define different sizes for different screen sizes and/or media types. Supports different crop ratios as well as multiple source images per ImageSet.
-  **Noscript-Fallback** In case of doubt, it even works without JavaScript or HTML5 support.

*) Lazy-loading uses lazysizes and requires JavaScript to be activated in the user’s browser.

***

## 2 Download and Installation

### 2.1 Requirements

#### 2.1.1 Server

-  PHP 5.4.0+
-  Kirby 2.3.0+
-  GD Library for PHP or ImageMagick command-line tools to resize images.
-  [ImageKit for Kirby CMS](https://github.com/fabianmichael/kirby-imagekit) 1.1.0+ *(optional, but recommended for sites with a lot of images)*

#### 2.1.2 Browser Support

ImageSet has been tested in the following browsers, but should work with any browser that supports modern web standards:

| Internet Explorer | Edge    | Firefox | Safari (OS X) | Safari (iOS) | Opera | Chrome |
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
    /*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
    var loadJS = function(src, cb) {
      "use strict";
      var ref = w.document.getElementsByTagName("script")[0];
      var script = w.document.createElement("script");
      script.src = src;
      script.async = true;
      ref.parentNode.insertBefore(script, ref);
      if (cb && typeof(cb) === "function") {
        script.onload = cb;
      }
      return script;
  };
  if(!window.HTMLPictureElement){
    d.createElement('picture');
    loadJS("<?= url('assets/plugins/imageset/js/dist/respimage.min.js') ?>");
  }
})(window, document);
</script>
```

Alright, now everything should work. For a development site, this method is completely fine. However, if performance is critical for your project, it is highly recommended to place a copy of the JS and CSS files linked above in your `assets` directory and link to these or to bundle up the ImageSet’s files with your regular CSS and JS.

## 3 Usage

### 3.2 Template Usage

### 3.3 Available options

### 3.3 Kirbytext

### 3.4 Size Presets

## 5 Global Configuration

| Option              | Default value | Description                                                                                                                                                                                                                                                     |
|:--------------------|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imagekit.license`    | `''`          | Enter your license code here, once your site goes live.<br>[<img src="https://img.shields.io/badge/%E2%80%BA-Buy%20a%20license-green.svg" alt="Buy a license">](http://sites.fastspring.com/fabianmichael/product/imagekit)                                                                                                                                                                       |



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
