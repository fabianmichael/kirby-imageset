# ImageSet Changelog

- `1.1.0-beta2` (2018/03/03)
  - [Enhancement] Extensive rewrite of frontend code in ES6-compatible syntax, using a new approach for imageset loading.
  - [Enhancement] The build process now uses webpack (except for the readme) instead of Gulp for besser handling of dependencies in the script.
  - [Removed] Removed settings API, because it’s benefits are neglectable while it adds lots of complexity.
  - [Breaking] Removed IE 10 from the list of supported browsers … he’s dead, Jim! Also replaced support for "Edge 12+" with "✓", because Edge has a rolling release-cycle.
  - [Breaking] Raised PHP support to 5.6, because I won’t test new features on older versions than that any more in the future.
  - [Readme] Removed settings API section.
  - [Readme] Added note how to set `display: block` to all image sets.

- `1.1.0-beta1` (2017/09/08)
  - [Fix] Fix mosaic placeholder rendering rendered too small.
  - [Fix] Remove double-loading settings from config
  - [Feature] Add JavaScript configuration and API
  - [Enhancement] Better error message when thumbs directory is missing.
  - [Feature] Display a broken file icon, when an image couldn’t be loaded and display alt text, if provided.
  - [Enhancement] Make all placeholder sources inline again to guarantee instand placeholder rendering after page load. This increases the initial HTML payload a bit, but results in fewer requests afterwards.
  - [Fix] Using the color placeholder style on a completely transparent image will not cause the plugin to fail any more.

- `1.0.1` (2017/03/22)
  - Fixes a problem that caused the dynamic presets API to throw a fatal error.

- `1.0.0` (2017/03/16)
  - Fix alt attribute not added under certain conditions.

- `1.0.0-rc1` (2017/03/11)
  - **Leaner CSS classes:** I decided to switch from full-blown BEM syntax to a leaner scheme for ImageKit’s class names. As ImageSet already produces a lot of CSS classes and those will become possibly more as new features are added, BEM seems to be to verbose to keep the generated HTML source readable. The new scheme uses shorter classes for modifiers and state.
  - **CSS:** Fix collisions with responsive image rules from inuit.css (and possibly other frameworks).
  - **Fix some errors in Opera Mini** regarding distorted images and JavaScript errors.
  - **Improved noscript-fallback:** Removed `noscript.priority`, because due to better CSS positioning of the placeholder, it is not needed any more.
  - **SASS:** Adjusted SASS file by removing nested selectors for better readibility.

- `1.0.0-beta2` (2017/01/27)
  - **Caching** ImageSets are now cached, so existance checks on load can be skipped after the first page load, resulting in major speed bumps. Can be disabled in options.
  - **Improved Transparency Detection** now also works for 8-bit palette GIF or PNG images.
  - **Better Image IDs** Some ImageSet require custom CSS rules and thus need a unique ID to target them. IDs now have more entropy and are less likely to collide.
  - **New placeholder style** Triangle mosaic, uses canvas-based rendering.
  - **Updated embed code** Offers better performance on page load by executing some JavaScript earlier.

- `1.0.0-beta1` (2017/01/02)
  - **Improved JavaScript Code:** Switched from SVG filters to canvas for better-looking blur effect and better cross-browser compatibility. Also seems to offer better scrolling-performance.
  - **SVG support:** ImageSet will not crash any more, if source image is an SVG file but instead print a basic ImageSet without placeholder.
  - **XHTML-compatible Output** can now be configured using the `output.xhtml` setting.
  - **Transparency:** Placeholders now work properly with images, that have alpha transparency.
  - **Readability:** `imageset.php` snippet is way more readable now.

- `1.0.0-alpha1` (2016/12/09)
  - First public release
