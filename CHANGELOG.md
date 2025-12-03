Bootstrap Lightbox / Changelog
==============================

## Version 2.0.0 (Stable)
- Add: Replace rollup bundle set-up with vite.
- Add: Separate `singleInstances` and `galleryInstances`, to better access using either element or gallery identifier.
- Update: `package.json` dependencies.
- Update: Clean-Up typings & remove namespace construct.
- Update: Use `overflow-hidden` on `.modal-content` to keep the border-radius.
- Fix: Typings.
- Fix: Prevent adding existing elements to other instances using `invoke()`.

## Version 1.1.1 (Stable)
- Update: Dependencies (+ move from `rollup-plugin-terser` to `@rollup/plugin-terser`).
- Fix: Remove `locale` from `tsconfig.json` file.

## Version 1.1.0 (Stable)
- Add: New `lightbox.loader` option to pre-load images within the carousel.
- Add: New `lightbox.replacePictures` option to force using the linked source instead of the picture one.
- Add: Bootstrap v4 / Bootstrap v5 compatible spinner.
- Fix: Don't clear events on `.dispose()`.

## Version 1.0.3 (Stable)
- Fix: `package.json`.

## Version 1.0.2 (Stable)
- Fix: `package.json`.

## Version 1.0.1 (Stable)
- Fix: TypeScript typings.

## Version 1.0.0 (Stable)
- Initial Release
