(function () {
  const SERVER_URL = "http://138.197.108.65:8337"
  window.onload = async function () {
    try {
      const { data } = await fetchPage();
      if (data) {
        populateLandingPage(data)
      }
      finishLoading()
    } catch (error) {
      console.error(error);
    }
  };

  function fetchPage() {
    return fetch(`${SERVER_URL}/api/landing-page-saas-v-2/?populate[blocks][on][blocks.hero-single-column][populate]=*&populate[blocks][on][blocks.2x3-grid][populate][0]=items&populate[blocks][on][blocks.2x3-grid][populate][1]=items.image&populate[blocks][on][blocks.testimonials][populate]=*&populate[blocks][on][blocks.pricing][populate][0]=items&populate[blocks][on][blocks.pricing][populate][1]=items.button&populate[blocks][on][blocks.4x2-grid][populate][0]=items&populate[blocks][on][blocks.4x2-grid][populate][1]=items.image&populate[blocks][on][blocks.call-to-action-1][populate]=*&populate[blocks][on][blocks.footer][populate]=*`)
      .then((response) => response.json());
  }

  function finishLoading() {
    const preloader = document.querySelector('.page-loading');
    preloader.classList.remove('active');
    preloader.remove();
  }

  function populateLandingPage(page) {
    console.log(page);
    const mainElement = document.querySelector("main");
    const { title, blocks } = page.attributes;
    document.title = title
    
    blocks.forEach(block => {
      console.log(block.__component);
      const addSectionToPage = (section) => mainElement.insertAdjacentHTML("beforeend", section)
      if (block.__component === "blocks.hero-single-column") {
        addSectionToPage(getHeroSectionHTML(block))
      } else if (block.__component === "blocks.2x3-grid") {
        addSectionToPage(get2x3GridHTML(block))
      } else if (block.__component === "blocks.testimonials") {
        addSectionToPage(getTestimonialsHTML(block))
        initSwiper(mainElement.lastElementChild.querySelector(".swiper"))
      } else if (block.__component === "blocks.pricing") {
        addSectionToPage(getPricingHTML(block))
      } else if (block.__component === "blocks.4x2-grid") {
        addSectionToPage(get2x4GridHTML(block))
      } else if (block.__component === "blocks.call-to-action-1") {
        addSectionToPage(getCTAHTML(block))
      } else if (block.__component === "blocks.footer") {
        addSectionToPage(getFooterHTML(block))
      }
    });
  }

  function initSwiper(element) {
    const swiperOptions = JSON.parse(element.getAttribute("data-swiper-options"))
    new Swiper(element, swiperOptions)
  }

  const getHeroSectionHTML = (hero) => {
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

  function getCTAHTML(cta) {
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
          footer.footerImage ? `
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

})();
