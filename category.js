/* ==========================================================================
   СКЛАД-МАГАЗИН — category page interactions
   Filters accordion · price range · sort selects · view toggle · chips · pagination
   ========================================================================== */

(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ======================================================================
     FILTERS ACCORDION
     ====================================================================== */

  $$('.filter-head').forEach(head => {
    head.addEventListener('click', () => {
      const group = head.closest('.filter-group');
      const collapsed = group.classList.toggle('is-collapsed');
      head.setAttribute('aria-expanded', String(!collapsed));
    });
  });

  /* ======================================================================
     PRICE RANGE SLIDER
     ====================================================================== */

  const priceMin = $('#priceMin');
  const priceMax = $('#priceMax');
  const priceFill = $('#priceFill');
  const priceMinVal = $('#priceMinVal');
  const priceMaxVal = $('#priceMaxVal');

  const fmt = n => Number(n).toLocaleString('uk-UA') + ' грн';

  function updatePriceRange() {
    const min = Number(priceMin.value);
    const max = Number(priceMax.value);
    const bound = Number(priceMin.max);

    if (min > max - 500) {
      priceMin.value = Math.max(0, max - 500);
    }

    const lo = (Number(priceMin.value) / bound) * 100;
    const hi = (Number(priceMax.value) / bound) * 100;

    priceFill.style.left = lo + '%';
    priceFill.style.right = (100 - hi) + '%';

    priceMinVal.textContent = fmt(priceMin.value);
    priceMaxVal.textContent = fmt(priceMax.value);
  }

  if (priceMin && priceMax) {
    priceMin.addEventListener('input', updatePriceRange);
    priceMax.addEventListener('input', updatePriceRange);
    updatePriceRange();
  }

  /* ======================================================================
     SORT SELECTS
     ====================================================================== */

  $$('[data-select]').forEach(select => {
    const btn = $('.select-btn', select);
    const menu = $('.select-menu', select);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = !select.classList.contains('is-open');
      $$('[data-select]').forEach(s => s.classList.remove('is-open'));
      select.classList.toggle('is-open', willOpen);
    });

    $$('button', menu).forEach(opt => {
      opt.addEventListener('click', () => {
        $$('button', menu).forEach(o => o.classList.remove('is-active'));
        opt.classList.add('is-active');
        btn.firstChild.textContent = opt.textContent + ' ';
        select.classList.remove('is-open');
      });
    });
  });

  document.addEventListener('click', () => {
    $$('[data-select].is-open').forEach(s => s.classList.remove('is-open'));
  });

  /* ======================================================================
     VIEW TOGGLE — grid / list
     ====================================================================== */

  const catalogGrid = $('#catalogGrid');

  $$('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.view-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      catalogGrid.classList.toggle('is-list', btn.dataset.view === 'list');
    });
  });

  /* ======================================================================
     CATEGORY CHIPS
     ====================================================================== */

  $$('.chip-row .cat-card').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.chip-row .cat-card').forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
    });
  });

  /* ======================================================================
     PAGINATION
     ====================================================================== */

  $$('.pagination .page-num').forEach(num => {
    num.addEventListener('click', () => {
      $$('.pagination .page-num').forEach(n => n.classList.remove('is-active'));
      num.classList.add('is-active');
      $('.catalog-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
