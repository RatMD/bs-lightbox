
import { LightboxConfig } from "./config";
import { LightboxEventNames, LightboxItem } from "./types";

export declare module Lightbox {
    
    /**
     * Get Component Name
     */
    export var NAME: string;

    /**
     * Get Component Version
     */
    export var VERSION: string;

    /**
     * Get default Configuration
     */
    export var DEFAULTS: LightboxConfig;

    /**
     * Get/Set jQuery Prototype / Object
     */
    export var $: unknown;

    /**
     * Get/Set Bootstrap Carousel Prototype / Object
     */
    export var CAROUSEL: unknown;

    /**
     * Get/Set Bootstrap Modal Prototype / Object
     */
    export var MODAL: unknown;

    /**
     * Get default Lightbox Selector
     */
    export var SELECTOR: string;

    /**
     * Available Lightbox instances, grouped by gallery string or element
     */
    export var instances: Map<string|HTMLElement, LightboxInstance>;

    /**
     * Invoke Lightbox Elements
     * @param selector A custom selector or null to use the default one.
     * @param config Additional configuration, which should be applied on new Lightbox instances.
     * @returns The Lightbox instances, based on the found NodeList.
     */
    export function invoke(selector?: null|string, config?: Partial<LightboxConfig>): LightboxInstance[];

    /**
     * Check if instance exists, based on an HTML element or gallery string
     * @param source A valid Lightbox HTMLElement candidate, or the gallery string.
     * @returns True when an instance exists, False otherwise
     */
    export function hasInstance(source: HTMLElement|string): boolean;

    /**
     * Get instance, based on am HTMLElement or gallery string
     * @param source A valid Lightbox HTMLElement candidate, or the gallery string.
     * @returns The Lightbox instance on success, null otherwise.
     */
    export function getInstance(source: HTMLElement|string): LightboxInstance|null;

    /**
     * Create a new instance or get an existing one
     * @param element A valid Lightbox HTMLElement.
     * @param config Additional configuration, which should be applied on new Lightbox instances.
     * @returns The new or an existing Lightbox instance.
     */
    export function getOrCreateInstance(element: HTMLElement, config?: Partial<LightboxConfig>): LightboxInstance;

    /**
     * Create a new Lightbox instance
     * @param element A valid Lightbox HTMLElement.
     * @param config Additional configuration, which should be applied on new Lightbox instances.
     */
    export function constructor(element: HTMLElement, config?: Partial<LightboxConfig>): LightboxInstance;

    export class LightboxInstance {

        /**
         * Lightbox instance configuration
         */
        public config: LightboxConfig;

        /**
         * Legacy indicator, True -> Bootstrap 4, False -> Bootstrap 5
         */
        public legacy: boolean;

        /**
         * Lightbox Items Map
         */
        public items: Map<HTMLElement, LightboxItem>;

        /**
         * Configured Events
         */
        public events: Map<LightboxEventNames, Set<EventListener>>;

        /**
         * Root Lightbox Container
         */
        public lightbox: HTMLElement|null;

        /**
         * Bootstrap Carousel instance
         */
        public carousel: unknown;

        /**
         * Bootstrap Modal instance
         */
        public modal: unknown;

        /**
         * OnKeyUp Event Listener
         */
        private onKeyUpListener: EventListener;

        /**
         * onKeyUp Event Listener
         * @param event 
         */
        private _onKeyUp(event: KeyboardEvent): void;

        /**
         * Create Lightbox Element
         */
        private _createLightbox(): void;

        /**
         * Create Modal instance
         */
        private _createModal(): void;

        /**
         * Create Carousel instance
         */
        private _createCarousel(): void;

        /**
         * Get Image from element
         * @param source 
         * @returns 
         */
        private _getImage(source: HTMLElement): HTMLPictureElement | HTMLImageElement | null;

        /**
         * Get Title from element
         * @param source 
         * @param image 
         * @returns
         */
        private _getTitle(source: HTMLElement, image: HTMLPictureElement | HTMLImageElement): string | null;

        /**
         * Get Caption from element
         * @param source 
         * @param image 
         * @returns
         */
        private _getCaption(source: HTMLElement, image: HTMLPictureElement | HTMLImageElement): string | null;

        /**
         * Destroy Lightbox instance with all elements
         * @returns Current Lightbox instance.
         */
        public dispose(): LightboxInstance;

        /**
         * Append Lightbox Item
         * @param source Additional Lightbox element to append to this instance.
         * @returns Current Lightbox instance.
         */
        public append(source: HTMLElement): LightboxInstance;

        /**
         * Toggle Lightbox Modal
         * @returns Current Lightbox instance.
         */
        public toggle(): LightboxInstance;

        /**
         * Show Lightbox Modal
         * @param source 
         * @returns Current Lightbox instance.
         */
        public show(source: HTMLElement|null): LightboxInstance;

        /**
         * Hide Lightbox Modal
         * @returns Current Lightbox instance.
         */
        public hide(): LightboxInstance;

        /**
         * Cycle Lightbox Carousel
         * @returns Current Lightbox instance.
         */
        public cycle(): LightboxInstance;

        /**
         * Go to next slide on Lightbox Carousel
         * @returns Current Lightbox instance.
         */
        public next(): LightboxInstance;

        /**
         * Go to previous slide on Lightbox Carousel
         * @returns Current Lightbox instance.
         */
        public prev(): LightboxInstance;

        /**
         * Go to a specific slide on Lightbox Carousel
         * @param direction A specific slide number (starting from 0) or the string 'next', 'prev' or 
         *                  'previous'.
         * @returns Current Lightbox instance.
         */
        public to(direction: number | 'prev' | 'previous' | 'next'): LightboxInstance;

        /**
         * Attach Event Handler for lightbox, modal or carousel.
         * @param event The desired and supported modal or carousel event name.
         * @param caller The event listener callback function to add.
         * @returns Current Lightbox instance.
         */
        public on(event: LightboxEventNames, caller: EventListener): LightboxInstance;

        /**
         * Detach Event Handler from lightbox, modal or carousel.
         * @param event The desired and supported modal or carousel event name.
         * @param caller The event listener callback function to remove.
         * @returns Current Lightbox instance.
         */
        public off(event: LightboxEventNames, caller: EventListener): LightboxInstance;
    }
}
