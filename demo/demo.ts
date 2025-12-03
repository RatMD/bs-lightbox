import { Lightbox } from '../src/lightbox';

window['Lightbox'] = Lightbox;

/**
 * Invoke Lightbox
 */
document.addEventListener('DOMContentLoaded', () => {
    const mainExamples = Lightbox.invoke();
    
    const example = mainExamples[0];
    example.on('slid.bs.carousel', () => console.log('slid.bs.carousel'));
    example.on('slide.bs.carousel', () => console.log('slide.bs.carousel'));

    example.on('show.rat.lightbox', () => console.log('show.rat.lightbox'));
    example.on('shown.rat.lightbox', () => console.log('shown.rat.lightbox'));
    example.on('hide.rat.lightbox', () => console.log('hide.rat.lightbox'));
    example.on('hidden.rat.lightbox', () => console.log('hidden.rat.lightbox'));
    example.on('preload.rat.lightbox', () => console.log('preload.rat.lightbox'));
    example.on('preloaded.rat.lightbox', () => console.log('preloaded.rat.lightbox'));
    
    example.on('hide.bs.modal', () => console.log('hide.bs.modal'));
    example.on('hidden.bs.modal', () => console.log('hidden.bs.modal'));
    example.on('hidePrevented.bs.modal', () => console.log('hidePrevented.bs.modal'));
    example.on('show.bs.modal', () => console.log('show.bs.modal'));
    example.on('shown.bs.modal', () => console.log('shown.bs.modal'));
});

/**
 * 
 * @param target 
 */
async function copyTopClipboard(target: HTMLElement) {
    try {
        await navigator.clipboard.writeText(target.dataset?.content || '');

        const iconDefault = target.querySelector('.bi-clipboard');
        const iconCheck = target.querySelector('.bi-clipboard-check');
        if (iconDefault && iconCheck) {
            iconDefault.classList.add('d-none');
            iconCheck.classList.remove('d-none');
            setTimeout(() => {
                iconCheck.classList.add('d-none');
                iconDefault.classList.remove('d-none');
            }, 2_500);
        }
    } catch (err) {
        console.error(err);
    }
}
document.addEventListener('click', function (event) {
    let target: HTMLElement|null = event.target as HTMLElement;
    if (target && target.localName != 'button') {
        target = target.closest('button[data-action]');
    }
    if (target && target.hasAttribute('data-action')) {
        copyTopClipboard(target);
    }
});
