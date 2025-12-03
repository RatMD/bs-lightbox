import type { Carousel, Modal } from 'bootstrap';
import type { LightboxConfiguration, LightboxElement, LightboxEvents, LightboxInstance, LightboxStatic } from './types';

export class Lightbox implements LightboxInstance {
    /**
     * Internal jQuery prototype or object reference (used for Bootstrap v4 only).
     */
    private static _jquery = null;

    /**
     * Internal Bootstrap Carousel prototype or object reference.
     */
    private static _carousel = null;

    /**
     * Internal Bootstrap Modal prototype or object reference.
     */
    private static _modal = null;

    /**
     * Component name.
     */
    static get NAME(): string {
        return 'lightbox';
    }

    /**
     * Component version.
     */
    static get VERSION(): string {
        return __VERSION__;
    }

    /**
     * Default Lightbox configuration.
     */
    static get DEFAULTS(): LightboxConfiguration {
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
            lightbox: {
                loader: false,
                replacePictures: false
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
     * Set jQuery prototype or object reference.
     */
    static set $(jQuery) {
        Lightbox._jquery = jQuery;
    }

    /**
     * Get jQuery prototype or object reference.
     */
    static get $() {
        let jquery =  Lightbox._jquery || window['$'] || window['jQuery'];
        if (!jquery) {
            throw new Error('No jQuery object found, please use Lightbox.$ = <jQuery>.');
        }
        return jquery;
    }

    /**
     * Set Bootstrap Carousel prototype or object reference.
     */
    static set CAROUSEL(object) {
        Lightbox._carousel = object;
    }

    /**
     * Get Bootstrap Carousel prototype or object reference.
     */
    static get CAROUSEL() {
        let carousel = Lightbox._carousel || (window['bootstrap'] || window['Bootstrap'] || {}).Carousel;
        if (!carousel) {
            throw new Error('No Bootstrap Carousel prototype found, please use Lightbox.CAROUSEL = <Bootstrap.Carousel>.');
        }
        return carousel;
    }

    /**
     * Set Bootstrap Modal prototype or object reference.
     */
    static set MODAL(object) {
        Lightbox._modal = object;
    }

    /**
     * Get Bootstrap Modal prototype or object reference.
     */
    static get MODAL() {
        let modal =  Lightbox._modal || (window['bootstrap'] || window['Bootstrap'] || {}).Modal;
        if (!modal) {
            throw new Error('No Bootstrap Modal prototype found, please use Lightbox.MODAL = <Bootstrap.Modal>.');
        }
        return modal;
    }

    /**
     * Get default lightbox selector.
     */
    static get SELECTOR(): string {
        return '[data-bs-lightbox],[data-bs-toggle="lightbox"],[data-toggle="lightbox"]';
    }

    /**
     * Registered lightbox instances, grouped by originating element.
     */
    public static singleInstances: Map<HTMLElement, LightboxInstance> = new Map;

    /**
     * Registered lightbox instances, grouped by gallery-identifier.
     */
    public static galleryInstances: Map<string, LightboxInstance> = new Map;

    /**
     * Detects the gallery identifier from the given element.
     * @param source The HTML element to inspect.
     * @returns 
     */
    public static getGalleryIdentifier(source: HTMLElement): string|null {
        for (const key of ['data-bs-lightbox', 'data-bs-gallery', 'data-gallery']) {
            if (source.hasAttribute(key)) {
                let group = (source.getAttribute(key) || '').trim();
                if (group.length > 0) {
                    return group;
                }
            }
        }
        return null;
    }

    /**
     * Initializes lightbox elements.
     * @param selector A custom selector, or null to use the default.
     * @param config Additional configuration for new instances.
     * @returns An array of created or existing instances.
     */
    public static invoke(selector?: null | string, config?: Partial<LightboxConfiguration>): LightboxInstance[] {
        selector = typeof selector !== 'string' ? this.SELECTOR : selector;
        return Array.from(document.querySelectorAll(selector), (el: HTMLElement) => {
            return this.getOrCreateInstance(el, config);
        });
    }

    /**
     * Checks whether an instance exists for a given element or group key.
     * @param sourceOrGalleryId A valid lightbox element or group identifier.
     * @returns True if an instance exists.
     */
    public static hasInstance(sourceOrGalleryId: HTMLElement | string): boolean {
        if (sourceOrGalleryId instanceof HTMLElement) {
            return this.singleInstances.has(sourceOrGalleryId);
        } else {
            return this.galleryInstances.has(sourceOrGalleryId);
        }
    }

    /**
     * Retrieves an existing instance for an element or gallery key.
     * @param sourceOrGalleryId A valid lightbox element or gallery identifier.
     * @returns The instance if found, otherwise null.
     */
    public static getInstance(sourceOrGalleryId: HTMLElement | string): LightboxInstance | null {
        if (sourceOrGalleryId instanceof HTMLElement) {
            return this.singleInstances.get(sourceOrGalleryId) || null;
        } else {
            return this.galleryInstances.get(sourceOrGalleryId) || null;
        }
    }

    /**
     * Returns an existing instance or creates a new one.
     * @param element A valid lightbox element.
     * @param config Additional configuration for new instances.
     * @returns The created or existing instance.
     */
    public static getOrCreateInstance(element: HTMLElement, config?: Partial<LightboxConfiguration>): LightboxInstance {
        let instance = this.getInstance(element);
        if (instance) {
            return instance;
        }

        let galleryId = this.getGalleryIdentifier(element);
        if (galleryId) {
            instance = this.getInstance(galleryId);
        }

        if (instance === null) {
            instance = new this(element, config);
        } else {
            instance.append(element);
        }
        return instance;
    }

    /**
     * Instance configuration.
     */
    public config: LightboxConfiguration;

    /**
     * True for Bootstrap 4 mode, false for Bootstrap 5.
     */
    public legacy: boolean;

    /**
     * Collection of lightbox items.
     */
    public items: Map<HTMLElement, LightboxElement> = new Map;

    /**
     * Registered event listeners.
     */
    public events: Map<LightboxEvents, Set<EventListener>> = new Map;

    /**
     * Root lightbox container element.
     */
    public lightbox: HTMLElement|null;

    /**
     * Bootstrap Carousel instance.
     */
    public carousel: Carousel|null;

    /**
     * Bootstrap Modal instance.
     */
    public modal: Modal|null;

    /**
     * The gallery id.
     */
    public galleryId: string|null = null;

    /**
     * Key-up event listener.
     */
    private _onKeyUpListener: EventListener;

    /**
     * Creates a new lightbox instance.
     * @param element A valid lightbox element.
     * @param config Additional configuration for the new instance.
     */
    public constructor(element: HTMLElement, config?: Partial<LightboxConfiguration>) {
        const galleryId = Lightbox.getGalleryIdentifier(element);
        if (galleryId && Lightbox.hasInstance(galleryId)) {
            throw new Error('An instance with this gallery identifier already exists. Add it there or use a different identifier.');
        } else if (!galleryId && Lightbox.hasInstance(element)) {
            throw new Error('An instance with this element already exists.');
        }

        // Set Gallery & Lightbox
        if (galleryId) {
            this.galleryId = galleryId;
            Lightbox.galleryInstances.set(galleryId, this);
        }
        Lightbox.singleInstances.set(element, this);

        // Legacy Indicator
        this.legacy = Lightbox.CAROUSEL.VERSION[0] === '4';

        // Merge Configuration
        let defaults = Lightbox.DEFAULTS;
        this.config = {
            carousel: Object.assign({}, defaults.carousel, config?.carousel || {}),
            lightbox: Object.assign({}, defaults.lightbox, config?.lightbox || {}),
            modal: Object.assign({}, defaults.modal, config?.modal || {})
        };

        // Append Element
        this.append(element);

        // Prepare Listeners
        this._onKeyUpListener = this._onKeyUp.bind(this);
    }

    /**
     * Disposes the instance and its resources.
     * @returns The current instance.
     */
    public dispose(): this {
        document.removeEventListener('keyup', this._onKeyUpListener);

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
        return this;
    }

    /**
     * Internal key-up handler.
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
     * Creates the lightbox container.
     */
    private _createLightbox(): HTMLElement {

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
                    ${[...Array(this.items.size)].map((_, idx: number) => {
                        return `<button type="button" data-${this.legacy ? '' : 'bs-'}target="#${this.config.carousel.id || 'lightboxCarousel'}" data-${this.legacy ? '' : 'bs-'}slide-to="${idx}" class="${idx === 0 ? 'active' : ''}" aria-current="${idx === 0 ? 'true' : 'false'}"></button>`;
                    }).join('\n')}
                </div>
            `;
        }

        // Lightbox
        let lightbox = document.createElement('DIV');
        lightbox.className = 'modal modal-lightbox fade';
        lightbox.tabIndex = -1;
        lightbox.innerHTML = `
            <div id="${this.config.modal.id || 'lightboxModal'}" class="modal-dialog${this.config.modal.size !== null ? (' modal-' + this.config.modal.size) : ' '} modal-dialog-centered">
                <div class="modal-content overflow-hidden">
                    <div class="modal-body p-0">
                        <div id="${this.config.carousel.id || 'lightboxCarousel'}" class="carousel carousel-fade slide">
                            ${indicators}

                            <div class="carousel-inner">
                                ${Array.from(this.items.values()).map((item: LightboxElement, idx: number) => {
                                    let source = item.image instanceof HTMLImageElement ? item.image.src : item.image.querySelector('img')?.src;
                                    return `
                                        <div class="carousel-item${idx === 0 ? ' active' : ''}">
                                            ${this.config.lightbox.loader? `
                                                <div class="${this.legacy ? 'embed-responsive embed-responsive-16by9' : 'ratio ratio-16x9'}" data-img-src="${source}">
                                                    <div class="d-flex justify-content-center align-items-center embed-responsive-item">
                                                        <div class="spinner-border" role="status">
                                                            <span class="${this.legacy ? 'sr-only' : 'visually-hidden'}">Loading...</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            `: `
                                                ${item.image.outerHTML}
                                            `}
                                            
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
        
        return lightbox;
    }

    /**
     * Creates the modal instance.
     */
    private _createModal(): any {
        if (this.lightbox === null) {
            return;
        }

        if (this.legacy) {
            let config = Object.assign({}, this.config.modal, { show: false });
            return Lightbox.$(this.lightbox).modal(config);
        } else {
            return Lightbox.MODAL.getOrCreateInstance(this.lightbox, this.config.modal) as Modal;
        }
    }

    /**
     * Creates the carousel instance.
     */
    private _createCarousel(): any {
        if (this.lightbox === null) {
            return;
        }

        if (this.legacy) {
            let config = Object.assign({}, this.config.carousel);
            if (!config.ride) {
                config.interval = false;
            }
            return Lightbox.$(this.lightbox.querySelector('.carousel')).carousel(config);
        } else {
            return Lightbox.CAROUSEL.getOrCreateInstance(this.lightbox.querySelector('.carousel'), this.config.carousel) as Carousel;
        }
    }

    /**
     * Extracts the image element from a source node.
     * @param source The originating element.
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
     * Extracts the title from a source node or image.
     * @param source The originating element.
     * @param image The resolved image element.
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
     * Extracts the caption from a source node or image.
     * @param source The originating element.
     * @param image The resolved image element.
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
        return null;
    }

    /**
     * Appends an additional element to the lightbox.
     * @param source The element to add.
     * @returns The current instance.
     */
    public append(source: HTMLElement): this {
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
        if (source instanceof HTMLAnchorElement && source.href.length > 0) {
            if (image instanceof HTMLImageElement) {
                image.src = source.href;
            } else if (image instanceof HTMLPictureElement && this.config.lightbox.replacePictures) {
                const temp = image.querySelector('img');
                if (temp) {
                    temp.src = source.href;
                }
                Array.from(image.querySelectorAll('source'), (e) => e.remove());
            }
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
     * Toggles the lightbox modal.
     * @returns The current instance.
     */
    public toggle(): this {
        if (this.lightbox) {
            return this.hide();
        } else {
            return this.show();
        }
    }

    /**
     * Shows the lightbox modal.
     * @param source The element to display, or null to show the first.
     * @returns The current instance.
     */
    public show(source: HTMLElement|null = null): this {
        if (this.lightbox) {
            return this;
        }
        this.lightbox = this._createLightbox();
        this.modal = this._createModal();
        this.carousel = this._createCarousel();

        // Legacy Event Listeners
        if (this.legacy) {
            let events = [
                'slid.bs.carousel', 'slide.bs.carousel', 'hide.bs.modal', 'hidden.bs.modal', 'hidePrevented.bs.modal', 'show.bs.modal', 'shown.bs.modal'
            ];
            for (let id of events) {
                let isModal = id.endsWith('modal');
                (isModal ? this.modal : this.carousel).on(id, (ev) => {
                    let element = isModal ? this.lightbox : this.lightbox?.querySelector('.carousel');
                    if (!element) {
                        return;
                    }
                    element.dispatchEvent(new Event(id, {
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
                let number = parseInt(source.dataset?.bsSlideTo || source.dataset?.slideTo || '0', 10);
                if (this.legacy) {
                    this.carousel.carousel(number);
                } else {
                    this.carousel.to(number);
                }
            });
        }

        // Attach Loader
        if (this.config.lightbox.loader) {
            this.lightbox.addEventListener('show.bs.modal', (ev) => {
                if (!this.lightbox) {
                    return;
                }
                Array.from(this.lightbox.querySelectorAll('[data-img-src]'), (el: HTMLElement) => {
                    let image = document.createElement('IMG') as HTMLImageElement;
                    image.className = 'w-100';
                    image.onload = (ev) => {
                        el.replaceWith(image);
                    };
                    image.src = el.dataset?.imgSrc || '';
                });
            });
        }

        // Attach Custom Events
        let carousel = this.lightbox.querySelector('.carousel');
        if (this.lightbox && carousel) {
            for (let [event, set] of this.events.entries()) {
                if (event.endsWith('modal')) {
                    set.forEach(c => (this.lightbox as HTMLElement).addEventListener(event, c));
                }
                if (event.endsWith('carousel')) {
                    set.forEach(c => carousel.addEventListener(event, c));
                }
            }
        }

        // Attach Carousel Keyboard Controls
        if (this.config.carousel.keyboard) {
            document.addEventListener('keyup', this._onKeyUpListener);
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
     * Hides the lightbox modal.
     * @returns The current instance.
     */
    public hide(): this {
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
     * Starts automatic cycling of the carousel.
     * @returns The current instance.
     */
    public cycle(): this {
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
     * Moves to the next carousel slide.
     * @returns The current instance.
     */
    public next(): this {
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
     * Moves to the previous carousel slide.
     * @returns The current instance.
     */
    public prev(): this {
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
     * Navigates to a specific slide.
     * @param direction A slide index (from 0) or 'next', 'prev', 'previous'.
     * @returns The current instance.
     */
    public to(direction: number | 'prev' | 'previous' | 'next'): this {
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
     * Attaches an event listener.
     * @param event The supported event name.
     * @param caller The callback function.
     * @returns The current instance.
     */
    public on(event: LightboxEvents, caller: EventListener): this {
        if (!this.events.has(event)) {
            this.events.set(event, new Set);
        }
        this.events.get(event)?.add(caller);
        return this;
    }

    /**
     * Detaches an event listener.
     * @param event The supported event name.
     * @param caller The previously attached listener.
     * @returns The current instance.
     */
    public off(event: LightboxEvents, caller: EventListener): this {
        if (this.events.has(event)) {
            this.events.get(event)?.delete(caller);
        }
        
        if (this.lightbox && event.endsWith('modal')) {
            this.lightbox.removeEventListener(event, caller);
        }
        if (this.lightbox && event.endsWith('carousel')) {
            this.lightbox.querySelector('.carousel')?.removeEventListener(event, caller);
        }
        return this;
    }
}

///@ts-ignore
const _staticLightboxCheck: LightboxStatic = Lightbox;
