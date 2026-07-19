/* ================================================================
   TEN% · shared page runtime: theme, reveals, toast, Let's Talk.
   ================================================================ */
(() => {
'use strict';

/* ---- Let's Talk booking ----
   Every Let's Talk button routes to the booking page: pick a weekend hour,
   confirm on WhatsApp, the team sends the Meet invite from Zoho mail. */
const BOOK_URL = 'book.html';

/* ---- theme ---- */
const root = document.documentElement;
const THEME_KEY = 'ten-theme';
const ICON_SUN = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function applyTheme(t){
  if(t === 'light') root.setAttribute('data-theme','light');
  else root.removeAttribute('data-theme');
  const btn = document.getElementById('themeBtn');
  if(btn){
    btn.innerHTML = t === 'light' ? ICON_MOON : ICON_SUN;
    btn.setAttribute('aria-label', t === 'light' ? 'switch to dark mode' : 'switch to light mode');
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = t === 'light' ? '#f6f2e8' : '#0a0a0d';
}
let theme = 'dark';
try{ theme = localStorage.getItem(THEME_KEY) || 'dark'; }catch(e){}
applyTheme(theme);
addEventListener('DOMContentLoaded', () => {
  applyTheme(theme); /* re-run once the button exists */
  const btn = document.getElementById('themeBtn');
  if(btn) btn.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
    applyTheme(theme);
  });

  /* ---- scroll reveals ---- */
  const rvIO = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('in'); rvIO.unobserve(e.target); }
  }), {threshold:.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(el => rvIO.observe(el));

  /* ---- Let's Talk buttons ---- */
  document.querySelectorAll('.js-talk').forEach(a => {
    if(!a.getAttribute('href') || a.getAttribute('href') === '#') a.setAttribute('href', BOOK_URL);
  });

  /* magnetic CTAs: the button leans toward the cursor */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches &&
     !matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('.btn-talk, .nav-talk').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width/2)) / r.width;
        const dy = (e.clientY - (r.top + r.height/2)) / r.height;
        b.style.transform = `translate(${(dx*10).toFixed(1)}px,${(dy*6-3).toFixed(1)}px) scale(1.03)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }
});

/* ---- toast (shared feedback pip) ---- */
let toastTk = 0;
window.flashToast = function(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg; t.classList.add('show');
  const tk = ++toastTk;
  setTimeout(() => { if(tk === toastTk) t.classList.remove('show'); }, 2600);
};
})();
