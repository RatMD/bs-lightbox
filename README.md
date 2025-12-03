Bootstrap Lightbox
==================
**@rat.md/bs-lightbox** is a lightweight lightbox system built on the Bootstrap-native Carousel and 
Modal components. It works seamlessly with **Bootstrap 5** and **Bootstrap 4** without forcing any 
bespoke styling on you. Lucky you!

- [View Examples and Documentation](https://ratmd.github.io/bs-lightbox/)

## Features
- Fully compatible with **Bootstrap v5** and **Bootstrap v4**
- Native **lightbox** functionality powered by Bootstrap’s **Carousel** and **Modal**
- No additional stylesheets or CSS overrides required, purely Bootstrap components and utility classes
- Full access to all Carousel and Modal **options** and **events**
- Straightforward but capable API and methods
- Available as **UMD** and **ES** JavaScript modules WITH typings
- **Free to use** and written in clean **TypeScript**

## Installation
Download the latest release of **@rat.md/bs-lightbox** from the [official GitHub release page](https://github.com/RatMD/bs-lightbox/releases),
or install it via npm:

```sh
npm i @rat.md/bs-lightbox
``` 

## Getting Started
**@rat.md/bs-lightbox** does not ship with its own stylesheet. It relies entirely on Bootstrap’s 
component and utility classes. Since the package does not include a bundled Bootstrap build, ensure 
that Bootstrap’s JavaScript is loaded **before** rat.lightbox.

```html
<html>
<head>
    <!-- Include Bootstrap CSS -->
    <link href="path/to/your/bootstrap.min.css" rel="stylesheet" />
</head>
<body>

    <!-- Simple Lightbox -->
    <img src="path/to/your/image.jpg" data-bs-handle="lightbox" />

    <!-- Include Bootstrap JS -->
    <script src="path/to/your/js/bootstrap.bundle.min.js"></script>

    <!-- Include @rat.md/bs-lightbox JS -->
    <script src="path/to/your/js/rat.lightbox.min.js"></script>

    <!-- Invoke the Lightbox on all valid components -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            rat.Lightbox.invoke();
        });
    </script>
</body>
</html>
```

### The ES-Module way
Depending on how you load Bootstrap, you may need to manually assign the Carousel and Modal 
prototypes, as shown below.

```js
import { Carousel, Modal } from 'bootstrap'; // Optional, depending on your setup
import { Lightbox } from '../esm/rat.lightbox.min.js';

// Only required if the global 'bootstrap' object is not present
Lightbox.CAROUSEL = Carousel;
Lightbox.MODAL = Modal;

// Invoke as usual. Ensure the call runs after the DOM is ready.
Lightbox.invoke(
    null, // Custom or default selector
    {}    // Custom configuration
);
```

## Copyright & Licence
Published under the MIT License \
Copyright © 2021 - 2026 rat.md <info@rat.md>
