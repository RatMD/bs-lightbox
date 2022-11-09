
export interface CarouselConfig {

    /**
     * A unique ID for the created Carousel.
     * @type {string|null}
     */
    id: string | null;

    /**
     * Whether to show or hide the native carousel control actions.
     * @type {boolean}
     */
    controls: boolean;
    
    /**
     * Whether to show or hide the native carousel indicators.
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

export interface ModalConfig {

    /**
     * A unique ID for the created Modal.
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

export interface LightboxConfig {
    carousel: CarouselConfig;
    modal: ModalConfig;
}
