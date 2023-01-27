(function () {
  const API_TOKEN = "2f896640265cbb108e4a3863bd2ffcd37865dcd473a6c3b77df77c0cc87d2b8c4de885404a996fc3d957140eda649bec079e509843dc55f39cd827a0add80d4a30f4fbcdb040f243b551bfe98d6f8881a1be21464bcd21910dc97acfece21917b5d07c747e22f3802407f6b34abd538b08db588c5c41228adb63275b590eb8ba";
  const SERVER_URL = "http://138.197.108.65:8337"
  const QUERY_PARAMS = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let allPages = [];

  window.onload = async function () {
    await getAllSlugs()
    populateLandingPagesNavDropDown()
    if (QUERY_PARAMS.slug) {
      await showPageContentOr404();
    } else {
      showAvailablePagesListList();
    }
    finishLoading()
  };

  function http(url) {
    return fetch(`${SERVER_URL}${url}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    }).then((response) => response.json());
  }

  async function getAllSlugs() {
    const { data } = await http("/api/landing-pages?fields[0]=slug&fields[0]=title");
    allPages = data
  }

  function fetchLandingPageContent(slug) {
    return http(`/api/landing-pages?filters[slug][$eq]=${slug}&populate[blocks][on][blocks.two-columns-image-right][populate]=*&populate[blocks][on][blocks.video][populate]=*&populate[blocks][on][blocks.two-columns-image-on-left][populate]=*&populate[blocks][on][blocks.hero][populate]=*&populate[blocks][on][blocks.logos][populate]=*&populate[blocks][on][blocks.how-does-it-work][populate]=*&populate[blocks][on][blocks.call-to-action][populate]=*&populate[blocks][on][blocks.hero-single-column][populate]=*&populate[blocks][on][blocks.2x3-grid][populate][0]=items&populate[blocks][on][blocks.2x3-grid][populate][1]=items.image&populate[blocks][on][blocks.testimonials][populate]=*&populate[blocks][on][blocks.pricing][populate][0]=items&populate[blocks][on][blocks.pricing][populate][1]=items.button&populate[blocks][on][blocks.4x2-grid][populate][0]=items&populate[blocks][on][blocks.4x2-grid][populate][1]=items.image&populate[blocks][on][blocks.call-to-action-1][populate]=*&populate[blocks][on][blocks.footer][populate]=*`);
  }

  function finishLoading() {
    const preloader = document.querySelector('.page-loading');
    preloader.classList.remove('active');
    preloader.remove();
  }

  async function showPageContentOr404() {
    try {
      const { data } = await fetchLandingPageContent(QUERY_PARAMS.slug);
      if (data && data.length) {
        populateLandingPage(data[0])
      } else {
        show404()
      }
    } catch (error) {
      console.error(error);
    } 
  }

  function populateLandingPagesNavDropDown() {
    const ulElement = document.getElementById("navbar-landing-pages-dp-ul")
    const liHTML = allPages.map(page => `
      <li><a href="index.html?slug=${page.attributes.slug}" class="dropdown-item">${page.attributes.title}</a></li>
    `).join("")
    ulElement.insertAdjacentHTML("beforeend", liHTML);
  }

  function show404() {
    const mainElement = document.querySelector("main");
    const addSectionToPage = (section) => mainElement.insertAdjacentHTML("beforeend", section)
    addSectionToPage(get404HTML())
  }

  function showAvailablePagesListList() {
    const mainElement = document.querySelector("main");
    const addSectionToPage = (section) => mainElement.insertAdjacentHTML("beforeend", section)
    if (allPages.length) {
      addSectionToPage(getAvailablePagesGridHTML())
    } else {
      addSectionToPage(getNoContentMessageHTML())
    }
  }

  function populateLandingPage(pageContent) {
    const mainElement = document.querySelector("main");
    const { title, blocks } = pageContent.attributes;
    document.title = title
    
    blocks.forEach(block => {
      const addSectionToPage = (section, position="beforeend") => mainElement.insertAdjacentHTML(position, section)
      if (block.__component === "blocks.hero") {
        addSectionToPage(getHeroHTML(block))
      } else if (block.__component === "blocks.hero-single-column") {
        addSectionToPage(getHeroSigleColumnHTML(block))
      } else if (block.__component === "blocks.logos") {
        addSectionToPage(getLogosHTML(block))
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
      } else if (block.__component === "blocks.2x3-grid") {
        addSectionToPage(get2x3GridHTML(block))
      } else if (block.__component === "blocks.pricing") {
        addSectionToPage(getPricingHTML(block))
      } else if (block.__component === "blocks.4x2-grid") {
        addSectionToPage(get2x4GridHTML(block))
      } else if (block.__component === "blocks.call-to-action-1") {
        addSectionToPage(getCTA1HTML(block))
      } else if (block.__component === "blocks.footer") {
        addSectionToPage(getFooterHTML(block), "afterend")
      }
    });
  }

  function initSwiper(element) {
    const swiperOptions = JSON.parse(element.getAttribute("data-swiper-options"))
    new Swiper(element, swiperOptions)
  }

  const getHeroHTML = (hero) => {
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
      <section class="dark-mode bg-dark bg-size-cover bg-repeat-0 bg-position-center position-relative overflow-hidden py-5" style="background-image: url(assets/img/landing/saas-3/hero/hero-bg.jpg);">
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

  function getLogosHTML(logos) {
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

  const getHeroSigleColumnHTML = (hero) => {
    let callToActionButtonHTML = "";
    if (hero.callToAction) {
      callToActionButtonHTML = `<a href="${hero.callToAction.link}" ${hero.callToAction.isExternal ? `target="__blank"` : ""} class="btn btn-primary shadow-primary btn-lg">${hero.callToAction.title}</a>`
    }
    return `
    <!-- Hero -->
    <section class="position-relative overflow-hidden">
      <div class="position-relative bg-dark zindex-4 pt-lg-3 pt-xl-5">

        <!-- Text -->
        <div class="container zindex-5 pt-5">
          <div class="row justify-content-center text-center pt-4 pb-sm-2 py-lg-5">
            <div class="col-xl-8 col-lg-9 col-md-10 py-5">
              <h1 class="display-4 text-light pt-sm-2 pb-1 pb-sm-3 mb-3">${hero.title}</h1>
              <p class="fs-lg text-light opacity-70 pb-2 pb-sm-0 mb-4 mb-sm-5">
                ${hero.description ? hero.description : ""}
              </p>
              ${callToActionButtonHTML}
            </div>
          </div>
        </div>

        <!-- Bottom shape -->
        <div class="d-flex position-absolute top-100 start-0 w-100 overflow-hidden mt-n4 mt-sm-n1" style="color: var(--si-dark);">
          <div class="position-relative start-50 translate-middle-x flex-shrink-0" style="width: 3788px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="3788" height="144" viewBox="0 0 3788 144"><path fill="currentColor" d="M0,0h3788.7c-525,90.2-1181.7,143.9-1894.3,143.9S525,90.2,0,0z"/></svg>
          </div>
        </div>
        <div class="d-none d-lg-block" style="height: 300px;"></div>
        <div class="d-none d-md-block d-lg-none" style="height: 150px;"></div>
      </div>
      <div class="position-relative zindex-5 mx-auto" style="max-width: 1250px; transform: translateZ(-100px);">
        <div class="d-none d-lg-block" style="margin-top: -300px;"></div>
        <div class="d-none d-md-block d-lg-none" style="margin-top: -150px;"></div>
          
        <!-- Parallax (3D Tilt) gfx -->
        <div class="tilt-3d" data-tilt data-tilt-full-page-listening data-tilt-max="12" data-tilt-perspective="1200">
          <img src="assets/img/landing/saas-2/hero/layer01.png" alt="Dashboard">
          <div class="tilt-3d-inner position-absolute top-0 start-0 w-100 h-100">
            <img src="assets/img/landing/saas-2/hero/layer02.png" alt="Cards">
          </div>
        </div>
      </div>
      <div class="position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(255,255,255,.05);"></div>
    </section>
    `
  }

  function get2x3GridHTML(grid2x3) {
    return `
    <!-- Features -->
    <section class="position-relative py-5">
      <div class="container position-relative zindex-5 pb-md-4 pt-md-2 pt-lg-3 pb-lg-5">
        <div class="row justify-content-center text-center pb-3 mb-sm-2 mb-lg-3">
          <div class="col-xl-6 col-lg-7 col-md-9">
            <h2 class="h1 mb-lg-4">${grid2x3.title ? grid2x3.title : ""}</h2>
            <p class="fs-lg text-muted mb-0">
              ${grid2x3.description ? grid2x3.description : ""}
            </p>
          </div>
        </div>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-0 pb-xl-3">

          ${
            grid2x3.items.map((item, index) => `
              <!-- Item -->
              <div class="col position-relative">
                <div class="card border-0 bg-transparent rounded-0 p-md-1 p-xl-3">
                  <div class="d-table bg-secondary rounded-3 p-3 mx-auto mt-3 mt-md-4">
                    <img src="${SERVER_URL}${item.image.data.attributes.url}" width="40" alt="Comments">
                  </div>
                  <div class="card-body text-center">
                    <h3 class="h5 pb-1 mb-2">${item.title}</h3>
                    <p class="mb-0">${item.description ? item.description : ""}</p>
                  </div>
                </div>
                ${
                  index < 3 ? `
                    <hr class="position-absolute top-0 end-0 w-1 h-100 d-none d-sm-block">
                    <hr class="position-absolute top-100 start-0 w-100 d-none d-sm-block">
                  ` : ""
                }
              </div>
            `).join("")
          }

        </div>
      </div>
      <div class="position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(255,255,255,.05);"></div>
    </section>
    `
  }

  function getPricingHTML(pricing) {
    return `
    <!-- Pricing -->
    <section class="container pt-5">
      <div class="row justify-content-center text-center pt-2 pt-md-4 pt-lg-5 pb-4 pb-lg-5 mb-1">
        <div class="col-xl-6 col-lg-7 col-md-9 col-sm-11 pt-xl-3">
          <h2 class="h1 mb-lg-4">${pricing.title}</h2>
          <p class="fs-lg text-muted mb-0">${pricing.description ? pricing.description : ""}</p>
        </div>
      </div>
      <div class="table-responsive-lg">
        <div class="d-flex align-items-center pb-4">
      
          <!-- Pricing plan -->
          <div class="bg-primary rounded-3 shadow-primary p-4" style="width: 36%; min-width: 18rem;">
            <div class="card bg-transparent border-light py-3 py-sm-4 py-lg-5">
              <div class="card-body text-light text-center">
                <h3 class="text-light mb-2">${pricing.items[0].title}</h3>
                <div class="fs-lg opacity-70 pb-4 mb-3">${pricing.items[0].subtitle}</div>
                <div class="display-5 mb-1">$${pricing.items[0].price}</div>
                <div class="opacity-50 mb-5">${pricing.items[0].priceDescription}</div>
              </div>
              <div class="card-footer border-0 text-center pt-0 pb-4">
                ${
                  pricing.items[0].button ? `
                    <a href="${pricing.items[0].button.link}" ${pricing.items[0].button.isExternal ? `target="__blank"` : ""} class="btn btn-light btn-lg shadow-secondary">
                      ${pricing.items[0].button.title}
                    </a>
                  ` : ""
                }
              </div>
            </div>
          </div>
          <div class="row flex-nowrap border rounded-3 rounded-start-0 shadow-sm g-0" style="width: 64%; min-width: 32rem;">
                ${
                  pricing.items.map((item, index) => index > 0 ? `
                  <!-- Pricing plan -->
                  <div class="col">
                    <div class="card bg-light h-100 border-0 border-end rounded-0 py-3 py-sm-4 py-lg-5">
                      <div class="card-body text-center">
                        <h3 class="mb-2">${item.title}</h3>
                        <div class="fs-lg pb-4 mb-3">${item.subtitle}</div>
                        <div class="display-5 text-dark mb-1">$${item.price}</div>
                        <div class="text-muted mb-5">${item.priceDescription}</div>
                      </div>
                      <div class="card-footer border-0 text-center pt-0 pb-4">
                        ${
                          item.button ? `
                            <a href="${item.button.link}" ${item.button.isExternal ? `target="__blank"` : ""} class="btn btn-light btn-lg shadow-secondary">
                              ${item.button.title}
                            </a>
                          ` : ""
                        }
                      </div>
                    </div>
                  </div>
                  ` : "").join("")
                }
          </div>
        </div>
      </div>
    </section>
    `
  }

  function get2x4GridHTML(grid2x4) {
    return `
    <section class="container mt-n1 mt-md-0 py-5">
      <div class="row justify-content-center text-center pt-md-3 pb-4 py-lg-5 mb-1">
        <div class="col-xl-8 col-lg-9 col-md-10">
          <h2 class="h1 mb-lg-4">${grid2x4.title}</h2>
          <p class="fs-lg text-muted mb-0">
            ${grid2x4.description}
          </p>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 g-sm-3 g-lg-4 pb-md-3 pb-lg-5">
        
      ${
        grid2x4.items.map(item => `
          <!-- Item -->
          <div class="col">
            <div class="card card-body card-hover bg-light border-0">
              <img src="${SERVER_URL}${item.image.data.attributes.url}" class="d-block mb-4" width="56" alt="Zoom">
              <p class="mb-0">${item.description ? item.description : ""}</p>
            </div>
          </div>
        `).join("")
      }
        
      </div>
    </section>
    `
  }

  function getCTA1HTML(cta) {
    return `
    <section class="bg-secondary py-5">
      <div class="container text-center py-1 py-md-4 py-lg-5">
        <h2 class="h1 mb-4">${cta.title}</h2>
        <p class="lead pb-3 mb-3">${cta.description}</p>

        ${
          cta.button ? `
            <a href="${cta.button.link}" ${cta.button.isExternal ? `target="__blank"` : ""} class="btn btn-primary shadow-primary btn-lg mb-1">
              ${cta.button.title}
            </a>
          ` : ""
        }
      </div>
    </section>
    `
  }

  function getFooterHTML(footer) {
    return `
    <!-- Footer -->
    <footer class="footer bg-dark dark-mode pt-5 pb-4 pb-lg-5">
      <div class="container text-center pt-lg-3">
        <div class="navbar-brand justify-content-center text-dark mb-2 mb-lg-4">
        ${
          footer.footerImage?.data ? `
            <img src="${SERVER_URL}${footer.footerImage.data.attributes.url}" class="me-2" width="60" alt="Silicon">
          ` : ""
        }
          <span class="fs-4">${footer.heading}</span>
        </div>
        ${
          footer.links.length ? `
          <ul class="nav justify-content-center pt-3 pb-4 pb-lg-5">
            ${
              footer.links.map(link => `
                <li class="nav-item"><a href="${link.link}" class="nav-link">${link.name}</a></li>
              `).join("")
            }
          </ul>
          ` : ""
        }
        <div class="d-flex flex-column flex-sm-row justify-content-center">
          ${
            footer.googlePlayLink ? `
              <a href="${footer.googlePlayLink}" class="btn btn-dark btn-lg px-3 py-2 me-sm-4 mb-3">
                <img src="assets/img/market/appstore-light.svg" class="light-mode-img" width="124" alt="App Store">
                <img src="assets/img/market/appstore-dark.svg" class="dark-mode-img" width="124" alt="App Store">
              </a>
            ` : ""
          }
          ${
            footer.appleStoreLink ? `
              <a href="${footer.appleStoreLink}" class="btn btn-dark btn-lg px-3 py-2 mb-3">
                <img src="assets/img/market/googleplay-light.svg" class="light-mode-img" width="139" alt="Google Play">
                <img src="assets/img/market/googleplay-dark.svg" class="dark-mode-img" width="139" alt="Google Play">
              </a>
            ` : ""
          }
        </div>
        <div class="d-flex justify-content-center pt-4 mt-lg-3">
          ${
            footer.socialMediaLinks.map(link => `
              <a href="${link.name}" class="btn btn-icon btn-secondary btn-${link.icon} mx-2">
                <i class="bx bxl-${link.icon}"></i>
              </a>
            `).join("")
          }
        </div>
        <p class="nav d-block fs-sm text-center pt-5 mt-lg-4 mb-0">
          <span class="text-light opacity-60">&copy; All rights reserved. ${ footer.madeBy ? "Made by " : ""}</span>
          ${
            footer.madeBy ? `
              <a class="nav-link d-inline-block p-0" href="${footer.madeByLink ? footer.madeByLink : "#"}" target="_blank" rel="noopener">${footer.madeBy}</a>
            ` : ""
          }
        </p>
      </div>
    </footer>
    `
  }

  function get404HTML() {
    return `
    <section class="d-flex align-items-center min-vh-100 py-5 bg-light" style="background: radial-gradient(144.3% 173.7% at 71.41% 94.26%, rgba(99, 102, 241, 0.1) 0%, rgba(218, 70, 239, 0.05) 32.49%, rgba(241, 244, 253, 0.07) 82.52%);">
      <div class="container my-5 text-md-start text-center">
        <div class="row align-items-center">

          <!-- Animation -->
          <div class="col-xl-6 col-md-7 order-md-2 ms-n5">
            <lottie-player src="assets/json/animation-404-v1.json" background="transparent" speed="1" loop autoplay></lottie-player>
          </div>

          <!-- Text -->
          <div class="col-md-5 offset-xl-1 order-md-1">
            <h1 class="display-1 mb-sm-4 mt-n4 mt-sm-n5">Error 404</h1>
            <p class="mb-md-5 mb-4 mx-md-0 mx-auto pb-2 lead">The page you are looking for was moved, removed or might never existed.</p>
            <a href="index.html" class="btn btn-lg btn-primary shadow-primary w-sm-auto w-100">
              <i class="bx bx-home-alt me-2 ms-n1 lead"></i>
              Go to homepage
            </a>
          </div>
        </div>
      </div>
    </section>
    `
  }

  function getAvailablePagesGridHTML() {
    return `
    <div class="bg-secondary pt-5" style="padding-bottom: 228px;">
    
      <!-- Page title + Services grid -->
      <section class="container pt-5 pb-2 pb-md-4 pb-lg-5 mb-3">
        <h1 class="pb-4">Landing Pages</h1>
        <div class="row row-cols-1 row-cols-md-2">
          ${
            allPages.map(page => `
              <!-- Item -->
              <div class="col py-4 my-2 my-sm-3">
                <a href="index.html?slug=${page.attributes.slug}" class="card card-hover h-100 border-0 shadow-sm text-decoration-none pt-5 px-sm-3 px-md-0 px-lg-3 pb-sm-3 pb-md-0 pb-lg-3 me-xl-2">
                  <div class="card-body pt-3">
                    <h2 class="h4 d-inline-flex align-items-center">
                      ${page.attributes.title}
                      <i class="bx bx-right-arrow-circle text-primary fs-3 ms-2"></i>
                    </h2>
                  </div>
                </a>
              </div>
            `).join("")
          }

        </div>
      </section>
    </div>
    `
  }


  function getNoContentMessageHTML() {
    return `
    <section class="dark-mode bg-dark bg-size-cover bg-repeat-0 bg-position-center position-relative overflow-hidden py-5" style="background-image: url(assets/img/landing/saas-3/hero/hero-bg.jpg);">
      <div class="container position-relative zindex-2 pt-5 pb-md-2 pb-lg-4 pb-xl-5">
        <div class="row pt-3 pb-2 py-md-4">

          <!-- Text -->
          <div class="col pt-lg-5 text-center text-md-start mb-4 mb-md-0">
            <h1 class="display-3 pb-2 pb-sm-3">There is no content available yet, please add some content from Strapi Dasboard.</h1>
          </div>

        </div>
      </div>
    </section>
    `
  }

})();
