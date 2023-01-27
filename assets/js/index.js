(function () {
  const SERVER_URL = "http://138.197.108.65:8337"
  window.onload = async function () {
    try {
      const { data } = await fetchPage();
      if (data && data.length) {
        populateLandingPage(data[0])
      }
      finishLoading()
    } catch (error) {
      console.error(error);
    }
  };

  function fetchPage() {
    return fetch(`${SERVER_URL}/api/pages?populate[block][populate]=*&filters[pageType][$eq]=Saas-v.3`)
      .then((response) => response.json());
  }

  function finishLoading() {
    const preloader = document.querySelector('.page-loading');
    preloader.classList.remove('active');
    preloader.remove();
  }

  function populateLandingPage(page) {
    const mainElement = document.querySelector("main");
    const { title, block: blocks } = page.attributes;
    document.title = title
    
    blocks.forEach(block => {
      const addSectionToPage = (section) => mainElement.insertAdjacentHTML("beforeend", section)
      if (block.__component === "blocks.hero") {
        addSectionToPage(getHeroSectionHTML(block))
      } else if (block.__component === "blocks.logos") {
        addSectionToPage(getLogosSectionHTML(block))
        initSwiper(mainElement.lastElementChild.querySelector(".swiper"))
      } else if (block.__component === "blocks.two-columns-image-right") {
        addSectionToPage(getTwoColumnsImageOnRightHTML(block))
      } else if (block.__component === "blocks.two-columns-image-on-left") {
        addSectionToPage(getTwoColumnsImageOnLeftHTML(block))
      } else if (block.__component === "blocks.how-does-it-work") {
        addSectionToPage(getHowItWorksHTML(block))
      } else if (block.__component === "blocks.video") {
        addSectionToPage(getVideoHTML(block))
      } else if (block.__component === "blocks.testimonials") {
        addSectionToPage(getTestimonialsHTML(block))
        initSwiper(mainElement.lastElementChild.querySelector(".swiper"))
      } else if (block.__component === "blocks.call-to-action") {
        addSectionToPage(getCTAHTML(block))
      }
    });
  }

  function initSwiper(element) {
    const swiperOptions = JSON.parse(element.getAttribute("data-swiper-options"))
    new Swiper(element, swiperOptions)
  }

  const getHeroSectionHTML = (hero) => {
    let primaryCallToActionButtonHTML = "";
    let secondaryCallToActionButtonHTML = "";
    if (hero.primaryCallToAction) {
      primaryCallToActionButtonHTML = `<a href="${hero.primaryCallToAction.link}" ${hero.primaryCallToAction.isExternal ? `target="__blank"` : ""} class="btn btn-lg btn-primary shadow-primary me-3 me-sm-4">${hero.primaryCallToAction.title}</a>`
    }
    if (hero.secondaryCallToAction) {
      secondaryCallToActionButtonHTML = `<a href="${hero.secondaryCallToAction.link}" ${hero.secondaryCallToAction.isExternal ? `target="__blank"` : ""} class="btn btn-lg btn-outline-secondary">${hero.secondaryCallToAction.title}</a>`
    }
    return `
      <!-- Hero -->
      <section class="dark-mode bg-dark bg-size-cover bg-repeat-0 bg-position-center position-relative overflow-hidden py-5 mb-4" style="background-image: url(assets/img/landing/saas-3/hero/hero-bg.jpg);">
        <div class="container position-relative zindex-2 pt-5 pb-md-2 pb-lg-4 pb-xl-5">
          <div class="row pt-3 pb-2 py-md-4">

            <!-- Text -->
            <div class="col-xl-5 col-md-6 pt-lg-5 text-center text-md-start mb-4 mb-md-0">
              <h1 class="display-3 pb-2 pb-sm-3">${hero.title}</h1>
              <p class="fs-lg d-md-none d-xl-block pb-2 pb-md-0 mb-4 mb-md-5">
                ${hero.description ? hero.description : ""}
              </p>
              <div class="d-flex justify-content-center justify-content-md-start pb-2 pt-lg-2 pt-xl-0">
                ${primaryCallToActionButtonHTML}
                ${secondaryCallToActionButtonHTML}
              </div>
              <div class="d-flex align-items-center justify-content-center justify-content-md-start text-start pt-4 pt-lg-5 mt-xxl-5">
                <div class="d-flex me-3">
                  <div class="d-flex align-items-center justify-content-center bg-light rounded-circle" style="width: 52px; height: 52px;">
                    <img src="assets/img/avatar/14.jpg" class="rounded-circle" width="48" alt="Avatar">
                  </div>
                  <div class="d-flex align-items-center justify-content-center bg-light rounded-circle ms-n3" style="width: 52px; height: 52px;">
                    <img src="assets/img/avatar/08.jpg" class="rounded-circle" width="48" alt="Avatar">
                  </div>
                  <div class="d-flex align-items-center justify-content-center bg-light rounded-circle ms-n3" style="width: 52px; height: 52px;">
                    <img src="assets/img/avatar/15.jpg" class="rounded-circle" width="48" alt="Avatar">
                  </div>
                </div>
                <div class="text-light"><strong>400k+</strong> users already with us</div>
              </div>
            </div>

            <!-- Parallax gfx -->
            <div class="col-xl-7 col-md-6 d-md-flex justify-content-end">
              <div class="parallax mx-auto ms-md-0 me-md-n5" style="max-width: 675px;">
                <div class="parallax-layer zindex-2" data-depth="0.1">
                  <img src="assets/img/landing/saas-3/hero/layer01.png" alt="Card">
                </div>
                <div class="parallax-layer zindex-3" data-depth="0.25">
                  <img src="assets/img/landing/saas-3/hero/layer02.png" alt="Bubble">
                </div>
                <div class="parallax-layer" data-depth="-0.15">
                  <img src="assets/img/landing/saas-3/hero/layer03.png" alt="Bubble">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  function getLogosSectionHTML(logos) {
    return `
      <section class="container border-bottom-lg pt-sm-2">
        <div class="swiper mx-n2" data-swiper-options='{
          "slidesPerView": 2,
          "pagination": {
            "el": ".swiper-pagination",
            "clickable": true
          },
          "breakpoints": {
            "500": {
              "slidesPerView": 3,
              "spaceBetween": 8
            },
            "650": {
              "slidesPerView": 4,
              "spaceBetween": 8
            },
            "850": {
              "slidesPerView": 5,
              "spaceBetween": 8
            },
            "992": {
              "slidesPerView": 6,
              "spaceBetween": 8
            }
          }
        }'>
          <div class="swiper-wrapper">

            ${
              logos.images.data.map(logo => `
                <!-- Item -->
                <div class="swiper-slide py-2">
                  <a href="#" class="px-2 mx-2">
                    <img src="${SERVER_URL}${logo.attributes.url}" class="d-block mx-auto my-2" width="155" alt="Brand">
                  </a>
                </div>
              `).join("")
            }

            <!-- Item -->
            <div class="swiper-slide py-2">
              <a href="#" class="px-2 mx-2">
                <img src="assets/img/brands/01.svg" class="d-block mx-auto my-2" width="155" alt="Brand">
              </a>
            </div>

            <!-- Item -->
            <div class="swiper-slide py-2">
              <a href="#" class="px-2 mx-2">
                <img src="assets/img/brands/02.svg" class="d-block mx-auto my-2" width="155" alt="Brand">
              </a>
            </div>

          </div>

          <!-- Pagination (bullets) -->
          <div class="swiper-pagination position-relative pt-3"></div>
        </div>
      </section>
    `
  }

  function getTwoColumnsImageOnRightHTML(twoColumnsImageOnRight) {
    return `
    <!-- Feature section (App) -->
    <section class="container pb-5 mb-md-2 mb-lg-4 mb-xl-5">
      <div class="row align-items-center pt-2 pb-3">

        <!-- Text -->
        <div class="col-md-6 col-xl-5 text-center text-md-start mb-5 mb-md-0">
          <h2 class="h1 pb-2 pb-lg-3">${twoColumnsImageOnRight.title}</h2>
          <p class="pb-2 mb-4 mb-lg-5">
            ${twoColumnsImageOnRight.subtitle ? twoColumnsImageOnRight.subtitle : ""}
          </p>
          <hr>
          <div class="d-flex justify-content-center justify-content-md-between pt-4 pt-lg-5">
            <div class="mx-3 mx-md-0">
              <div class="display-3 text-dark mb-1">23%</div>
              <span>Nulla venenatis everys</span>
            </div>
            <div class="mx-3 mx-md-0">
              <div class="display-3 text-dark mb-1">132b</div>
              <span>Dictum in marko elementum</span>
            </div>
          </div>
        </div>

        <!-- Parallax gfx -->
        <div class="col-md-6 offset-xl-1">
          <div class="parallax ratio ratio-1x1 mx-auto" style="max-width: 550px;">
            <div class="parallax-layer position-absolute zindex-2" data-depth="-0.15">
              <img src="${SERVER_URL}${twoColumnsImageOnRight.image.data.attributes.url}" alt="Avatar">
            </div>
            <div class="parallax-layer d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100" data-depth="0.1">
              <div class="rounded-circle bg-primary" style="width: 70%; height: 70%; opacity: .06;"></div>
            </div>
            <div class="parallax-layer d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100" data-depth="0.2">
              <div class="rounded-circle bg-primary" style="width: 55%; height: 55%; opacity: .06;"></div>
            </div>
            <div class="parallax-layer d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 zindex-3" data-depth="0.4">
              <div class="d-flex justify-content-center align-items-center rounded-circle bg-primary" style="width: 93px; height: 93px; box-shadow: 0 .1875rem 1.875rem -.125rem rgba(99,102,241, .95); ">
                <span class="h5 text-light mb-0">400K+</span>
              </div>
            </div>
            <div class="parallax-layer d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100" data-depth="0.3">
              <div class="rounded-circle bg-primary" style="width: 40%; height: 40%; opacity: .06;"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `
  }

  function getTwoColumnsImageOnLeftHTML(twoColumnsImageOnLeft) {
    return `
    <!-- Feature section (Crypto bank) -->
    <section class="container pt-2 pt-sm-4 pb-5 mb-md-2 mb-lg-4 mb-xl-5">
      <div class="row align-items-center mb-2 pb-sm-3 pb-md-4">

        <!-- Text -->
        <div class="col-md-5 col-lg-6 col-xl-5 offset-xl-1 order-md-2 text-center text-md-start mb-5 mb-md-0">
          <h2 class="h1 pb-2 pb-lg-3">${twoColumnsImageOnLeft.title}</h2>
          <p class="pb-2 mb-4 mb-xl-5">
            ${twoColumnsImageOnLeft.subtitle ? twoColumnsImageOnLeft.subtitle : ""}
          </p>
          <hr>
          <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center justify-content-md-between pt-3">
            <img src="assets/img/landing/saas-3/feature-3/binance.svg" width="48" class="d-block m-2 mx-md-0" alt="Bitcoin">
            <img src="assets/img/landing/saas-3/feature-3/ens.svg" width="48" class="d-block m-2 mx-md-0" alt="Ens">
            <img src="assets/img/landing/saas-3/feature-3/tether.svg" width="48" class="d-block m-2 mx-md-0" alt="Tether">
            <img src="assets/img/landing/saas-3/feature-3/alqo.svg" width="48" class="d-block m-2 mx-md-0" alt="Alqo">
            <img src="assets/img/landing/saas-3/feature-3/blockfi.svg" width="48" class="d-block m-2 mx-md-0" alt="BlockFi">
            <img src="assets/img/landing/saas-3/feature-3/bitcoin.svg" width="48" class="d-block m-2 mx-md-0" alt="Bitcoin">
          </div>
        </div>

        <!-- Parallax gfx -->
        <div class="col-md-7 col-lg-6 order-md-1">
          <div class="position-relative pt-5" style="max-width: 636px;">
            <img src="assets/img/landing/saas-3/feature-3/popup.png" class="rellax position-absolute top-0 mt-n5" alt="Card" data-rellax-percentage="0.5" data-rellax-speed="1" data-disable-parallax-down="lg">
            <img src="${SERVER_URL}${twoColumnsImageOnLeft.image.data.attributes.url}" class="d-block rounded-3 mt-sm-4 mt-md-0 mt-lg-4" alt="Dashboard" style="box-shadow: 0 1.875rem 7.5rem -.625rem rgba(124,125,152, .2);">
          </div>
        </div>
      </div>
    </section>
    `
  }

  function getHowItWorksHTML(howItWorks) {
    return `
    <!-- How it works Steps -->
    <section class="container">
      <div class="text-center pb-4 pb-md-0 mb-2 mb-md-5 mx-auto" style="max-width: 530px;">
        <h2 class="h1">${howItWorks.title}</h2>
        <p class="mb-0">
          ${howItWorks.description}
        </p>
      </div>

      <!-- Steps -->
      <div class="steps steps-sm steps-horizontal-md steps-center pb-5 mb-md-2 mb-lg-3">
        ${
          howItWorks.steps.map((step, index) => `
            <div class="step">
              <div class="step-number">
                <div class="step-number-inner">${index + 1}</div>
              </div>
              <div class="step-body">
                <h3 class="h4 mb-3">${step.title}</h3>
                <p class="mb-0">${step.description ? step.description : ""}</p>
              </div>
            </div>
          `).join("")
        }
      </div>
    </section>
    `;
  }

  function getVideoHTML(video) {
    return `
    <section class="container">
      <div class="bg-secondary position-relative rounded-3 overflow-hidden px-4 px-sm-5">
        <div class="position-absolute top-50 start-50 w-75 h-75 translate-middle d-flex align-items-center justify-content-center zindex-5">
          <a href="${video.link}" class="btn btn-video btn-icon btn-xl bg-white stretched-link" data-bs-toggle="video">
            <i class="bx bx-play"></i>
          </a>
        </div>
        <div class="pt-4 mt-sm-3 px-3 px-sm-5 mx-md-5">
          <img src="${SERVER_URL}${video.thumbnail.data.attributes.url}" width="786" class="rellax d-block mx-auto mt-lg-4" alt="Card" data-rellax-percentage="0.5" data-rellax-speed="1.1" data-disable-parallax-down="lg">
        </div>
      </div>
    </section>
    `
  }

  function getTestimonialsHTML(tesimonials) {
    return `
    <!-- Testimonials -->
    <section class="container py-5 mb-2 mt-sm-2 my-md-4 my-lg-5">
      <div class="row pt-2 py-xl-3">
        <div class="col-lg-3 col-md-4">
          <h2 class="h1 text-center text-md-start mx-auto mx-md-0 pt-md-2" style="max-width: 300px;">
            ${tesimonials.title}
          </h2>

          <!-- Slider controls (Prev / next buttons) -->
          <div class="d-flex justify-content-center justify-content-md-start pb-4 mb-2 pt-2 pt-md-4 mt-md-5">
            <button type="button" id="prev-testimonial" class="btn btn-prev btn-icon btn-sm me-2">
              <i class="bx bx-chevron-left"></i>
            </button>
            <button type="button" id="next-testimonial" class="btn btn-next btn-icon btn-sm ms-2">
              <i class="bx bx-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="col-lg-9 col-md-8">
          <div class="swiper mx-n2" data-swiper-options='{
            "slidesPerView": 1,
            "spaceBetween": 8,
            "loop": true,
            "navigation": {
              "prevEl": "#prev-testimonial",
              "nextEl": "#next-testimonial"
            },
            "breakpoints": {
              "500": {
                "slidesPerView": 2
              },
              "1000": {
                "slidesPerView": 2
              },
              "1200": {
                "slidesPerView": 3
              }
            }
          }'>
            <div class="swiper-wrapper">

              <!-- Item -->
              ${
                tesimonials.comments.map(comment => `
                <div class="swiper-slide h-auto pt-4">
                  <figure class="d-flex flex-column h-100 px-2 px-sm-0 mb-0 mx-2">
                    <div class="card h-100 position-relative border-0 shadow-sm pt-4">
                      <span class="btn btn-icon btn-primary shadow-primary pe-none position-absolute top-0 start-0 translate-middle-y ms-4">
                        <i class="bx bxs-quote-left"></i>
                      </span>
                      <blockquote class="card-body pb-3 mb-0">
                        <p class="mb-0">
                          ${comment.comment}
                        </p>
                      </blockquote>
                      <div class="card-footer border-0 text-nowrap pt-0">
                        <i class="bx bxs-star text-warning"></i>
                        <i class="bx bxs-star text-warning"></i>
                        <i class="bx bxs-star text-warning"></i>
                        <i class="bx bx-star text-muted opacity-75"></i>
                        <i class="bx bx-star text-muted opacity-75"></i>
                      </div>
                    </div>
                    <figcaption class="d-flex align-items-center ps-4 pt-4">
                      <img src="assets/img/avatar/40.jpg" width="48" class="rounded-circle" alt="${comment.author}">
                      <div class="ps-3">
                        <h6 class="fs-sm fw-semibold mb-0">${comment.author}</h6>
                        <span class="fs-xs text-muted">${comment.authorSubtitle}</span>
                      </div>
                    </figcaption>
                  </figure>
                </div>
                `).join("")
              }

            </div>
          </div>
        </div>
      </div>
    </section>
    `
  }

  function getCTAHTML(cta) {
    return `
    <!-- CTA -->
    <section class="container">
      <div class="dark-mode bg-dark bg-size-cover bg-position-center bg-repeat-0 position-relative overflow-hidden rounded-3 py-lg-3 py-xl-5 px-4 px-lg-5 px-xl-0" style="background-image: url(assets/img/landing/saas-3/cta-bg.jpg);">
        <div class="row position-relative zindex-2 py-5 my-1 my-md-3">
          <div class="col-md-6">
            <div class="mx-auto" style="max-width: 440px;">
              <h2 class="h1 pb-1 pb-md-3 pb-lg-4">
                ${cta.title}
              </h2>
              <ul class="list-unstyled fs-lg d-md-none pb-3">
                <li class="d-flex mb-2">
                  <i class="bx bx-check lead text-primary me-2" style="margin-top: .125rem;"></i>
                  Purus vestibulum pharetra amet tincidunt pretium
                </li>
                <li class="d-flex mb-2">
                  <i class="bx bx-check lead text-primary me-2" style="margin-top: .125rem;"></i>
                  Haretra justo magna pharetra dui gravida sed nec
                </li>
                <li class="d-flex">
                  <i class="bx bx-check lead text-primary me-2" style="margin-top: .125rem;"></i>
                  Venenatis risus faucibus volutpat amet feugiat a
                </li>
              </ul>
              <a href="${cta.button.link}" ${cta.button.isExternal ? `target="__blank"` : ""} class="btn btn-lg btn-primary shadow-primary w-100 w-sm-auto">${cta.button.title}</a>
            </div>
          </div>
          <div class="col-md-6 pt-lg-3 pt-xl-4">
            ${
              cta.points.length ? 
                `<ul class="list-unstyled fs-lg d-none d-md-block">
                  ${
                    cta.points.map(point => `
                      <li class="d-flex mb-2">
                        <i class="bx bx-check lead text-primary me-2" style="margin-top: .125rem;"></i>
                        Purus vestibulum pharetra amet tincidunt pretium
                      </li>
                      `).join("")
                    }
                </ul>`
              : ""
            }
          </div>
        </div>
      </div>
    </section>
    `
  }

})();
