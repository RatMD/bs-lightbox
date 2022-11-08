
hljs.highlightAll();

document.addEventListener('DOMContentLoaded', () => {
    rat.Lightbox.invoke();

    let example = rat.Lightbox.invoke('[data-example="lightbox"]', {
        carousel: {
            indicators: true
        }
    })[0];

    example.on('slid.bs.carousel', () => {
        console.log('slid.bs.carousel');
    });
    example.on('slide.bs.carousel', () => {
        console.log('slide.bs.carousel');
    });
    example.on('hide.bs.modal', () => {
        console.log('hide.bs.modal');
    });
    example.on('hidden.bs.modal', () => {
        console.log('hidden.bs.modal');
    });
    example.on('show.bs.modal', () => {
        console.log('show.bs.modal');
    });
    example.on('shown.bs.modal', () => {
        console.log('shown.bs.modal');
    });

    let spy = document.querySelector('[data-bs-spy="scroll"],[data-spy="scroll"]');
    let opened = [];
    let caller = (ev) => {
        let list = ev.relatedTarget.closest('ul');
        if (list.classList.contains('collapse')) {
            let collapse = bootstrap.Collapse.getOrCreateInstance(list);
            if (collapse && opened.indexOf(collapse) < 0) {
                opened.filter(c => { c.hide(); return false; });
                collapse.show();
                opened.push(collapse);
            }
        }
    };

    if (bootstrap.Collapse.VERSION[0] === '5') {
        spy.addEventListener('activate.bs.scrollspy', caller);
    } else {
        jQuery(spy).on('activate.bs.scrollspy', caller);
    }
});