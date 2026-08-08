/* ==========================================================================
   СКЛАД-МАГАЗИН — interactions
   Hero slider · product tabs · row carousel · cart / favourites · toasts
   ========================================================================== */

(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ======================================================================
     TOASTS
     ====================================================================== */

  const toastHost = $('#toasts');

  function toast(message, icon = 'i-cart') {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<svg class="ico"><use href="#${icon}"/></svg><span></span>`;
    $('span', el).textContent = message;
    toastHost.appendChild(el);

    setTimeout(() => {
      el.classList.add('is-out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, 2600);
  }

  window.toast = toast;

  /* ======================================================================
     HEADER — shadow once the page scrolls
     ====================================================================== */

  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ======================================================================
     HERO SLIDER
     ====================================================================== */

  const hero = $('#hero');

  if (hero) {
    const slides = $$('.hero-slide', hero);
    const dotHost = $('#heroDots');
    const AUTOPLAY = 6000;

    let index = 0;
    let timer = null;

    // Build "01 — 02 — 03" pagination
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot';
      dot.setAttribute('role', 'tab');
      dot.textContent = String(i + 1).padStart(2, '0');
      dot.addEventListener('click', () => goTo(i));
      dotHost.appendChild(dot);
    });

    const dots = $$('.hero-dot', dotHost);

    function goTo(next) {
      index = (next + slides.length) % slides.length;

      slides.forEach((s, i) => {
        const active = i === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
      });

      dots.forEach((d, i) => {
        const active = i === index;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', String(active));
      });

      restart();
    }

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    function restart() {
      clearInterval(timer);
      timer = setInterval(next, AUTOPLAY);
    }

    $$('[data-hero]', hero).forEach(btn =>
      btn.addEventListener('click', () => (btn.dataset.hero === 'next' ? next() : prev()))
    );

    // Pause while the pointer rests on the slider
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', restart);

    // Pause when the tab is hidden — avoids racing through slides in background
    document.addEventListener('visibilitychange', () =>
      document.hidden ? clearInterval(timer) : restart()
    );

    // Keyboard
    hero.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    });

    // Touch swipe
    let touchX = null;
    hero.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      if (touchX === null) return;
      const delta = e.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 45) (delta < 0 ? next : prev)();
      touchX = null;
    }, { passive: true });

    goTo(0);
  }

  /* ======================================================================
     PRODUCTS
     ====================================================================== */

  const CATALOG = {
    hit: [
      { tag: 'hit',  art: 'p-fridge',    name: 'Холодильник Samsung RB33J3200WW',       now: 18999, was: 21999, rate: 4.8 },
      { tag: 'new',  art: 'p-washer',    name: 'Пральна машина LG F2V3O56W',            now: 13499, was: 16000, rate: 4.9 },
      { tag: 'hit',  art: 'p-moto',      name: 'Мотоцикл Forte FT250-CFA',              now: 39999, was: 45000, rate: 4.8 },
      { tag: 'sale', art: 'p-tractor',   name: 'Мотоблок Forte 80-G3 (7 к.с.)',         now: 18999, was: 22000, rate: 4.7 },
      { tag: 'new',  art: 'p-drill',     name: 'Шуруповерт DeWalt DCD771S2T',           now:  4999, was:  6200, rate: 4.8 },
      { tag: 'sale', art: 'p-pots',      name: 'Набір каструль Krauff 26-238-006 (6 предметів)', now: 2299, was: 3000, rate: 4.6 }
    ],
    new: [
      { tag: 'new',  art: 'p-washer',    name: 'Пральна машина Bosch WGA12400UA',       now: 17499, was: 19900, rate: 4.9 },
      { tag: 'new',  art: 'p-drill',     name: 'Перфоратор Makita HR2470 SDS-Plus',     now:  6799, was:  7900, rate: 4.8 },
      { tag: 'new',  art: 'p-generator', name: 'Генератор Forte FG3000E 2.8 кВт',       now: 15999, was: 18500, rate: 4.7 },
      { tag: 'new',  art: 'p-sofa',      name: 'Диван-ліжко Sofia 2-місний, велюр',     now: 12490, was: 14900, rate: 4.6 },
      { tag: 'new',  art: 'p-fridge',    name: 'Холодильник gorenje NRK6192AXL4',       now: 22990, was: 25900, rate: 4.8 },
      { tag: 'new',  art: 'p-tractor',   name: 'Культиватор STIHL MH 445 бензиновий',   now: 27499, was: 31000, rate: 4.9 }
    ],
    sale: [
      { tag: 'sale', art: 'p-pots',      name: 'Набір посуду Krauff 12 предметів',      now:  1799, was:  2790, rate: 4.5 },
      { tag: 'sale', art: 'p-drill',     name: 'Кутова шліфмашина DeWalt DWE4157',      now:  2999, was:  4300, rate: 4.7 },
      { tag: 'sale', art: 'p-moto',      name: 'Скутер Forte Alpha 110 куб.',           now: 28999, was: 36000, rate: 4.6 },
      { tag: 'sale', art: 'p-sofa',      name: 'Крісло-мішок Comfort XL, екошкіра',     now:  1299, was:  1990, rate: 4.4 },
      { tag: 'sale', art: 'p-washer',    name: 'Пральна машина Samsung WW60AG4S00',     now: 11999, was: 15400, rate: 4.7 },
      { tag: 'sale', art: 'p-generator', name: 'Зварювальний інвертор Forte MMA-250',   now:  2499, was:  3600, rate: 4.5 }
    ]
  };

  const TAG_LABEL = { hit: 'ХІТ', new: 'НОВИНКА', sale: 'АКЦІЯ' };

  // Space-separated thousands, as in the mock-up: 18999 → "18 999 грн"
  const price = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' грн';

  function cardMarkup(p) {
    return `
      <article class="product">
        <span class="product-tag ${p.tag}">${TAG_LABEL[p.tag]}</span>
        <button class="product-fav" type="button" aria-label="Додати в обране" aria-pressed="false">
          <svg class="ico ico-sm"><use href="#i-heart"/></svg>
        </button>
        <div class="product-art"><svg class="ill" viewBox="0 0 120 120"><use href="#${p.art}"/></svg></div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-foot">
          <div class="product-price">
            <span class="now">${price(p.now)}</span>
            <span class="was">${price(p.was)}</span>
          </div>
          <div class="product-meta">
            <span class="rating"><svg class="ico"><use href="#i-star"/></svg>${p.rate.toFixed(1)}</span>
            <button class="product-buy" type="button" aria-label="Додати в кошик">
              <svg class="ico"><use href="#i-cart"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }

  const grid = $('#productGrid');
  let activeTab = 'hit';
  let offset = 0;

  function render(key) {
    // Rotate the list so the row arrows have something to move
    const list = CATALOG[key];
    const shifted = list.slice(offset % list.length).concat(list.slice(0, offset % list.length));
    grid.innerHTML = shifted.map(cardMarkup).join('');
  }

  function swapTo(key) {
    if (key === activeTab) return;
    activeTab = key;
    offset = 0;

    grid.classList.add('is-swapping');
    setTimeout(() => {
      render(activeTab);
      grid.classList.remove('is-swapping');
    }, 180);
  }

  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      swapTo(tab.dataset.tab);
    });
  });

  $$('[data-row]').forEach(btn => {
    btn.addEventListener('click', () => {
      offset += btn.dataset.row === 'next' ? 1 : -1;
      const len = CATALOG[activeTab].length;
      offset = ((offset % len) + len) % len;

      grid.classList.add('is-swapping');
      setTimeout(() => {
        render(activeTab);
        grid.classList.remove('is-swapping');
      }, 150);
    });
  });

  render(activeTab);

  /* ======================================================================
     CART & FAVOURITES (delegated — cards are re-rendered on every tab swap)
     ====================================================================== */

  const cartCount = $('#cartCount');
  let cart = Number(cartCount.textContent) || 0;

  document.addEventListener('click', e => {
    const buy = e.target.closest('.product-buy');
    if (buy) {
      cart += 1;
      cartCount.textContent = cart;
      const name = $('.product-name', buy.closest('.product')).textContent;
      toast(`Додано в кошик: ${name}`);
      return;
    }

    const fav = e.target.closest('.product-fav');
    if (fav) {
      const on = fav.classList.toggle('is-on');
      fav.setAttribute('aria-pressed', String(on));
      toast(on ? 'Додано в обране' : 'Видалено з обраного', 'i-heart');
    }
  });

  /* ======================================================================
     PLACEHOLDER ACTIONS — everything else is a static mock-up
     ====================================================================== */

  $('.phone-callback')?.addEventListener('click', () =>
    toast('Замовлення дзвінка — форма в розробці', 'i-phone')
  );

  $('.ai-chip')?.addEventListener('click', () =>
    toast('AI-пошук: опишіть товар своїми словами', 'i-sparkle')
  );

  $('.search')?.addEventListener('submit', () => {
    const q = $('#q').value.trim();
    toast(q ? `Пошук: «${q}»` : 'Введіть запит для пошуку', 'i-search');
  });

  $('.btn-catalog')?.addEventListener('click', () =>
    document.querySelector('#catalog').scrollIntoView({ behavior: 'smooth', block: 'start' })
  );

  $('.mobile-toggle')?.addEventListener('click', () =>
    toast('Мобільне меню — в розробці', 'i-menu')
  );

})();
