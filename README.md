@rat.md / bs-lightbox
=====================
**bs-lightbox** is a simple Lightbox system based on the Bootstrap-native Carousel and Modal 
components, compatible with **Bootstrap 5** and **Bootstrap 4**.

- [View some Examples & the Documentation](https://ratmd.github.io/bs-lightbox/)

Features
--------

- Compatible with **Bootstrap v5** and **Bootstrap v4**
- Native **Lightbox** environment using Bootstraps **Carousel** & **Modal** components
- No stylesheet or CSS overwrites, just Bootstraps component & utility classes
- Access to all Carousel & Modal **options** and **events**
- Simple but useful API & Methods
- Available as **ES6** compiled JavaScript and as **ES Module**
- **Free/To/Use** and written in **Vanilla JS**


Installation
------------

You can download the latest release of the **bs-lightbox** package directly on the 
[Release Page of the official GitHub repository](https://github.com/RatMD/bs-lightbox/releases), 
alternatively you can also receive your copy of this script using npm:

```
npm i @rat.md/bs-lightbox
```


Usage
-----
**bs-lightbox** does not provide an own stylesheet, instead it just relies on the Bootstrap-native
component and utility classes. Since **bs-lightbox** does not provide any bundled JS version, you've 
to make sure that Bootstrap's JavaScript library is loaded BEFORE the `rat.lightbox` file.

```html
<html>
    <head>
        <!-- Include Bootstrap CSS -->
        <link href="path/to/your/css/bootstrap.min.css" />
    </head>
    <body>
        
        <!-- Simple Lightbox -->
        <img src="path/to/your/image.jpg" data-bs-handle="lightbox" />

        <!-- Include Bootstrap JS -->
        <script src="path/to/your/js/bootstrap.bundle.min.js"></script>

        <!-- Include @rat.md/bs-lightbox JS -->
        <script src="path/to/your/js/rat.lightbox.min.js"></script>

        <!-- Invoke Lightbox on all valid components -->
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                rat.Lightbox.invoke();
            });
        </script>
    </body>
</html>
```

### Usage as ES Module
**bs-lightbox** does also provide an ES-Module version, which can be found in the `dist/esm` folder. 
Depending on how you're including Bootstrap, you probably need to append the Carousel and Modal 
prototype objects / classes manually, as shown below.

```javascript
import { Carousel, Modal } from 'bootstrap';                // Optional, depending on your usage
import { Lightbox } from '../esm/rat.lightbox.min.js';

// The following lines are only necessary, if the 'bootstrap' global is not added
Lightbox.CAROUSEL = Carousel;
Lightbox.MODAL = Modal; 

// Go on as usual, make sure the following line is execute when the DOM is ready.
Lightbox.invoke(
    null,       // Custom or Default selector
    {}          // Custom Configurations
);
```


Copyright &License
-------
Written and Copyright by [rat.md](https://www.rat.md).

Published under der MIT license.
