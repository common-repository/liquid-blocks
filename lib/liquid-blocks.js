document.addEventListener('DOMContentLoaded', function () {
    const initializeSwipers = () => {
        document.querySelectorAll('.swiper').forEach(function(slider) {
            // slider要素が存在するかチェック
            if (!(slider instanceof Element)) {
                console.error("Swiper element not found or not an Element.");
                return;
            }

            const slidesPerView = slider.getAttribute('data-slides-per-view') || 1;
            const animationType = slider.getAttribute('data-animation-type') || 'slide';
            const delay = slider.getAttribute('data-delay') || 3000;
            const autoPlay = slider.getAttribute('data-autoplay') === 'true' ? { delay: parseInt(delay, 10) } : false;

            try {
                const swiper = new Swiper(slider, {
                    loop: true,
                    slidesPerView: parseFloat(slidesPerView),
                    centeredSlides: true,
                    spaceBetween: 0,
                    effect: animationType,
                    fadeEffect: {
                        crossFade: true
                    },
                    autoplay: autoPlay,
                    keyboard: {
                        enabled: true,
                    },
                    pagination: {
                        el: slider.querySelector('.swiper-pagination'),
                        clickable: true
                    },
                    navigation: {
                        nextEl: slider.querySelector('.swiper-button-next'),
                        prevEl: slider.querySelector('.swiper-button-prev')
                    },
                });
            } catch (error) {
                console.error("Error initializing Swiper:", error);
            }
        });
    };

    // setTimeoutで100ms遅延
    setTimeout(initializeSwipers, 100);

    // または requestAnimationFrameを使ってスライダーを初期化
    // requestAnimationFrame(initializeSwipers);
});
