(function(){
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  history.scrollRestoration = 'manual';
  window.scrollTo(0,0);

  var IMG = 'img/';

  var PROJECTS = [
    { idx:'01', title:'MARKETING PRO', cat:'MARKETING LANDING', tag:'REACT / PHP', year:'2025',
      image: IMG + '20260304_1747_01kjxggen4fc4rdjj73xfgr5rv.png',
      client:'AGENCY CLIENT', role:'FULL-STACK DEVELOPER', stack:'REACT · PHP · LARAVEL · TAILWIND',
      desc:['A conversion-focused marketing agency site with service pages, testimonial blocks and a lead-capture flow — built as a responsive React front-end backed by a PHP API for form handling and CMS content.',
            'Component-driven architecture with reusable sections, optimized images and SEO-ready markup. Deployed with a 95+ Lighthouse performance score on mobile.'] },
    { idx:'02', title:'FASHION HUB', cat:'E-COMMERCE WEB APP', tag:'ANGULAR / REST', year:'2025',
      image: IMG + '20260304_1749_01kjxgm87qemzsjsgh4nqp83d8.png',
      client:'RETAIL STARTUP', role:'FRONT-END DEVELOPER', stack:'ANGULAR · TYPESCRIPT · NODE · MONGODB',
      desc:['A full-featured fashion e-commerce platform with product catalog, category filters, cart management and user authentication — structured with Angular modules and lazy-loaded routes.',
            'Integrated with a REST API for inventory and orders. Clean UI with responsive grids, image carousels and a checkout flow that works seamlessly on mobile and desktop.'] },
    { idx:'03', title:'SHIPTRACK', cat:'LOGISTICS DASHBOARD', tag:'REACT / D3', year:'2024',
      image: IMG + '20260305_1853_k06nzfnfktbddbmrmvg4d7f.png',
      client:'LOGISTICS SAAS', role:'WEB DEVELOPER', stack:'REACT · CHART.JS · NODE · EXPRESS',
      desc:['A real-time shipping dashboard with KPI cards, donut charts, world map tracking and a sortable shipments table — designed for operations teams to monitor deliveries at a glance.',
            'Built with React hooks and context for state, Chart.js for data visualization and WebSocket updates for live status changes. Role-based access controls for admin and viewer roles.'] },
    { idx:'04', title:'FOODIE APP', cat:'FOOD ORDER SYSTEM', tag:'REACT / MOBILE', year:'2024',
      image: IMG + '20260309_1907_ff7gt1ewef2cywf3r.png',
      client:'RESTAURANT CHAIN', role:'FULL-STACK + APP DEV', stack:'REACT · REACT NATIVE · PHP · MYSQL',
      desc:['An online food ordering platform with category sidebar, menu grid, live cart and order history — paired with a React Native companion app for on-the-go ordering and push notifications.',
            'PHP backend handles menu management, order processing and payment integration. Shared API layer keeps web and mobile in sync with a single source of truth for menu data.'] },
    { idx:'05', title:'MALL PORTAL', cat:'CORPORATE WEBSITE', tag:'PHP / LARAVEL', year:'2024',
      image: IMG + '20260310_2244_eqb8945k9wqtda46.png',
      client:'SHOPPING CENTER', role:'BACK-END + FRONT-END', stack:'PHP · LARAVEL · BLADE · MYSQL',
      desc:['A corporate portal for a shopping mall with store directory, contact forms, embedded maps and event listings — built on Laravel with Blade templates and a custom admin panel.',
            'Contact form submissions routed through Laravel queues with email notifications. Google Maps integration, responsive hero sections and a content management workflow for non-technical staff.'] },
    { idx:'06', title:'GRITHOUSE', cat:'E-COMMERCE STORE', tag:'WORDPRESS / PHP', year:'2026',
      image: IMG + 'Screenshot_2-9-2026_232116_grithouse.store.jpeg',
      client:'OUTDOOR BRAND', role:'PLUGIN DEVELOPER', stack:'WORDPRESS · PHP · CUSTOM PLUGIN · WOOCOMMERCE',
      desc:['A WordPress e-commerce storefront for an outdoor lifestyle brand — product grids, category navigation, customer reviews and a bold dark theme with high-impact photography.',
            'Developed a custom PHP plugin for extended store functionality — inventory hooks, custom checkout fields and admin tooling integrated natively with WordPress and WooCommerce.'] }
  ];

  function previewSrc(i){ return PROJECTS[i].image; }

  var list = document.getElementById('workList');
  list.innerHTML = PROJECTS.map(function(p,i){
    return '<article class="work-row" role="button" tabindex="0" data-idx="'+i+'" data-cursor="view" data-reveal style="--d:'+(i*0.07).toFixed(2)+'s">'
      + '<span class="row-num">'+p.idx+'</span>'
      + '<h3 class="row-title">'+p.title+'</h3>'
      + '<span class="row-cat">'+p.cat+'</span>'
      + '<span class="row-meta">'+p.year+' · '+p.tag+'</span>'
      + '<span class="row-arrow" aria-hidden="true">↗</span>'
      + '</article>';
  }).join('');

  var scrollingLocked = true;
  function goTo(sel){
    if (sel === 'top') { window.scrollTo({top:0, behavior:'smooth'}); return; }
    var t = document.querySelector(sel);
    if (!t) return;
    t.scrollIntoView({behavior:'smooth', block:'start'});
  }

  var countEl = document.getElementById('loaderCount');
  var barEl = document.getElementById('loaderBar');
  function finishLoad(){
    document.body.classList.add('loaded');
    scrollingLocked = false;
    document.documentElement.style.scrollBehavior = 'smooth';
    setTimeout(function(){ PROJECTS.forEach(function(p){ var im = new Image(); im.src = previewSrc(PROJECTS.indexOf(p)); }); }, 1500);
  }
  if (reduced) { countEl.textContent = '100'; finishLoad(); }
  else {
    var t0 = performance.now(), DUR = 1150;
    (function step(now){
      var p = Math.min(1, (now - t0) / DUR);
      var e = 1 - Math.pow(1 - p, 3);
      countEl.textContent = String(Math.round(e * 100)).padStart(3, '0');
      barEl.style.transform = 'scaleX(' + e + ')';
      if (p < 1) requestAnimationFrame(step);
      else setTimeout(finishLoad, 180);
    })(t0);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], .rule').forEach(function(el){ io.observe(el); });

  var scr = document.getElementById('scramble');
  var phrases = ['WEB DEVELOPER','APP DEVELOPER','FULL-STACK ENGINEER','REACT / ANGULAR / PHP'];
  if (!reduced) {
    var CH = '#/<>_—ABCDEFGHIJKLMNOPQRSTUVWXYZ', pi = 0;
    function run(phrase){
      var frame = 0, total = phrase.length;
      var iv = setInterval(function(){
        frame++;
        var out = '';
        for (var i = 0; i < total; i++) out += (frame > i*2 + 4) ? phrase[i] : CH[(Math.random()*CH.length)|0];
        scr.textContent = out;
        if (frame > total*2 + 6) { clearInterval(iv); setTimeout(next, 2500); }
      }, 34);
    }
    function next(){ pi = (pi + 1) % phrases.length; run(phrases[pi]); }
    setTimeout(next, 2800);
  }

  var clocks = document.querySelectorAll('.js-clock');
  function tickClock(){
    var s;
    try { s = new Intl.DateTimeFormat('en-GB',{timeZone:'America/Bogota',hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date()); }
    catch(e){ s = new Date().toTimeString().slice(0,8); }
    var label = 'BOGOTÁ — ' + s;
    clocks.forEach(function(c){ c.textContent = label; });
  }
  tickClock(); setInterval(tickClock, 1000);

  var toastEl = document.getElementById('toast'), toastT;
  function toast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function(){ toastEl.classList.remove('show'); }, 2300);
  }
  var EMAIL = 'juggerlavz23@gmail.com';
  function copyEmail(){
    function done(){ toast('EMAIL COPIED — ' + EMAIL.toUpperCase()); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, fallback);
    } else fallback();
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = EMAIL; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch(e){ toast('COPY FAILED — ' + EMAIL.toUpperCase()); }
      ta.remove();
    }
  }
  document.querySelectorAll('[data-copy-email]').forEach(function(b){ b.addEventListener('click', copyEmail); });

  var menuOpen = false;
  function setMenu(open){
    menuOpen = open;
    document.body.classList.toggle('menu-open', open);
    document.getElementById('menu').setAttribute('aria-hidden', String(!open));
    scrollingLocked = open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  document.getElementById('burger').addEventListener('click', function(){ setMenu(true); });
  document.getElementById('menuClose').addEventListener('click', function(){ setMenu(false); });
  document.querySelectorAll('[data-scroll]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      var sel = el.getAttribute('data-scroll');
      if (menuOpen) { setMenu(false); setTimeout(function(){ goTo(sel); }, 120); }
      else goTo(sel);
    });
  });

  var ov = document.getElementById('projectOverlay');
  var totalProjects = PROJECTS.length;
  var ovEls = {
    idx:document.getElementById('ovIdx'), title:document.getElementById('ovTitle'),
    client:document.getElementById('ovClient'), year:document.getElementById('ovYear'),
    role:document.getElementById('ovRole'), stack:document.getElementById('ovStack'),
    img:document.getElementById('ovImg'), p1:document.getElementById('ovP1'), p2:document.getElementById('ovP2'),
    next:document.getElementById('ovNextTitle'), inner:document.getElementById('ovInner')
  };
  var cur = 0;
  function fill(i){
    var p = PROJECTS[i];
    ovEls.idx.textContent = 'CASE ' + p.idx + ' / ' + String(totalProjects).padStart(2, '0');
    ovEls.title.textContent = p.title;
    ovEls.client.textContent = p.client;
    ovEls.year.textContent = p.year;
    ovEls.role.textContent = p.role;
    ovEls.stack.textContent = p.stack;
    ovEls.img.style.opacity = 0;
    ovEls.img.src = p.image;
    ovEls.img.alt = p.title + ' — project visual';
    ovEls.img.onload = function(){ ovEls.img.style.opacity = 1; };
    ovEls.p1.textContent = p.desc[0];
    ovEls.p2.textContent = p.desc[1];
    ovEls.next.textContent = PROJECTS[(i + 1) % PROJECTS.length].title;
  }
  function openProject(i){
    cur = i; fill(i);
    ov.classList.add('open'); ov.setAttribute('aria-hidden','false');
    ov.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    preview.classList.remove('show');
  }
  function closeProject(){
    ov.classList.remove('open'); ov.setAttribute('aria-hidden','true');
    if (!menuOpen) document.documentElement.style.overflow = '';
  }
  document.getElementById('ovClose').addEventListener('click', closeProject);
  document.getElementById('ovNext').addEventListener('click', function(){
    var n = (cur + 1) % PROJECTS.length;
    ovEls.inner.classList.add('swapping');
    setTimeout(function(){ fill(n); cur = n; ov.scrollTop = 0; ovEls.inner.classList.remove('swapping'); }, 300);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') {
      if (ov.classList.contains('open')) closeProject();
      else if (menuOpen) setMenu(false);
    }
  });

  var preview = document.getElementById('preview');
  var previewImg = document.getElementById('previewImg');
  var pvTag = document.getElementById('pvTag');
  var rows = Array.prototype.slice.call(document.querySelectorAll('.work-row'));
  rows.forEach(function(row, i){
    row.addEventListener('mouseenter', function(){
      if (!fine) return;
      previewImg.src = previewSrc(i);
      pvTag.textContent = 'FIG. ' + PROJECTS[i].idx + ' — ' + PROJECTS[i].title;
      preview.classList.add('show');
    });
    row.addEventListener('mouseleave', function(){ preview.classList.remove('show'); });
    row.addEventListener('click', function(){ openProject(i); });
    row.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(i); }
    });
  });

  var cursor = document.getElementById('cursor');
  var progress = document.getElementById('progress');
  var heroCopy = document.querySelector('.hero-copy');
  var heroFig = document.getElementById('fig3d');
  var mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
  var pInit = false, ppx = mx, ppy = my;
  document.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    if (!pInit) { ppx = mx; ppy = my; pInit = true; }
    if (fine) cursor.classList.add('on');
  });
  document.addEventListener('mouseover', function(e){
    if (!fine) return;
    var view = e.target.closest && e.target.closest('[data-cursor="view"]');
    var link = e.target.closest && e.target.closest('a, button, .cap, [data-magnet]');
    cursor.classList.toggle('view', !!view);
    cursor.classList.toggle('link', !view && !!link);
  });
  document.addEventListener('mouseleave', function(){ cursor.classList.remove('on'); });
  (function frame(){
    cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22;
    if (fine) cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
    if (fine) {
      ppx += (mx - ppx) * 0.11; ppy += (my - ppy) * 0.11;
      var rot = Math.max(-8, Math.min(8, (mx - ppx) * 0.05));
      preview.style.transform = 'translate3d(' + ppx + 'px,' + ppy + 'px,0) translate(-50%,-58%) rotate(' + rot + 'deg)';
    }
    var max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? (window.scrollY / max) : 0) + ')';
    if (!reduced && window.scrollY < innerHeight * 1.2) {
      heroCopy.style.transform = 'translateY(' + window.scrollY * 0.1 + 'px)';
      heroFig.style.transform = 'translateY(' + window.scrollY * -0.05 + 'px)';
    }
    requestAnimationFrame(frame);
  })();

  if (fine && !reduced) {
    document.querySelectorAll('[data-magnet]').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2) * 0.22;
        var y = (e.clientY - r.top - r.height/2) * 0.32;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  setTimeout(function(){
    if (!window.__glOK) {
      var f = document.getElementById('fig3d');
      if (f) f.classList.add('no-gl');
    }
  }, 4000);
})();
