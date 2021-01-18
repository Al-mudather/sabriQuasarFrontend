var swiper = new Swiper('.header .cn .swiper-container', {
  direction: 'vertical',
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  autoplay: {
    delay: 3000
  },
  speed: 1000,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  }
})

var swiper = new Swiper('.opini .swiper-container', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: false
  }
})
