/**
 * Bootstrap Carousel Configuration Options
 * @see https://getbootstrap.com/docs/5.3/components/carousel/#options
 */
export interface BootstrapCarouselConfig {
    /**
     * A unique ID for the created bootstrap carousel.
     * @type {string|null}
     */
    id: string | null;

    /**
     * Whether to show or hide the bootstrap carousel control actions.
     * @type {boolean}
     */
    controls: boolean;
    
    /**
     * Whether to show or hide the bootstrap carousel indicators.
     * @type {boolean}
     */
    indicators: boolean;

    /**
     * The amount of time in milliseconds to delay between automatically cycling an item.
     * @type {number|boolean}
     */
    interval: number | boolean;

    /**
     * Whether the carousel should react to keyboard events or not (left / right button).
     * @type {boolean}
     */
    keyboard: boolean;

    /**
     * Whether the carousel should pause on mouse and touch-events or not.
     * @type {string|boolean}
     */
    pause: "hover" | false;

    /**
     * Whether the carousel should autoplay or not.
     * @type {string|boolean}
     * @var {string} string - ('carousel') Autoplay the carousel on load.
     * @var {boolean} true - Autoplay the carousel after the user manually cycles the first item.
     * @var {boolean} false - Disable autoplay in both cases above.
     */
    ride: "carousel" | boolean;

    /**
     * Whether the carousel should support left/right swipe interactions on touchscreen devices or not.
     * @type {boolean}
     */
    touch: boolean;

    /**
     * Whether the carousel should cycle continuously or have hard stops,
     * @type {boolean}
     */
    wrap: boolean;
}

/**
 * Bootstrap Modal Configuration Options
 * @see https://getbootstrap.com/docs/5.3/components/modal/#options
 */
export interface BootstrapModalConfig {
    /**
     * A unique ID for the created bootstrap modal.
     * @type {string|null}
     */
    id: string | null;

    /**
     * Whether a modal backdrop should be added or not.
     * @type {string|boolean}
     * @var {string} string - ('static') A static backdrop does not close when clicked outside.
     * @var {boolean} boolean - True to include the backdrop, false to not.
     */
    backdrop: 'static' | boolean;

    /**
     * Whether the focus should be set on the modal, when initialized, or not.
     * @type {boolean}
     */
    focus: boolean;

    /**
     * Whether the modal should close when escape key is pressed or not.
     * @type {boolean}
     */
    keyboard: boolean;

    /**
     * Change the size of the shown modal
     * @type {null|string}
     */
    size: null | 'sm' | 'lg' | 'xl' | 'fullscreen';
}

/**
 * Configuration options for @rat.md/bs-lightbox.
 */
export interface BootstrapLightboxConfig {
    /**
     * Enables the close button, allows to choose between light and dark variant.
     */
    closeButton: boolean | 'light' | 'dark';

    /**
     * Enables a pre-loader for individual carousel items.
     */
    loader: boolean;

    /**
     * Replaces the image source within <picture> elements.
     */
    replacePictures: boolean;
}

export interface LightboxTemplates {
    /**
     * 
     * @param ctx 
     */
    renderLightbox(ctx: LightboxInstance): string;
    
    /**
     * 
     * @param ctx 
     */
    renderControls(ctx: LightboxInstance): string|null;
    
    /**
     * 
     * @param ctx 
     */
    renderIndicators(ctx: LightboxInstance): string|null;

    /**
     * 
     * @param ctx 
     * @param item 
     * @param idx 
     */
    renderItem(ctx: LightboxInstance, item: LightboxElement, idx: number): string;
    
    /**
     * 
     * @param ctx 
     */
    renderCloseButton(ctx: LightboxInstance): string|null;
}

/**
 * Combined configuration object.
 */
export interface LightboxConfiguration {
    /**
     * Bootstrap Carousel configuration.
     */
    carousel: BootstrapCarouselConfig;

    /**
     * Lightbox configuration.
     */
    lightbox: BootstrapLightboxConfig;

    /**
     * Bootstrap Modal configuration.
     */
    modal: BootstrapModalConfig;

    /**
     * Lightbox templates.
     */
    templates: LightboxTemplates;
}

/**
 * Represents a single @rat.md/bs-lightbox element.
 */
export interface LightboxElement {
    /**
     * The original HTML element.
     */
    original: HTMLElement;

    /**
     * The associated <img> or <picture> element.
     */
    root: HTMLImageElement | HTMLPictureElement;

    /**
     * The related <img> src string.
     */
    src: string;

    /**
     * Optional lightbox title.
     */
    title?: string | null;

    /**
     * Optional lightbox caption.
     */
    caption?: string | null;
}

/**
 * Bootstrap Carousel event names.
 */
export type BootstrapCarouselEvents =
    'slid.bs.carousel' |
    'slide.bs.carousel';

/**
 * Lightbox event names.
 */
export type BootstrapLightboxEvents =
    'show.rat.lightbox' |
    'shown.rat.lightbox' |
    'hide.rat.lightbox' |
    'hidden.rat.lightbox' |
    'preload.rat.lightbox' |
    'preloaded.rat.lightbox';

/**
 * Bootstrap Modal event names.
 */
export type BootstrapModalEvents =
    'hide.bs.modal' |
    'hidden.bs.modal' |
    'hidePrevented.bs.modal' |
    'show.bs.modal' |
    'shown.bs.modal';

/**
 * All supported event names.
 */
export type LightboxEvents = BootstrapCarouselEvents | BootstrapLightboxEvents | BootstrapModalEvents;

/**
 * Lightbox prototype instance.
 */
export interface LightboxInstance {
    /**
     * Instance configuration.
     */
    config: LightboxConfiguration;

    /**
     * True for Bootstrap 4 mode, false for Bootstrap 5.
     */
    legacy: boolean;

    /**
     * Collection of lightbox items.
     */
    items: Map<HTMLElement, LightboxElement>;

    /**
     * Registered event listeners.
     */
    events: Map<LightboxEvents, Set<EventListener>>;

    /**
     * Root lightbox container element.
     */
    lightbox: HTMLElement | null;

    /**
     * Bootstrap Carousel instance.
     */
    carousel: unknown;

    /**
     * Bootstrap Modal instance.
     */
    modal: unknown;

    /**
     * Disposes the instance and its resources.
     * @returns The current instance.
     */
    dispose(): this;

    /**
     * Appends an additional element to the lightbox.
     * @param source The element to add.
     * @returns The current instance.
     */
    append(source: HTMLElement): this;

    /**
     * Toggles the lightbox modal.
     * @returns The current instance.
     */
    toggle(): this;

    /**
     * Shows the lightbox modal.
     * @param source The element to display, or null to show the first.
     * @returns The current instance.
     */
    show(source: HTMLElement | null): this;

    /**
     * Hides the lightbox modal.
     * @returns The current instance.
     */
    hide(): this;

    /**
     * Starts automatic cycling of the carousel.
     * @returns The current instance.
     */
    cycle(): this;

    /**
     * Moves to the next carousel slide.
     * @returns The current instance.
     */
    next(): this;

    /**
     * Moves to the previous carousel slide.
     * @returns The current instance.
     */
    prev(): this;

    /**
     * Navigates to a specific slide.
     * @param direction A slide index (from 0) or 'next', 'prev', 'previous'.
     * @returns The current instance.
     */
    to(direction: number | 'prev' | 'previous' | 'next'): this;

    /**
     * Attaches an event listener.
     * @param event The supported event name.
     * @param caller The callback function.
     * @returns The current instance.
     */
    on(event: LightboxEvents, caller: EventListener): this;

    /**
     * Detaches an event listener.
     * @param event The supported event name.
     * @param caller The previously attached listener.
     * @returns The current instance.
     */
    off(event: LightboxEvents, caller: EventListener): this;
}

/**
 * Lightbox prototype statics.
 */
export interface LightboxStatic {
    /**
     * Component name.
     */
    readonly NAME: string;

    /**
     * Component version.
     */
    readonly VERSION: string;

    /**
     * Default Lightbox configuration.
     */
    readonly DEFAULTS: LightboxConfiguration;

    /**
     * jQuery prototype or object reference.
     */
    $: unknown;

    /**
     * Bootstrap Carousel prototype or object reference.
     */
    CAROUSEL: unknown;

    /**
     * Bootstrap Modal prototype or object reference.
     */
    MODAL: unknown;

    /**
     * Default lightbox selector.
     */
    SELECTOR: string;

    /**
     * Registered lightbox instances, grouped by gallery identifier or originating element.
     */
    instances: Map<string | HTMLElement, LightboxInstance>;

    /**
     * Detects the gallery identifier from the given element.
     * @param source 
     * @returns 
     */
    getGalleryIdentifier(source: HTMLElement): string|null;

    /**
     * Initializes lightbox elements.
     * @param selector A custom selector, or null to use the default.
     * @param config Additional configuration for new instances.
     * @returns An array of created or existing instances.
     */
    invoke(selector?: null | string, config?: Partial<LightboxConfiguration>): LightboxInstance[];

    /**
     * Checks whether an instance exists for a given element or gallery key.
     * @param sourceOrGalleryId A valid lightbox element or gallery identifier.
     * @returns True if an instance exists.
     */
    hasInstance(sourceOrGalleryId: HTMLElement | string): boolean;

    /**
     * Retrieves an existing instance for an element or gallery key.
     * @param sourceOrGalleryId A valid lightbox element or gallery identifier.
     * @returns The instance if found, otherwise null.
     */
    getInstance(sourceOrGalleryId: HTMLElement | string): LightboxInstance | null;

    /**
     * Returns an existing instance or creates a new one.
     * @param element A valid lightbox element.
     * @param config Additional configuration for new instances.
     * @returns The created or existing instance.
     */
    getOrCreateInstance(element: HTMLElement, config?: Partial<LightboxConfiguration>): LightboxInstance;

    /**
     * Creates a new lightbox instance.
     * @param element A valid lightbox element.
     * @param config Additional configuration for the new instance.
     */
    new (element: HTMLElement, config?: Partial<LightboxConfiguration>): LightboxInstance;
}
