(function () {
  const SERVER_URL = "http://138.197.108.65:1337"
  window.onload = async function () {
    try {
      const { data } = await fetchArticles();
      if (data && data.length) {
        populateLandingPage(data[0])
      }
      finishLoading()
    } catch (error) {
      console.error(error);
    }
  };

  function fetchArticles() {
    return fetch(`${SERVER_URL}/api/pages?populate[SEO][populate]=*&populate[block][populate]=*&filters[name][$eq]=landing`)
      .then((response) => response.json());
  }

  function finishLoading() {
    const preloader = document.querySelector('.page-loading');
    preloader.classList.remove('active');
    preloader.remove();
  }

  function populateLandingPage(page) {
    const { title, block } = page.attributes;
    document.title = title
    
    const hero = block.find(b => b.__component === "blocks.hero");
    const logos = block.find(b => b.__component === "blocks.logos");

    if (hero) {
      document.getElementById("hero-title").innerHTML = hero.title;
      document.getElementById("hero-description").innerHTML = hero.description;
      const primaryCallToActionButton = document.getElementById("hero-primary-call-to-action");
      const secondaryCallToActionButton = document.getElementById("hero-secondary-call-to-action");
  
      if (hero.primaryCallToAction) {
        primaryCallToActionButton.innerHTML = hero.primaryCallToAction.title;
        if (hero.primaryCallToAction.link) {
          primaryCallToActionButton.setAttribute("href", hero.primaryCallToAction.link)
        }
        primaryCallToActionButton.setAttribute("__blank", hero.primaryCallToAction.isExternal)
      }
  
      if (hero.secondaryCallToAction) {
        secondaryCallToActionButton.innerHTML = hero.secondaryCallToAction.title;
        if (hero.secondaryCallToAction.link) {
          secondaryCallToActionButton.setAttribute("href", hero.secondaryCallToAction.link)
        }
        secondaryCallToActionButton.setAttribute("__blank", hero.secondaryCallToAction.isExternal)
      }
    }

    if (logos) {
      
    }
  }

})();
