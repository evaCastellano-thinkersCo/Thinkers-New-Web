(() => {
  // Cachea cada fragmento para evitar fetch duplicados cuando el componente se reutiliza.
  const fragmentCache = new Map();
  const swiperRegistry = new WeakMap();
  const galleryRegistry = new WeakMap();
  const isotopeRegistry = new WeakMap();
  const smootherKey = "__appScrollSmootherInitialized";
  const hostStyleId = "fragment-component-host-styles";
  const templateMainScriptId = "template-main-script";
  const fragmentTags = [
    "nav-bar",
    "hero-section",
    "logos-colaboradores",
    "propuesta-de-valor",
    "reenfoque-section",
    "como-ayudamos",
    "casos-destacados",
  ];

  const SELECTORS = {
    dynamicBackground: "[data-src]",
    mobileNav: ".cs_nav",
    mobileNavToggle: ".cs_munu_toggle",
    dropdownParent: ".menu-item-has-children",
    blackDropdownParent: ".menu-item-has-black-section",
    sideHeaderButton: ".cs_icon_btn",
    sideHeaderClose: ".cs_close, .cs_side_header_overlay",
    hoverTab: ".cs_hover_tab",
    scrollUp: ".cs_scrollup",
    roundButtonWrap: ".cs_round_btn_wrap",
    lightGallery: ".lightgallery, #animated-thumbnails-gallery",
    isotopes: ".isotope-container, .cs_isotop_items_details, .cs_creative_protfolio_details",
  };

  const SWIPER_CONFIGS = [
    {
      selector: ".cs_slider_1",
      options: (element) => ({
        loop: queryAll(element, ".swiper-slide").length > 1,
        speed: 1000,
        autoplay: false,
        pagination: {
          el: findSibling(element, ".cs_pagination"),
          clickable: true,
        },
      }),
    },
    {
      selector: ".cs_slider_2",
      options: (element) => ({
        loop: true,
        speed: 1000,
        autoplay: false,
        pagination: {
          el: findSibling(element, ".cs_pagination"),
          type: "fraction",
        },
        navigation: {
          nextEl: findInScope(element, ".cs_swiper_button_next"),
          prevEl: findInScope(element, ".cs_swiper_button_prev"),
        },
      }),
    },
    {
      selector: ".cs_slider_3",
      options: (element) => ({
        loop: true,
        speed: 1000,
        autoplay: false,
        slidesPerView: "auto",
        spaceBetween: 30,
        pagination: {
          el: findSibling(element, ".cs_pagination"),
          clickable: true,
        },
      }),
    },
    {
      selector: ".cs_slider_4",
      options: (element) => ({
        loop: true,
        speed: 1000,
        autoplay: true,
        pagination: {
          el: findSibling(element, ".cs_pagination"),
          clickable: true,
        },
      }),
    },
    {
      selector: ".cs_slider_5, .cs_slider_6, .cs_horizontal_scrolls",
      options: (element) => ({
        loop: true,
        speed: 1000,
        autoplay: false,
        slidesPerView: "auto",
        spaceBetween: 30,
        pagination: {
          el: findSibling(element, ".cs_pagination"),
          clickable: true,
        },
      }),
    },
    {
      selector: ".cs_fullscreen_swiper_slider",
      options: (element) => ({
        direction: "vertical",
        mousewheel: true,
        loop: true,
        speed: 1000,
        pagination: {
          el: findSibling(element, ".cs_swiper_pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: findInScope(element, ".cs_swiper_button_next"),
          prevEl: findInScope(element, ".cs_swiper_button_prev"),
        },
      }),
    },
    {
      selector: ".swiper",
      options: (element) => ({
        loop: element.dataset.loop !== "false",
        speed: Number(element.dataset.speed || 600),
        autoplay: element.dataset.autoplay === "true",
        pagination: {
          el:
            findInScope(element, ".swiper-pagination") ||
            findSibling(element, ".swiper-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl:
            findInScope(element, ".swiper-button-next") ||
            findSibling(element, ".swiper-button-next"),
          prevEl:
            findInScope(element, ".swiper-button-prev") ||
            findSibling(element, ".swiper-button-prev"),
        },
      }),
    },
  ];

  function queryAll(root, selector) {
    const scope = root && root.querySelectorAll ? root : document;
    const nodes = Array.from(scope.querySelectorAll(selector));
    if (root instanceof Element && root.matches(selector)) {
      nodes.unshift(root);
    }
    return [...new Set(nodes)];
  }

  function findInScope(element, selector) {
    return element.querySelector(selector);
  }

  function findSibling(element, selector) {
    return (
      element.querySelector(selector) ||
      element.parentElement?.querySelector(selector) ||
      element.closest("section, header, footer, div")?.querySelector(selector) ||
      null
    );
  }

  function sanitizeFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();

    // Los estilos globales deben venir del documento principal, no del fragmento.
    template.content.querySelectorAll('link[rel="stylesheet"], script').forEach((node) => {
      node.remove();
    });

    return template.content;
  }

  function nextFrame() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }

  function loadScriptOnce(src, id) {
    const existing = id ? document.getElementById(id) : null;
    if (existing?.dataset.loaded === "true") {
      return Promise.resolve(existing);
    }

    if (existing?.dataset.loading === "true") {
      return new Promise((resolve, reject) => {
        existing.addEventListener("load", () => resolve(existing), { once: true });
        existing.addEventListener("error", reject, { once: true });
      });
    }

    return new Promise((resolve, reject) => {
      const script = existing || document.createElement("script");
      if (id) {
        script.id = id;
      }

      script.dataset.loading = "true";
      script.src = src;
      script.async = false;
      script.addEventListener(
        "load",
        () => {
          script.dataset.loading = "false";
          script.dataset.loaded = "true";
          resolve(script);
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        (event) => {
          script.dataset.loading = "false";
          reject(event);
        },
        { once: true }
      );

      if (!existing) {
        document.head.appendChild(script);
      }
    });
  }

  function isTemplateMainLoaded() {
    return window.__templateMainLoaded === true;
  }

  function markTemplateMainLoaded() {
    window.__templateMainLoaded = true;
  }

  function ensureHostStyles() {
    if (document.getElementById(hostStyleId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = hostStyleId;
    style.textContent = `
      nav-bar,
      hero-section,
      logos-colaboradores,
      propuesta-de-valor,
      reenfoque-section,
      como-ayudamos,
      casos-destacados {
        display: contents;
      }

      nav-bar[aria-busy="true"],
      hero-section[aria-busy="true"],
      logos-colaboradores[aria-busy="true"],
      propuesta-de-valor[aria-busy="true"],
      reenfoque-section[aria-busy="true"],
      como-ayudamos[aria-busy="true"],
      casos-destacados[aria-busy="true"] {
        visibility: hidden;
      }
    `;

    document.head.appendChild(style);
  }

  async function fetchFragment(url) {
    if (!fragmentCache.has(url)) {
      fragmentCache.set(
        url,
        fetch(url).then(async (response) => {
          if (!response.ok) {
            throw new Error(`No se pudo cargar el fragmento: ${url}`);
          }

          return response.text();
        })
      );
    }

    return fragmentCache.get(url);
  }

  function applyDynamicBackgrounds(root) {
    queryAll(root, SELECTORS.dynamicBackground).forEach((element) => {
      const source = element.getAttribute("data-src");
      if (!source) {
        return;
      }

      if (element.tagName === "IMG" && !element.getAttribute("src")) {
        element.setAttribute("src", source);
        return;
      }

      element.style.backgroundImage = `url("${source}")`;
    });
  }

  async function waitForImages(root) {
    const pendingImages = queryAll(root, "img").filter((image) => !image.complete);
    if (!pendingImages.length) {
      return;
    }

    await Promise.all(
      pendingImages.map(
        (image) =>
          new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          })
      )
    );
  }

  async function prepareFragment(root) {
    ensureHostStyles();
    applyDynamicBackgrounds(root);
    await waitForImages(root);
    await nextFrame();
  }

  function initMenuText(root) {
    queryAll(root, ".cs_animo_links > li > a").forEach((link) => {
      if (link.dataset.menuTextReady === "true") {
        return;
      }

      link.dataset.menuTextReady = "true";
      const chars = (link.textContent || "").split("").join("</span><span>");
      link.innerHTML = `<span class="cs_animo_text"><span>${chars}</span></span>`;
    });
  }

  function initNavigation(root) {
    if (isTemplateMainLoaded()) {
      return;
    }

    queryAll(root, SELECTORS.mobileNav).forEach((nav) => {
      if (!nav.querySelector(SELECTORS.mobileNavToggle)) {
        nav.insertAdjacentHTML("beforeend", '<span class="cs_munu_toggle"><span></span></span>');
      }
    });

    queryAll(root, SELECTORS.dropdownParent).forEach((item) => {
      if (!item.querySelector(":scope > .cs_munu_dropdown_toggle")) {
        item.insertAdjacentHTML("beforeend", '<span class="cs_munu_dropdown_toggle"></span>');
      }
    });

    queryAll(root, SELECTORS.blackDropdownParent).forEach((item) => {
      if (!item.querySelector(":scope > .cs_munu_dropdown_toggle_1")) {
        item.insertAdjacentHTML("beforeend", '<span class="cs_munu_dropdown_toggle_1"></span>');
      }
    });

    queryAll(root, ".cs_munu_toggle").forEach((toggle) => {
      if (toggle.dataset.bound === "true") {
        return;
      }

      toggle.dataset.bound = "true";
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("cs_toggle_active");
        const navList = toggle.parentElement?.querySelector(".cs_nav_list");
        if (navList) {
          if (typeof jQuery !== "undefined") {
            jQuery(navList).stop(true, true).slideToggle();
          } else {
            navList.hidden = !navList.hidden;
          }
        }
      });
    });

    queryAll(root, ".cs_munu_dropdown_toggle").forEach((toggle) => {
      if (toggle.dataset.bound === "true") {
        return;
      }

      toggle.dataset.bound = "true";
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        toggle.parentElement?.classList.toggle("active");
        const submenu = toggle.previousElementSibling;

        if (submenu && submenu.tagName === "UL") {
          if (typeof jQuery !== "undefined") {
            jQuery(submenu).stop(true, true).slideToggle();
          } else {
            submenu.hidden = !submenu.hidden;
          }
        }
      });
    });

    queryAll(root, ".cs_munu_dropdown_toggle_1").forEach((toggle) => {
      if (toggle.dataset.bound === "true") {
        return;
      }

      toggle.dataset.bound = "true";
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        toggle.parentElement?.classList.toggle("active");
        const submenu = toggle.previousElementSibling;

        if (submenu && submenu.tagName === "UL") {
          if (typeof jQuery !== "undefined") {
            jQuery(submenu).stop(true, true).slideToggle();
          } else {
            submenu.hidden = !submenu.hidden;
          }
        }
      });
    });

    queryAll(root, ".cs_mode_btn").forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        button.classList.toggle("active");
        document.body.classList.toggle("cs_dark");
      });
    });

    queryAll(root, SELECTORS.sideHeaderButton).forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        document.querySelector(".cs_side_header")?.classList.add("active");
      });
    });

    queryAll(root, SELECTORS.sideHeaderClose).forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        document.querySelector(".cs_side_header")?.classList.remove("active");
      });
    });

    initMenuText(root);
  }

  function initHoverTab(root) {
    queryAll(root, SELECTORS.hoverTab).forEach((element) => {
      if (element.dataset.bound === "true") {
        return;
      }

      element.dataset.bound = "true";
      element.addEventListener("mouseenter", () => {
        const parent = element.parentElement;
        if (!parent) {
          return;
        }

        parent.querySelectorAll(".cs_hover_tab").forEach((sibling) => {
          sibling.classList.toggle("active", sibling === element);
        });
      });
    });
  }

  function initScrollUp(root) {
    queryAll(root, SELECTORS.scrollUp).forEach((element) => {
      if (element.dataset.bound === "true") {
        return;
      }

      element.dataset.bound = "true";
      element.addEventListener("click", (event) => {
        event.preventDefault();
        if (typeof gsap !== "undefined" && typeof ScrollToPlugin !== "undefined") {
          gsap.to(window, { duration: 0, scrollTo: 0 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }

  function refreshScrollUpState() {
    const shouldShow = window.scrollY >= 350;
    document.querySelectorAll(SELECTORS.scrollUp).forEach((element) => {
      element.classList.toggle("cs_scrollup_show", shouldShow);
    });
  }

  function initButtonHover(root) {
    if (typeof gsap === "undefined") {
      return;
    }

    queryAll(root, SELECTORS.roundButtonWrap).forEach((wrap) => {
      if (wrap.dataset.bound === "true") {
        return;
      }

      const button = wrap.querySelector(".cs_hero_btn");
      if (!button) {
        return;
      }

      wrap.dataset.bound = "true";

      wrap.addEventListener("mousemove", (event) => {
        const bounds = wrap.getBoundingClientRect();
        const relX = event.clientX - bounds.left;
        const relY = event.clientY - bounds.top;
        const movement = 80;

        gsap.to(button, {
          duration: 0.5,
          x: ((relX - bounds.width / 2) / bounds.width) * movement,
          y: ((relY - bounds.height / 2) / bounds.height) * movement,
          ease: "power2.out",
        });
      });

      wrap.addEventListener("mouseleave", () => {
        gsap.to(button, {
          duration: 0.5,
          x: 0,
          y: 0,
          ease: "power2.out",
        });
      });
    });
  }

  function initLightGalleries(root) {
    if (typeof lightGallery === "undefined") {
      return;
    }

    queryAll(root, SELECTORS.lightGallery).forEach((element) => {
      if (galleryRegistry.has(element)) {
        return;
      }

      const instance = lightGallery(element, {
        animateThumb: false,
        zoomFromOrigin: false,
        allowMediaOverlap: true,
        toggleThumb: true,
      });

      galleryRegistry.set(element, instance);
    });
  }

  function initIsotopes(root) {
    if (typeof jQuery === "undefined" || typeof jQuery.fn?.isotope === "undefined") {
      return;
    }

    queryAll(root, SELECTORS.isotopes).forEach((element) => {
      if (isotopeRegistry.has(element)) {
        isotopeRegistry.get(element).layout();
        return;
      }

      const instance = jQuery(element).isotope({});
      isotopeRegistry.set(element, instance);
    });

    queryAll(root, ".cs_isotop_item_menu, .cs_creative_protfolio_menu").forEach((menu) => {
      if (menu.dataset.bound === "true") {
        return;
      }

      menu.dataset.bound = "true";
      menu.addEventListener("click", (event) => {
        const item = event.target.closest("li");
        if (!item) {
          return;
        }

        const filterValue = item.getAttribute("data-filter") || "*";
        const targetSelector = menu.matches(".cs_isotop_item_menu")
          ? ".cs_isotop_items_details"
          : ".cs_creative_protfolio_details";

        document.querySelectorAll(targetSelector).forEach((grid) => {
          jQuery(grid).isotope({ filter: filterValue });
        });
      });
    });
  }

  function initSwipers(root) {
    if (typeof Swiper === "undefined") {
      return;
    }

    // Detecta automáticamente el tipo de slider por clases del template.
    SWIPER_CONFIGS.forEach(({ selector, options }) => {
      queryAll(root, selector).forEach((element) => {
        if (swiperRegistry.has(element) || element.swiper) {
          element.swiper?.update?.();
          return;
        }

        const config = options(element);
        if (config.pagination && !config.pagination.el) {
          delete config.pagination;
        }

        if (
          config.navigation &&
          !config.navigation.nextEl &&
          !config.navigation.prevEl
        ) {
          delete config.navigation;
        }

        const instance = new Swiper(element, config);
        swiperRegistry.set(element, instance);
      });
    });
  }

  function animateWithGsap(root) {
    if (
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined"
    ) {
      return;
    }

    if (!animateWithGsap.pluginsRegistered) {
      if (typeof ScrollToPlugin !== "undefined" && typeof ScrollSmoother !== "undefined") {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);
      } else {
        gsap.registerPlugin(ScrollTrigger);
      }

      gsap.config({ nullTargetWarn: false });
      animateWithGsap.pluginsRegistered = true;
    }

    // ScrollSmoother es global; solo debe existir una instancia en toda la página.
    initScrollSmoother();

    const fadeAnimations = [
      [".anim_div_ShowZoom", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }],
      [".anim_div_ShowLeftSide", { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 2, ease: "power2.out" }],
      [".anim_div_ShowRightSide", { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 2, ease: "power2.out" }],
      [".anim_div_ShowDowns", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }],
      [".anim_div_ShowUps", { opacity: 0, y: -100 }, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }],
      [".anim_blog", { opacity: 0, x: -100, y: -100 }, { opacity: 1, x: 0, y: 0, duration: 2, ease: "power2.out" }],
      [".cs_btn_anim", { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1, delay: 0.8 }],
    ];

    fadeAnimations.forEach(([selector, fromVars, toVars]) => {
      queryAll(root, selector).forEach((element) => {
        if (element.dataset.gsapReady === "true") {
          return;
        }

        element.dataset.gsapReady = "true";
        gsap.set(element, fromVars);
        gsap.to(element, {
          ...toVars,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "bottom 60%",
            markers: false,
          },
        });
      });
    });

    if (typeof SplitText !== "undefined") {
      initSplitAnimations(root);
    }

    ScrollTrigger.refresh();
    refreshSmoother();
  }

  function initSplitAnimations(root) {
    const splitAnimations = [
      {
        selector: ".anim_word_writting",
        type: "words",
        from: {
          duration: 0.7,
          x: 100,
          delay: 0.5,
          autoAlpha: 0,
          stagger: 0.2,
        },
      },
      {
        selector: ".anim_text_writting",
        type: "chars, words",
        from: {
          duration: 0.5,
          x: 100,
          autoAlpha: 0,
          stagger: 0.1,
        },
      },
      {
        selector: ".anim_heading_title, .anim_text",
        type: "lines",
        from: {
          duration: 1,
          delay: 0.3,
          opacity: 0,
          rotationX: -80,
          force3D: true,
          transformOrigin: "top center -50",
          stagger: 0.1,
        },
      },
    ];

    splitAnimations.forEach(({ selector, type, from }) => {
      queryAll(root, selector).forEach((element) => {
        if (element.dataset.splitReady === "true") {
          return;
        }

        element.dataset.splitReady = "true";
        const split = new SplitText(element, { type });
        const targets = split.words || split.chars || split.lines;

        gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "bottom 60%",
            scrub: false,
            markers: false,
            toggleActions: "play none none none",
          },
        }).from(targets, from);
      });
    });
  }

  function initScrollSmoother() {
    if (
      typeof ScrollSmoother === "undefined" ||
      typeof gsap === "undefined" ||
      (typeof ScrollSmoother.get === "function" && ScrollSmoother.get()) ||
      document.documentElement[smootherKey] === "true"
    ) {
      return;
    }

    const container = document.querySelector("#scrollsmoother-container");
    if (!container) {
      return;
    }

    const width = window.innerWidth;
    ScrollSmoother.create({
      content: "#scrollsmoother-container",
      smooth: 1.2,
      normalizeScroll: width < 991,
      ignoreMobileResize: true,
      effects: width > 991,
      smoothTouch: true,
    });

    document.documentElement[smootherKey] = "true";
  }

  function refreshSmoother() {
    if (typeof ScrollSmoother === "undefined") {
      return;
    }

    const smoother = typeof ScrollSmoother.get === "function" ? ScrollSmoother.get() : null;
    smoother?.refresh?.();
  }

  async function initComponents(root = document) {
    await prepareFragment(root);

    if (!isTemplateMainLoaded()) {
      return;
    }

    // Primera pasada: deja el DOM listo para layout y estilos dependientes del markup.
    initNavigation(root);
    initHoverTab(root);
    initScrollUp(root);
    initButtonHover(root);

    // Segunda pasada: inicializa plugins cuando el navegador ya pintó el fragmento.
    initSwipers(root);
    initIsotopes(root);
    initLightGalleries(root);
    animateWithGsap(root);

    refreshScrollUpState();
    window.dispatchEvent(new Event("resize"));
  }

  class BaseComponent extends HTMLElement {
    static fragmentUrl = "";

    async connectedCallback() {
      if (this.dataset.componentReady === "true") {
        return;
      }

      this.dataset.componentReady = "true";
      const url = this.getAttribute("src") || this.constructor.fragmentUrl;

      if (!url) {
        return;
      }

      try {
        this.style.display = this.getAttribute("data-host-display") || "contents";
        this.setAttribute("aria-busy", "true");
        const html = await fetchFragment(url);
        const content = sanitizeFragment(html);
        this.replaceChildren(content);
        await initComponents(this);
        this.dataset.fragmentLoaded = "true";
        this.dispatchEvent(
          new CustomEvent("component:loaded", {
            bubbles: true,
            detail: { url, element: this },
          })
        );
      } catch (error) {
        console.error(error);
        this.innerHTML = `<div class="component-error">No se pudo cargar ${url}</div>`;
        this.dataset.fragmentLoaded = "true";
      } finally {
        this.removeAttribute("aria-busy");
      }
    }
  }

  function defineFragmentComponent(tagName, fragmentUrl) {
    if (customElements.get(tagName)) {
      return customElements.get(tagName);
    }

    class FragmentComponent extends BaseComponent {}
    FragmentComponent.fragmentUrl = fragmentUrl;
    customElements.define(tagName, FragmentComponent);
    return FragmentComponent;
  }

  window.BaseComponent = BaseComponent;
  window.defineFragmentComponent = defineFragmentComponent;
  window.initComponents = initComponents;
  window.initApp = initComponents;

  defineFragmentComponent("nav-bar", "componentes/nav-bar.html");
  defineFragmentComponent("hero-section", "componentes/hero-section.html");
  defineFragmentComponent("logos-colaboradores", "componentes/logos-colaboradores.html");
  defineFragmentComponent("propuesta-de-valor", "componentes/propuesta-de-valor.html");
  defineFragmentComponent("reenfoque-section", "componentes/reenfoque-section.html");
  defineFragmentComponent("como-ayudamos", "componentes/como-ayudamos.html");
  defineFragmentComponent("casos-destacados", "componentes/casos-destacados.html");

  window.addEventListener("scroll", refreshScrollUpState, { passive: true });

  function waitForInitialComponents() {
    const elements = fragmentTags
      .flatMap((tagName) => Array.from(document.querySelectorAll(tagName)));

    return Promise.all(
      elements.map(
        (element) =>
          new Promise((resolve) => {
            if (element.dataset.fragmentLoaded === "true") {
              resolve();
              return;
            }

            element.addEventListener("component:loaded", () => resolve(), { once: true });
          })
      )
    );
  }

  async function bootstrapTemplate() {
    if (bootstrapTemplate.started) {
      return;
    }

    bootstrapTemplate.started = true;
    ensureHostStyles();
    await waitForInitialComponents();
    await prepareFragment(document);
    await loadScriptOnce("assets/js/main.js", templateMainScriptId);
    markTemplateMainLoaded();

    if (typeof jQuery !== "undefined") {
      jQuery(window).trigger("load");
      jQuery(window).trigger("resize");
      jQuery(window).trigger("scroll");
    } else {
      window.dispatchEvent(new Event("load"));
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    }

    await initComponents(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrapTemplate, { once: true });
  } else {
    bootstrapTemplate();
  }
})();
