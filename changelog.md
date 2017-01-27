# ImageSet Changelog

- `1.0.0-beta2`
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
