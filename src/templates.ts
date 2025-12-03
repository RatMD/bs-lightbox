import type { LightboxTemplates } from './types';

export const BOOTSTRAP_TEMPLATES: LightboxTemplates = {
    /**
     * 
     * @param ctx 
     */
    renderLightbox(ctx) {
        const modalId = ctx.config.modal.id || 'lightboxModal';
        const modalCls = 'modal modal-lightbox fade';
        const modalDialogCls = `modal-dialog${ctx.config.modal.size !== null ? (' modal-' + ctx.config.modal.size) : ' '} modal-dialog-centered`;
        const carouselId = ctx.config.carousel.id || 'lightboxCarousel';
        const carouselCls = `carousel carousel-fade slide`;
        return `
            <div id="${modalId}" class="${modalCls}" tabindex="-1">
                <div class="${modalDialogCls}">
                    <div class="modal-content overflow-hidden">
                        <div class="modal-body p-0">
                            <template data-lightbox-slot="close-button"></template>
                            
                            <div id="${carouselId}" class="${carouselCls}">
                                <template data-lightbox-slot="indicators"></template>
                                <div class="carousel-inner">
                                    <template data-lightbox-slot="slides"></template>
                                </div>
                                <template data-lightbox-slot="controls"></template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * 
     * @param ctx 
     */
    renderControls(ctx) {
        const id = ctx.config.carousel.id || 'lightboxCarousel';
        const cls = ctx.legacy ? 'sr-only' : 'visually-hidden';
        const prefix = ctx.legacy ? '' : 'bs-';
        return `
            <button class="carousel-control-prev" type="button" data-${prefix}target="#${id}" data-${prefix}slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="${cls}">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-${prefix}target="#${id}" data-${prefix}slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="${cls}">Next</span>
            </button> 
        `;
    },

    /**
     * 
     * @param ctx 
     */
    renderIndicators(ctx) {
        const id = ctx.config.carousel.id || 'lightboxCarousel';
        const prefix = ctx.legacy ? '' : 'bs-';
        return `
            <div class="carousel-indicators">
                ${[...Array(ctx.items.size)].map((_, idx: number) => {
                    return `<button type="button" data-${prefix}target="#${id}" data-${prefix}slide-to="${idx}" class="${idx === 0 ? 'active' : ''}" aria-current="${idx === 0 ? 'true' : 'false'}"></button>`;
                }).join('\n')}
            </div>
        `;
    },

    /**
     * 
     * @param ctx 
     * @param item 
     * @param idx 
     */
    renderItem(ctx, item, idx) {
        const cls = ctx.legacy ? 'sr-only' : 'visually-hidden';
        const clsRatio = ctx.legacy ? 'embed-responsive embed-responsive-16by9' : 'ratio ratio-16x9';
        return `
            <div class="carousel-item${idx === 0 ? ' active' : ''}">
                ${ctx.config.lightbox.loader? `
                    <div class="${clsRatio}" data-img-src="${item.src}">
                        <div class="d-flex justify-content-center align-items-center embed-responsive-item">
                            <div class="spinner-border" role="status">
                                <span class="${cls}">Loading...</span>
                            </div>
                        </div>
                    </div>
                `: `
                    ${item.root.outerHTML}
                `}
                
                ${item.caption || item.title ? `
                    <div class="carousel-caption d-none d-md-block">
                        ${item.title ? `<div class="h5">${item.title}</div>` : ''}
                        ${item.caption ? `<p>${item.caption}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * 
     * @param ctx 
     */
    renderCloseButton(ctx) {
        let config = ctx.config.lightbox.closeButton;
        if (ctx.legacy) {
            return `
                <div class="w-100 position-absolute d-flex justify-content-end p-3" style="z-index:1500;pointer-events:none;">
                    <button type="button" class="close ${config == 'light' ? 'text-white' : ''}" data-dismiss="modal" aria-label="Close" style="pointer-events:auto;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="position-absolute top-0 end-0 p-3 z-3 pe-none" ${config == 'light' ? 'data-bs-theme="dark"' : ''}>
                    <button type="button" class="btn-close ${config == 'light' ? 'btn-close-white' : ''} pe-auto" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            `;
        }
    }
};
