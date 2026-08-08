/* ==========================================================================
   СКЛАД-МАГАЗИН — product page interactions
   Gallery thumbs · diagonal picker · sort-style select · info tabs · buy
   ========================================================================== */

(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ======================================================================
     GALLERY — thumbnail switching + prev/next
     ====================================================================== */

  const thumbStrip = $('#thumbStrip');
  const galleryArt = $('#galleryArt');

  if (thumbStrip && galleryArt) {
    const thumbs = $$('.thumb', thumbStrip);

    function selectThumb(thumb) {
      thumbs.forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      const href = $('use', thumb).getAttribute('href');
      galleryArt.style.opacity = '0';
      setTimeout(() => {
        $('use', galleryArt).setAttribute('href', href);
        galleryArt.style.opacity = '1';
      }, 120);
    }

    thumbs.forEach(thumb => thumb.addEventListener('click', () => selectThumb(thumb)));

    $$('[data-thumb]').forEach(btn => {
      btn.addEventListener('click', () => {
        const active = thumbs.findIndex(t => t.classList.contains('is-active'));
        const dir = btn.dataset.thumb === 'next' ? 1 : -1;
        const next = (active + dir + thumbs.length) % thumbs.length;
        selectThumb(thumbs[next]);
      });
    });
  }

  /* ======================================================================
     DIAGONAL PICKER (segmented control in the info column)
     ====================================================================== */

  $$('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.seg-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  /* ======================================================================
     SELECT DROPDOWN (buy box diagonal select — same pattern as category page)
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
     PRODUCT INFO TABS
     ====================================================================== */

  $$('.ptab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.ptab').forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      $$('.ptab-panel').forEach(panel => {
        panel.hidden = panel.dataset.ptabPanel !== tab.dataset.ptab;
        panel.classList.toggle('is-active', panel.dataset.ptabPanel === tab.dataset.ptab);
      });
    });
  });

  /* ======================================================================
     BUY BOX — buy / favourite actions (toast comes from app.js)
     ====================================================================== */

  const cartCount = $('#cartCount');
  const productTitle = $('.product-title')?.textContent.trim();

  $('.buybox-buy')?.addEventListener('click', () => {
    const cart = (Number(cartCount.textContent) || 0) + 1;
    cartCount.textContent = cart;
    window.toast(`Додано в кошик: ${productTitle}`);
  });

  $$('.buybox-fav, .text-action').forEach(el => {
    el.addEventListener('click', e => {
      if (el.classList.contains('text-action')) e.preventDefault();
      const on = el.classList.toggle('is-on');
      if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', String(on));
      window.toast(on ? 'Додано в обране' : 'Видалено з обраного', 'i-heart');
    });
  });

})();
