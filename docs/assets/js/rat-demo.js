
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
});