/* ================================================================
   TEN% · shared page runtime: theme, reveals, toast, Let's Talk.
   ================================================================ */
(() => {
'use strict';

/* ---- Let's Talk booking ----
   Paste the Calendly event URL below (e.g. 'https://calendly.com/thetenpercent/intro').
   Until it is set, every Let's Talk button falls back to a pre-filled email. */
window.TEN_CALENDLY = '';
const MAILTO = 'mailto:contact@thetenpercent.in?subject=' +
  encodeURIComponent("Let's talk") +
  '&body=' + encodeURIComponent('Three sentences about your company:\n\n1.\n2.\n3.\n');

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
  let calendlyLoaded = false;
  function openTalk(e){
    if(!window.TEN_CALENDLY){ return; }            /* href mailto fallback does the work */
    e.preventDefault();
    const pop = () => window.Calendly.initPopupWidget({url: window.TEN_CALENDLY});
    if(calendlyLoaded && window.Calendly){ pop(); return; }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.onload = () => { calendlyLoaded = true; pop(); };
    s.onerror = () => { location.href = MAILTO; };
    document.head.appendChild(s);
  }
  document.querySelectorAll('.js-talk').forEach(a => {
    if(!a.getAttribute('href') || a.getAttribute('href') === '#') a.setAttribute('href', MAILTO);
    a.addEventListener('click', openTalk);
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
