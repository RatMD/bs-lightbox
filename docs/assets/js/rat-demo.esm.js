
import { Lightbox } from '../../dist/esm/rat.lightbox.js';

Lightbox.CAROUSEL = bootstrap.Carousel;
Lightbox.MODAL = bootstrap.Modal;

hljs.highlightAll();

document.addEventListener('DOMContentLoaded', () => {
    Lightbox.invoke();

    let demo = document.querySelector('[data-bs-gallery="demo"]')
    let lightbox = Lightbox.getInstance(demo);

    lightbox.on('slid.bs.carousel', () => {
        console.log('slid.bs.carousel');
    });
    lightbox.on('slide.bs.carousel', () => {
        console.log('slide.bs.carousel');
    });
    lightbox.on('hide.bs.modal', () => {
        console.log('hide.bs.modal');
    });
    lightbox.on('hidden.bs.modal', () => {
        console.log('hidden.bs.modal');
    });
    lightbox.on('show.bs.modal', () => {
        console.log('show.bs.modal');
    });
    lightbox.on('shown.bs.modal', () => {
        console.log('shown.bs.modal');
    });
});