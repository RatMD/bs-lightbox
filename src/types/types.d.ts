
export interface LightboxItem {
    source: HTMLElement;
    image: HTMLImageElement | HTMLPictureElement;
    title: string;
    caption: string;
}

export type LightboxEventNames_Carousel = 'slid.bs.carousel' | 'slide.bs.carousel';
export type LightboxEventNames_Lightbox = '';
export type LightboxEventNames_Modal = 'hide.bs.modal' | 'hidden.bs.modal' | 'hidePrevented.bs.modal' | 'show.bs.modal' | 'shown.bs.modal';

export type LightboxEventNames = LightboxEventNames_Carousel | LightboxEventNames_Modal;
