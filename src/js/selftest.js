window.onload=function () {
    var swiper = new Swiper('.swiper-container',{
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
}


