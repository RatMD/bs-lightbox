
import type { Carousel, Modal } from 'bootstrap';
import type { LightboxConfig, LightboxEventNames, LightboxItem } from '../types';

class Lightbox {

    /**
     * Internal jQuery Pointer (for Bootstrap v4)
     */
    private static _jquery = null;

    /**
     * Internal Bootstrap Carousel Pointer
     */
    private static _carousel = null;

    /**
     * Internal Bootstrap Modal Pointer
     */
    private static _modal = null;

    /**
     * Get Component Name
     */
    static get NAME(): string {
        return 'lightbox';
    }

    /**
     * Get Component Version
     */
    static get VERSION(): string {
        return '__VERSION__';
    }
    /**
     * Default Configuration
     */
    static get DEFAULTS(): LightboxConfig {
        return {
            carousel: {
                id: null,
                controls: true,
                indicators: false,
                interval: 5000,
                keyboard: true,
                pause: 'hover',
                ride: false,
                touch: true,
                wrap: true
            },
            modal: {
                id: null,
                backdrop: true,
                focus: true,
                keyboard: true,
                size: 'xl'
            }
        }
    }

    /**
     * Get Bootstrap Modal Prototype / Object
     */
    static get $() {
        let jquery =  Lightbox._jquery || window['$'] || window['jQuery'];
        if (!jquery) {
            throw new Error('No jQuery object found, please use Lightbox.$ = <jQuery>.');
        }
        return jquery;
    }

    /**
     * Set jQuery Prototype / Object
     */
    static set $(jQuery) {
        Lightbox._jquery = jQuery;
    }

    /**
     * Get Bootstrap Carousel Prototype / Object
     */
    static get CAROUSEL() {
        let carousel =  Lightbox._carousel || (window['bootstrap'] || window['Bootstrap'] || {}).Carousel;
        if (!carousel) {
            throw new Error('No Bootstrap Carousel prototype found, please use Lightbox.CAROUSEL = <Bootstrap.Carousel>.');
        }
        return carousel;
    }

    /**
     * Set Bootstrap Carousel Prototype / Object
     */
    static set CAROUSEL(object) {
        Lightbox._carousel = object;
    }

    /**
     * Get Bootstrap Modal Prototype / Object
     */
    static get MODAL() {
        let modal =  Lightbox._modal || (window['bootstrap'] || window['Bootstrap'] || {}).Modal;
        if (!modal) {
            throw new Error('No Bootstrap Modal prototype found, please use Lightbox.MODAL = <Bootstrap.Modal>.');
        }
        return modal;
    }

    /**
     * Set Bootstrap Modal Prototype / Object
     */
    static set MODAL(object) {
        Lightbox._modal = object;
    }

    /**
     * Default Lightbox Selector
     */
    static get SELECTOR(): string {
        return '[data-toggle="lightbox"],' +
               '[data-bs-toggle="lightbox"],' +
               '[data-rat-lightbox]';
    }

    /**
     * Lightbox instances. 
     */
    public static instances: Map<string|HTMLElement, Lightbox> = new Map;

    /**
     * Invoke Lightbox Elements.
     * @param selector 
     */
    public static invoke(selector: null|string = null, config: Partial<LightboxConfig> = {}): Lightbox[] {
        selector = typeof selector !== 'string' ? this.SELECTOR : selector;
        return Array.from(document.querySelectorAll(selector), (el: HTMLElement) => {
            return this.getOrCreateInstance(el, config);
        });
    }

    /**
     * Check if instance from HTMLElement or Gallery string exists.
     * @param data 
     * @returns 
     */
    public static hasInstance(data: HTMLElement|string): boolean {
        if (typeof data === 'string') {
            return this.instances.has(data);
        } else {
            let item = data.hasAttribute('data-bs-gallery') ? data.dataset.bsGallery : data;
            return this.instances.has(item);
        }
    }

    /**
     * Get instance from HTMLElement or Gallery string
     * @param source 
     * @returns 
     */
    public static getInstance(source: HTMLElement|string): Lightbox|null {
        if (typeof source === 'string') {
            return this.instances.has(source) ? this.instances.get(source) : null;
        } else {
            let key = source.dataset.bsGallery || source.dataset.gallery || source;
            return this.instances.has(key) ? this.instances.get(key) : null;
        }
    }

    /**
     * Create a new instance, or get an existing and append passed element
     * @param element
     * @returns 
     */
    public static getOrCreateInstance(element: HTMLElement, config: Partial<LightboxConfig> = {}): Lightbox {
        let instance = this.getInstance(element);

        if (instance === null) {
            instance = new this(element, config);
        } else {
            instance.append(element);
        }

        return instance;
    }


    /**
     * Lightbox instance configuration
     */
    public config: LightboxConfig;

    /**
     * Legacy indicator if Bootstrap v4 or v5 is used.
     */
    public legacy: boolean;

    /**
     * Lightbox Items
     */
    public items: Map<HTMLElement, LightboxItem> = new Map;

    /**
     * Configured Events
     */
    public events: Map<LightboxEventNames, Set<EventListener>> = new Map;

    /**
     * Root Lightbox Container
     */
    public lightbox: HTMLElement|null;

    /**
     * Bootstrap Carousel instance
     */
    public carousel: Carousel|null;

    /**
     * Bootstrap Modal instance
     */
    public modal: Modal|null;

    /**
     * OnKeyUp Event Listener
     */
    private onKeyUpListener: EventListener;

    /**
     * Create a new Lightbox instance.
     * @param element 
     * @param config 
     */
    public constructor(element: HTMLElement, config: Partial<LightboxConfig> = {}) {
        let key = element.dataset.bsGallery || element.dataset.gallery || element;
        if (Lightbox.instances.has(key)) {
            throw new Error('An instance with the passed element or gallery has already been created.');
        }
        Lightbox.instances.set(key, this);

        // Legacy Indicator
        this.legacy = Lightbox.CAROUSEL.VERSION[0] === '4';

        // Merge Configuration
        let defaults = Lightbox.DEFAULTS;
        this.config = {
            carousel: Object.assign({}, defaults.carousel, config.carousel || {}),
            modal: Object.assign({}, defaults.modal, config.modal || {})
        };

        // Append Element
        this.append(element);

        // Prepare Listeners
        this.onKeyUpListener = this._onKeyUp.bind(this);
    }

    /**
     * onKeyUp Event Listener
     * @param event 
     */
    private _onKeyUp(event: KeyboardEvent) {
        if (event.key === 'ArrowRight') {
            this.next();
        } else if (event.key === 'ArrowLeft') {
            this.prev();
        }
    }

    /**
     * Create Lightbox Element
     */
    private _createLightbox() {

        // Carousel Controls
        let controls = '';
        if (this.config.carousel.controls && this.items.size > 1) {
            controls = `
                <button class="carousel-control-prev" type="button" data-${this.legacy ? '' : 'bs-'}target="#${this.config.carousel.id || 'lightboxCarousel'}" data-${this.legacy ? '' : 'bs-'}slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="${this.legacy ? 'sr-only' : 'visually-hidden'}">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-${this.legacy ? '' : 'bs-'}target="#${this.config.carousel.id || 'lightboxCarousel'}" data-${this.legacy ? '' : 'bs-'}slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="${this.legacy ? 'sr-only' : 'visually-hidden'}">Next</span>
                </button>
            `;
        }

        // Carousel Indicators
        let indicators = '';
        if (this.config.carousel.indicators && this.items.size > 1) {
            indicators = `
                <div class="carousel-indicators">
                    ${(new Array(this.items.size)).map((_, idx: number) => {
                        return `<button type="button" data-${this.legacy ? '' : 'bs-'}target="#${this.config.carousel.id || 'lightboxCarousel'}" data-${this.legacy ? '' : 'bs-'}slide-to="${idx}" class="${idx === 0 ? 'active' : ''}" aria-current="${idx === 0 ? 'true' : 'false'}"></button>`;
                    })}
                </div>
            `;
        }

        // Lightbox
        let lightbox = document.createElement('DIV');
        lightbox.className = 'modal modal-lightbox fade';
        lightbox.tabIndex = -1;
        lightbox.innerHTML = `
            <div id="${this.config.modal.id || 'lightboxModal'}" class="modal-dialog${this.config.modal.size !== null ? (' modal-' + this.config.modal.size) : ' '} modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body p-0">
                        <div id="${this.config.carousel.id || 'lightboxCarousel'}" class="carousel carousel-fade slide">
                            ${indicators}

                            <div class="carousel-inner">
                                ${Array.from(this.items.values()).map((item: LightboxItem, idx: number) => {
                                    return `
                                        <div class="carousel-item${idx === 0 ? ' active' : ''}">
                                            ${item.image.outerHTML}
                                            ${item.caption || item.title ? `
                                                <div class="carousel-caption d-none d-md-block">
                                                    ${item.title ? `<div class="h5">${item.title}</div>` : ''}
                                                    ${item.caption ? `<p>${item.caption}</p>` : ''}
                                                </div>
                                            ` : ''}
                                        </div>
                                    `;
                                }).join('\n')}
                            </div>

                            ${controls}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.lightbox = lightbox;
    }

    /**
     * Create Modal instance
     */
    private _createModal() {
        if (this.lightbox === null) {
            return;
        }

        if (this.legacy) {
            let config = Object.assign({}, this.config.modal, { show: false });
            this.modal = Lightbox.$(this.lightbox).modal(config);
        } else {
            this.modal = Lightbox.MODAL.getOrCreateInstance(this.lightbox, this.config.modal) as Modal;
        }
    }

    /**
     * Create Carousel instance
     */
    private _createCarousel() {
        if (this.lightbox === null) {
            return;
        }

        if (this.legacy) {
            let config = Object.assign({}, this.config.carousel);
            if (!config.ride) {
                config.interval = false;
            }
            this.carousel = Lightbox.$(this.lightbox.querySelector('.carousel')).carousel(config);
        } else {
            this.carousel = Lightbox.CAROUSEL.getOrCreateInstance(this.lightbox.querySelector('.carousel'), this.config.carousel) as Carousel;
        }
    }

    /**
     * Destroy Lightbox instance with all elements.
     * @returns
     */
    public dispose(): Lightbox {
        document.removeEventListener('keyup', this.onKeyUpListener);

        if (this.carousel) {
            if (this.legacy) {
                this.carousel.carousel('dispose');
            } else {
                this.carousel.dispose();
            }
            this.carousel = null;
        }

        if (this.modal) {
            if (this.legacy) {
                this.modal.modal('dispose');
            } else {
                this.modal.dispose();
            }
            this.modal = null;
        }

        if (this.lightbox && this.lightbox.parentElement) {
            this.lightbox.remove();
        }
        this.lightbox = null;
        this.events = new Map;
        return this;
    }

    /**
     * Get Image from element
     * @param source 
     * @returns 
     */
    private _getImage(source: HTMLElement): HTMLPictureElement | HTMLImageElement | null {
        if (source instanceof HTMLImageElement || source instanceof HTMLPictureElement) {
            return source;
        } else {
            let temp = source.querySelector('picture,img') as HTMLPictureElement | HTMLImageElement | null;
            return temp;
        }
    }

    /**
     * Get title from element
     * @param source 
     * @param image 
     * @returns
     */
    private _getTitle(source: HTMLElement, image: HTMLPictureElement | HTMLImageElement): string | null {
        let title = source.dataset.bsTitle || source.dataset.title || source.title || null;
        if (!title && source !== image) {
            title = image.dataset.bsTitle || image.dataset.title || null;
        }
        return title;
    }

    /**
     * Get caption from element
     * @param source 
     * @param image 
     * @returns
     */
    private _getCaption(source: HTMLElement, image: HTMLPictureElement | HTMLImageElement): string | null {
        if (source.tagName.toUpperCase() === 'FIGURE') {
            let temp = source.querySelector('FIGCAPTION') as HTMLElement | null;
            if (temp && temp.innerText.trim().length > 0) {
                return temp.innerText.trim();
            }
        } else {
            let caption = source.dataset.bsCaption || source.dataset.caption || null;
            if (!caption) {
                caption = image.dataset.bsCaption || image.dataset.caption || null;
            }
            return caption;
        }
    }

    /**
     * Append Lightbox Item
     * @param source 
     * @returns
     */
    public append(source: HTMLElement): Lightbox {
        if (this.items.has(source)) {
            return this;
        }

        let original = this._getImage(source);
        if (original === null) {
            throw new Error(`The passed element is not nor contains a supported image source. Element HTML: ${source.outerHTML}.`);
        }
        let image = original.cloneNode(true) as HTMLImageElement | HTMLPictureElement;
        image.className = 'w-100';

        // Change URL on <img /> tags
        if (image instanceof HTMLImageElement && source instanceof HTMLAnchorElement && source.href.length > 0) {
            image.src = source.href;
        }

        // Add Item
        this.items.set(source, {
            source,
            image,
            title: this._getTitle(source, image),
            caption: this._getCaption(source, image)
        });
        
        // Link Item
        source.setAttribute(this.legacy ? 'data-slide-to' : 'data-bs-slide-to', (this.items.size-1).toString());
        source.addEventListener('click', (ev) => {
            ev.preventDefault();
            this.show(source);
        });
        return this;
    }

    /**
     * Toggle Lightbox Modal
     * @returns
     */
    public toggle(): Lightbox {
        if (this.lightbox) {
            return this.hide();
        } else {
            return this.show();
        }
    }

    /**
     * Show Lightbox Modal
     * @param source 
     * @returns
     */
    public show(source: HTMLElement|null = null): Lightbox {
        if (this.lightbox) {
            return this;
        }
        this._createLightbox();
        this._createModal();
        this._createCarousel();

        // Legacy Event Listeners
        if (this.legacy) {
            let events = [
                'slid.bs.carousel',  'slide.bs.carousel',  'hide.bs.modal',  'hidden.bs.modal',  'hidePrevented.bs.modal',  'show.bs.modal',  'shown.bs.modal'
            ];
            for (let id of events) {
                (id.endsWith('modal') ? this.modal : this.carousel).on(id, (ev) => {
                    (id.endsWith('modal')? this.lightbox: this.lightbox.querySelector('.carousel')).dispatchEvent(new Event(id, {
                        bubbles: ev.bubbles,
                        cancelable: ev.cancelable,
                        composed: ev.composed
                    }));
                });
            }
        }

        // Set Slide on Gallery
        if (source instanceof HTMLElement && (source.dataset.bsSlideTo || source.dataset.slideTo)) {
            this.lightbox.addEventListener('show.bs.modal', (ev) => {
                let number = parseInt(source.dataset.bsSlideTo || source.dataset.slideTo, 10);
                if (this.legacy) {
                    this.carousel.carousel(number);
                } else {
                    this.carousel.to(number);
                }
            });
        }

        // Attach Custom Events
        let carousel = this.lightbox.querySelector('.carousel');
        for (let [event, set] of this.events.entries()) {
            if (event.endsWith('modal')) {
                set.forEach(c => this.lightbox.addEventListener(event, c));
            }
            if (event.endsWith('carousel')) {
                set.forEach(c => carousel.addEventListener(event, c));
            }
        }

        // Attach Carousel Keyboard Controls
        if (this.config.carousel.keyboard) {
            document.addEventListener('keyup', this.onKeyUpListener);
        }

        // Attach Dispose and show Modal
        this.lightbox.addEventListener('hidden.bs.modal', this.dispose.bind(this));
        if (this.legacy) {
            this.modal.modal('show');
        } else {
            this.modal.show();
        }
        return this;
    }

    /**
     * Hide Lightbox Modal
     * @returns
     */
    public hide(): Lightbox {
        if (this.modal) {
            if (this.legacy) {
                this.modal.modal('hide');
            } else {
                this.modal.hide();
            }
        }
        return this;
    }

    /**
     * Cycle Lightbox Carousel
     * @returns
     */
    public cycle(): Lightbox {
        if (this.carousel) {
            if (this.legacy) {
                this.carousel.carousel('cycle');
            } else {
                this.carousel.cycle();
            }
        }
        return this;
    }

    /**
     * Go to next slide on Lightbox Carousel
     * @returns
     */
    public next(): Lightbox {
        if (this.carousel) {
            if (this.legacy) {
                this.carousel.carousel('next');
            } else {
                this.carousel.next();
            }
        }
        return this;
    }

    /**
     * Go to previous slide on Lightbox Carousel
     * @returns
     */
    public prev(): Lightbox {
        if (this.carousel) {
            if (this.legacy) {
                this.carousel.carousel('prev');
            } else {
                this.carousel.prev();
            }
        }
        return this;
    }

    /**
     * Go to a specific slide on Lightbox Carousel
     * @param direction 
     * @returns
     */
    public to(direction: number | 'prev' | 'previous' | 'next'): Lightbox {
        if (!this.carousel) {
            return this;
        }

        if (direction === 'prev' || direction === 'previous') {
            this.prev();
        } else if (direction === 'next') {
            this.next();
        } else {
            if (this.legacy) {
                this.carousel.carousel(direction);
            } else {
                this.carousel.to(direction);
            }
        }
        return this;
    }

    /**
     * Attach Event Handler for lightbox, modal or carousel.
     * @param event 
     * @param caller 
     * @returns
     */
    public on(event: LightboxEventNames, caller: EventListener): Lightbox {
        if (!this.events.has(event)) {
            this.events.set(event, new Set);
        }
        this.events.get(event).add(caller);
        return this;
    }

    /**
     * Detach Event Handler from lightbox, modal or carousel.
     * @param event 
     * @param caller 
     * @returns
     */
    public off(event: LightboxEventNames, caller: EventListener): Lightbox {
        if (this.events.has(event)) {
            this.events.get(event).delete(caller);
        }
        
        if (this.lightbox && event.endsWith('modal')) {
            this.lightbox.removeEventListener(event, caller);
        }
        if (this.lightbox && event.endsWith('carousel')) {
            this.lightbox.querySelector('.carousel').removeEventListener(event, caller);
        }
        return this;
    }
}

// Export Module
export default Lightbox;
