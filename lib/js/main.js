document.addEventListener("DOMContentLoaded", () => {
  const ratting = document.querySelectorAll(".cards__rating");

  ratting.forEach((item) => {
    const rater = raterJs(item, {
      max: 5,
      rating: 3.3,
      readOnly: true,
      starSize: 12,
    });
  });
  const swiperHead = new Swiper("#carousel", {
    slidesPerView: 1,
    fadeEffect: {
      crossFade: true,
    },
    loop: true,
    autoplay: true,
    speed: 500,
    duration: 4000,
    effect: "fade",
    navigation: {
      nextEl: ".next",
      prevEl: ".prev",
    },
  });

  const cardsSwiper = new Swiper(".carousel-cards", {
    slidesPerView: 2,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".next-cards",
      prevEl: ".prev-cards",
    },
    breakpoints: {
      1200: {
        slidesPerView: 6,
      },
      1024: {
        slidesPerView: 5,
      },
      768: {
        slidesPerView: 4,
      },
      576: {
        slidesPerView: 3,
      },
    },
  });

  // membatasi text panjang dari desc
  function truncateText(element, maxLength) {
    let text = element.innerText;
    if (text.length > maxLength) {
      element.innerText = text.substring(0, maxLength - 3) + "...";
    }
  }

  function truncateAllDescriptions(maxLength) {
    let descriptionElements = document.querySelectorAll(".desc");
    descriptionElements.forEach((element) => truncateText(element, maxLength));
  }

  truncateAllDescriptions(140);

  // Shrink navbar on scroll
  const navbar = document.querySelector(".navbar");
  const brand = document.querySelector(".brands");
  if (window.innerWidth >= 480) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 14) {
        navbar.classList.add("shrink");
        brand.style.fontSize = "2rem";
      } else {
        navbar.classList.remove("shrink");
        brand.style.fontSize = "3rem";
      }
    });
  } 
  const btnNav = document.querySelector(".btn-nav");
  const nav = document.querySelector(".nav");
  btnNav.addEventListener ("click", () => {
    nav.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!btnNav.contains(e.target)) {
      nav.classList.remove("open");
    }
  });
});
