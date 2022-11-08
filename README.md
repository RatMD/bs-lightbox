@rat.md / bs-lightbox
=====================
**bs-lightbox** is a simple Lightbox system based on the Bootstrap-native Carousel and Modal 
components, compatible with **Bootstrap 5** and **Bootstrap 4**.


Features
--------

- Compatible with **Bootstrap v5** and **Bootstrap v4**
- Native **Lightbox** environment using Bootstraps **Carousel** & **Modal** components
- No stylesheet or CSS overwrites, just Bootstraps component & utility classes
- Access to all Carousel & Modal **options** and **events**
- Simple but useful API & Methods
- **Free/To/Use** and written in **Vanilla JS**


Usage
-----

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


Copyright &License
-------
Written and Copyright by [rat.md](https://www.rat.md).

Published under der MIT license.
