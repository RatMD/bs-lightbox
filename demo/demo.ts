import { Lightbox } from '../src/lightbox';

window['Lightbox'] = Lightbox;

/**
 * Invoke Lightbox
 */
document.addEventListener('DOMContentLoaded', () => {
    const mainExamples = Lightbox.invoke();
    
    const example = mainExamples[0];

    example.on('show.rat.lightbox', (...args) => console.log('show.rat.lightbox', args));
    example.on('shown.rat.lightbox', (...args) => console.log('shown.rat.lightbox', args));
    example.on('hide.rat.lightbox', (...args) => console.log('hide.rat.lightbox', args));
    example.on('hidden.rat.lightbox', (...args) => console.log('hidden.rat.lightbox', args));
    example.on('slide.rat.lightbox', (...args) => console.log('slide.rat.lightbox', args));
    example.on('slid.rat.lightbox', (...args) => console.log('slid.rat.lightbox', args));
    example.on('preload.rat.lightbox', (...args) => console.log('preload.rat.lightbox', args));
    example.on('preloaded.rat.lightbox', (...args) => console.log('preloaded.rat.lightbox', args));
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
