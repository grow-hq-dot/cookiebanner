/*!
 * CookieBanner v2.0 — Modal Popup mit Tab-Navigation
 * <script id="Cookiebanner" src="cb.js" data-culture="de"></script>
 * Muss VOR GTM in <head> stehen.
 */
(function (w, d) {
  'use strict';

  var tag     = d.getElementById('Cookiebanner') || d.currentScript;
  var CULTURE = tag ? (tag.getAttribute('data-culture') || navigator.language || 'de') : 'de';
  var COOKIE  = 'CookieConsent';

  // ── Texte ──────────────────────────────────────────────────────────────────
  var TX = {
    de: {
      tab1: 'Zustimmung', tab2: 'Details', tab3: 'Über Cookies',
      title: 'Diese Webseite verwendet Cookies',
      body: 'Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien anbieten zu können und die Zugriffe auf unsere Website zu analysieren. Außerdem geben wir Informationen zu Ihrer Verwendung unserer Website an unsere Partner für soziale Medien, Werbung und Analysen weiter. Unsere Partner führen diese Informationen möglicherweise mit weiteren Daten zusammen, die Sie ihnen bereitgestellt haben oder die sie im Rahmen Ihrer Nutzung der Dienste gesammelt haben.',
      aboutTitle: 'Was sind Cookies?',
      aboutBody: 'Cookies sind kleine Textdateien, die von Websites auf Ihrem Gerät gespeichert werden. Sie helfen dabei, Sie bei einem erneuten Besuch wiederzuerkennen, Ihre Einstellungen zu speichern und die Website für Sie zu personalisieren. Einige Cookies sind notwendig damit die Website funktioniert, andere dienen zur Analyse oder zu Marketingzwecken.',
      customize: 'Anpassen',
      acceptAll: 'Alle zulassen',
      acceptSel: 'Auswahl akzeptieren',
      decline:   'Ablehnen',
      alwaysOn:  'Immer aktiv',
      necessary: 'Notwendig',
      necessaryDesc: 'Notwendige Cookies helfen dabei, eine Webseite nutzbar zu machen, indem sie Grundfunktionen wie Seitennavigation und Zugriff auf sichere Bereiche der Webseite ermöglichen. Die Webseite kann ohne diese Cookies nicht richtig funktionieren.',
      preferences: 'Präferenzen',
      preferencesDesc: 'Präferenz-Cookies ermöglichen einer Webseite, sich an Informationen zu erinnern, die die Art beeinflussen, wie sich eine Webseite verhält oder aussieht, wie z. B. Ihre bevorzugte Sprache oder die Region, in der Sie sich befinden.',
      statistics: 'Statistiken',
      statisticsDesc: 'Statistik-Cookies helfen Webseiten-Besitzern zu verstehen, wie Besucher mit Webseiten interagieren, indem Informationen anonym gesammelt und gemeldet werden.',
      marketing: 'Marketing',
      marketingDesc: 'Marketing-Cookies werden verwendet, um Besucher auf Webseiten zu verfolgen. Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen Benutzer und daher wertvoller für Publisher und werbetreibende Drittparteien sind.',
      poweredBy: 'Cookie-Einwilligung verwaltet mit'
    },
    en: {
      tab1: 'Consent', tab2: 'Details', tab3: 'About cookies',
      title: 'This website uses cookies',
      body: 'We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you\'ve provided to them or that they\'ve collected from your use of their services.',
      aboutTitle: 'What are cookies?',
      aboutBody: 'Cookies are small text files that are placed on your device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.',
      customize: 'Customize',
      acceptAll: 'Allow all',
      acceptSel: 'Allow selection',
      decline:   'Decline',
      alwaysOn:  'Always active',
      necessary: 'Necessary',
      necessaryDesc: 'Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.',
      preferences: 'Preferences',
      preferencesDesc: 'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.',
      statistics: 'Statistics',
      statisticsDesc: 'Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.',
      marketing: 'Marketing',
      marketingDesc: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.',
      poweredBy: 'Consent managed with'
    }
  };
  function t(k) { var l = CULTURE.split('-')[0]; return (TX[l] || TX.en)[k] || TX.en[k]; }

  // ── Cookie r/w ─────────────────────────────────────────────────────────────
  function save(v) {
    v.stamp = new Date().toISOString();
    d.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(v)) + '; max-age=' + (365 * 86400) + '; path=/; SameSite=Lax';
  }
  function load() {
    var m = d.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
    try { return m ? JSON.parse(decodeURIComponent(m[1])) : null; } catch (e) { return null; }
  }

  // ── Google Consent Mode v2 ─────────────────────────────────────────────────
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'denied',
    personalization_storage: 'denied', security_storage: 'granted',
    wait_for_update: 500
  });

  function updateConsent(c) {
    gtag('consent', 'update', {
      ad_storage:              c.marketing   ? 'granted' : 'denied',
      ad_user_data:            c.marketing   ? 'granted' : 'denied',
      ad_personalization:      c.marketing   ? 'granted' : 'denied',
      analytics_storage:       c.statistics  ? 'granted' : 'denied',
      functionality_storage:   c.preferences ? 'granted' : 'denied',
      personalization_storage: c.preferences ? 'granted' : 'denied',
      security_storage:        'granted'
    });
  }

  // ── Script-Unblocking ──────────────────────────────────────────────────────
  function unblock(cat) {
    d.querySelectorAll('script[type="text/plain"][data-cookieconsent]').forEach(function (s) {
      if (s.getAttribute('data-cookieconsent').split(',').map(Function.prototype.call, String.prototype.trim).indexOf(cat) < 0) return;
      var n = d.createElement('script');
      [].forEach.call(s.attributes, function (a) { if (a.name !== 'type') n.setAttribute(a.name, a.value); });
      n.text = s.text;
      s.parentNode.replaceChild(n, s);
    });
    d.querySelectorAll('iframe[data-src][data-cookieconsent="' + cat + '"]').forEach(function (f) { f.src = f.dataset.src; });
  }
  function applyAll(c) {
    unblock('necessary');
    if (c.preferences) unblock('preferences');
    if (c.statistics)  unblock('statistics');
    if (c.marketing)   unblock('marketing');
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  function fire(name, c) {
    try { w.dispatchEvent(new Event(name, { bubbles: true })); } catch (e) {}
    if (typeof w[name] === 'function') w[name]();
    w.dataLayer.push({ event: name, cookieConsent: c });
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  var CB = {
    hasResponse: false,
    consent: { necessary: true, preferences: false, statistics: false, marketing: false, stamp: '' },
    show:     function () { showModal(); },
    renew:    function () { d.cookie = COOKIE + '=; max-age=0; path=/'; CB.hasResponse = false; showModal(); },
    withdraw: function () { d.cookie = COOKIE + '=; max-age=0; path=/'; CB.hasResponse = false; hideModal(); }
  };
  w.Cookiebanner = CB;

  // ── Commit ─────────────────────────────────────────────────────────────────
  function commit(c) {
    c.necessary    = true;
    CB.consent     = c;
    CB.hasResponse = true;
    save(c);
    updateConsent(c);
    applyAll(c);
    hideModal();
    fire('CookiebannerOnAccept', c);
    fire('CookiebannerOnConsentReady', c);
  }

  // ── CSS ────────────────────────────────────────────────────────────────────
  var CSS = [
    /* Reset */
    '#cb-wrap,#cb-wrap *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.5}',

    /* Overlay */
    '#cb-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483644;display:none;align-items:center;justify-content:center;padding:16px}',
    '#cb-overlay.on{display:flex}',

    /* Modal */
    '#cb-modal{background:#fff;border-radius:4px;width:100%;max-width:640px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.25);overflow:hidden}',

    /* Branding bar */
    '#cb-brand{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-bottom:1px solid #e5e7eb}',
    '#cb-brand-name{font-size:12px;color:#9ca3af;display:flex;align-items:center;gap:6px}',
    '#cb-brand-name svg{opacity:.5}',

    /* Tabs */
    '#cb-tabs{display:flex;border-bottom:1px solid #e5e7eb;background:#fff;flex-shrink:0}',
    '.cb-tab{flex:1;padding:14px 8px;background:none;border:none;border-bottom:3px solid transparent;font-size:14px;font-weight:500;color:#6b7280;cursor:pointer;transition:color .15s,border-color .15s;white-space:nowrap}',
    '.cb-tab:hover{color:#111}',
    '.cb-tab.on{color:#1d4ed8;border-bottom-color:#1d4ed8}',

    /* Tab panes */
    '#cb-panes{overflow-y:auto;flex:1}',
    '.cb-pane{display:none;padding:20px}',
    '.cb-pane.on{display:block}',

    /* Consent tab */
    '#cb-consent-title{font-size:18px;font-weight:700;color:#111;margin:0 0 12px}',
    '#cb-consent-body{font-size:13px;color:#555;line-height:1.65}',

    /* Details tab — category cards */
    '.cb-card{border:1px solid #e5e7eb;border-radius:4px;margin-bottom:8px;overflow:hidden}',
    '.cb-card-hd{display:flex;align-items:center;gap:10px;padding:12px 14px;cursor:pointer;user-select:none}',
    '.cb-card-hd:hover{background:#f9fafb}',
    '.cb-chevron{width:16px;height:16px;flex-shrink:0;transition:transform .2s;color:#9ca3af}',
    '.cb-card.open .cb-chevron{transform:rotate(180deg)}',
    '.cb-card-title{flex:1;font-size:14px;font-weight:600;color:#111}',
    '.cb-always{font-size:12px;font-weight:500;color:#059669;white-space:nowrap}',
    '.cb-card-body{display:none;padding:0 14px 12px;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:10px}',
    '.cb-card.open .cb-card-body{display:block}',

    /* Toggle switch */
    '.sw{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0}',
    '.sw input{opacity:0;width:0;height:0;position:absolute}',
    '.sw-tr{position:absolute;inset:0;background:#d1d5db;border-radius:24px;cursor:pointer;transition:.2s}',
    '.sw-tr:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}',
    'input:checked+.sw-tr{background:#1d4ed8}',
    'input:checked+.sw-tr:before{transform:translateX(20px)}',
    'input:disabled+.sw-tr{opacity:.6;cursor:not-allowed}',
    'input:disabled:checked+.sw-tr{background:#1d4ed8}',

    /* About tab */
    '#cb-about-title{font-size:16px;font-weight:700;color:#111;margin:0 0 10px}',
    '#cb-about-body{font-size:13px;color:#555;line-height:1.65}',

    /* Footer / buttons */
    '#cb-footer{padding:14px 20px;border-top:1px solid #e5e7eb;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;flex-shrink:0;background:#fff}',
    '.cb-btn{padding:10px 20px;border-radius:4px;font-size:14px;font-weight:500;cursor:pointer;border:none;white-space:nowrap;transition:filter .15s}',
    '.cb-btn:hover{filter:brightness(.93)}',
    '#cb-btn-dec{background:#fff;color:#374151;border:2px solid #d1d5db;display:none}',
    '#cb-btn-dec.on{display:inline-block}',
    '#cb-btn-sel{background:#fff;color:#374151;border:2px solid #d1d5db;display:none}',
    '#cb-btn-sel.on{display:inline-block}',
    '#cb-btn-cust{background:#fff;color:#374151;border:2px solid #d1d5db}',
    '#cb-btn-all{background:#1d4ed8;color:#fff;border:2px solid #1d4ed8}',

    /* Powered by */
    '#cb-powered{font-size:11px;color:#9ca3af;text-align:center;padding:6px 0 2px}',

    /* Mobile */
    '@media(max-width:520px){',
    '.cb-tab{font-size:13px;padding:12px 4px}',
    '#cb-footer{justify-content:stretch}',
    '.cb-btn{flex:1;text-align:center}',
    '}'
  ].join('');

  // ── Chevron SVG ────────────────────────────────────────────────────────────
  var CHEVRON = '<svg class="cb-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';

  // ── Build DOM ──────────────────────────────────────────────────────────────
  function buildModal() {
    if (d.getElementById('cb-wrap')) return;

    var style = d.createElement('style');
    style.textContent = CSS;
    d.head.appendChild(style);

    var wrap = d.createElement('div');
    wrap.id = 'cb-wrap';
    wrap.innerHTML =
      '<div id="cb-overlay">' +
        '<div id="cb-modal" role="dialog" aria-modal="true" aria-labelledby="cb-consent-title">' +

          /* Branding */
          '<div id="cb-brand">' +
            '<span id="cb-brand-name">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' +
              t('poweredBy') + ' CookieBanner' +
            '</span>' +
          '</div>' +

          /* Tabs */
          '<div id="cb-tabs">' +
            '<button class="cb-tab on" data-tab="consent">'  + t('tab1') + '</button>' +
            '<button class="cb-tab" data-tab="details">'     + t('tab2') + '</button>' +
            '<button class="cb-tab" data-tab="about">'       + t('tab3') + '</button>' +
          '</div>' +

          /* Panes */
          '<div id="cb-panes">' +

            /* Tab 1 — Zustimmung */
            '<div class="cb-pane on" id="cb-pane-consent">' +
              '<h2 id="cb-consent-title">' + t('title') + '</h2>' +
              '<p id="cb-consent-body">' + t('body') + '</p>' +
            '</div>' +

            /* Tab 2 — Details */
            '<div class="cb-pane" id="cb-pane-details">' +
              card('necessary',   true)  +
              card('preferences', false) +
              card('statistics',  false) +
              card('marketing',   false) +
            '</div>' +

            /* Tab 3 — Über Cookies */
            '<div class="cb-pane" id="cb-pane-about">' +
              '<h3 id="cb-about-title">' + t('aboutTitle') + '</h3>' +
              '<p id="cb-about-body">'   + t('aboutBody')  + '</p>' +
            '</div>' +

          '</div>' + /* /panes */

          /* Footer */
          '<div id="cb-footer">' +
            '<button class="cb-btn" id="cb-btn-dec">'  + t('decline')   + '</button>' +
            '<button class="cb-btn" id="cb-btn-sel">'  + t('acceptSel') + '</button>' +
            '<button class="cb-btn" id="cb-btn-cust">' + t('customize') + '</button>' +
            '<button class="cb-btn" id="cb-btn-all">'  + t('acceptAll') + '</button>' +
          '</div>' +

          '<div id="cb-powered">' + t('poweredBy') + ' CookieBanner</div>' +

        '</div>' +
      '</div>';

    d.body.appendChild(wrap);
    bindEvents();
  }

  function card(id, always) {
    var inputId = 'cb-chk-' + id;
    return '<div class="cb-card">' +
      '<div class="cb-card-hd">' +
        CHEVRON +
        '<span class="cb-card-title">' + t(id) + '</span>' +
        (always
          ? '<span class="cb-always">' + t('alwaysOn') + '</span>'
          : '<label class="sw" onclick="event.stopPropagation()">' +
              '<input type="checkbox" id="' + inputId + '">' +
              '<span class="sw-tr"></span>' +
            '</label>'
        ) +
      '</div>' +
      '<div class="cb-card-body">' + t(id + 'Desc') + '</div>' +
    '</div>';
  }

  // ── Bind events ────────────────────────────────────────────────────────────
  function bindEvents() {

    /* Tab switching */
    d.querySelectorAll('.cb-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        d.querySelectorAll('.cb-tab').forEach(function (b) { b.classList.remove('on'); });
        d.querySelectorAll('.cb-pane').forEach(function (p) { p.classList.remove('on'); });
        btn.classList.add('on');
        d.getElementById('cb-pane-' + btn.dataset.tab).classList.add('on');
      });
    });

    /* Card expand/collapse */
    d.querySelectorAll('.cb-card-hd').forEach(function (hd) {
      hd.addEventListener('click', function () {
        hd.closest('.cb-card').classList.toggle('open');
      });
    });

    /* "Anpassen" → switch to details tab + show Ablehnen / Auswahl akzeptieren */
    d.getElementById('cb-btn-cust').addEventListener('click', function () {
      switchTab('details');
      d.getElementById('cb-btn-dec').classList.add('on');
      d.getElementById('cb-btn-sel').classList.add('on');
      d.getElementById('cb-btn-cust').style.display = 'none';
    });

    /* Alle zulassen */
    d.getElementById('cb-btn-all').addEventListener('click', function () {
      commit({ preferences: true, statistics: true, marketing: true });
    });

    /* Auswahl akzeptieren */
    d.getElementById('cb-btn-sel').addEventListener('click', function () {
      commit({
        preferences: d.getElementById('cb-chk-preferences').checked,
        statistics:  d.getElementById('cb-chk-statistics').checked,
        marketing:   d.getElementById('cb-chk-marketing').checked
      });
    });

    /* Ablehnen */
    d.getElementById('cb-btn-dec').addEventListener('click', function () {
      commit({ preferences: false, statistics: false, marketing: false });
    });
  }

  function switchTab(name) {
    d.querySelectorAll('.cb-tab').forEach(function (b) { b.classList.remove('on'); });
    d.querySelectorAll('.cb-pane').forEach(function (p) { p.classList.remove('on'); });
    d.querySelector('.cb-tab[data-tab="' + name + '"]').classList.add('on');
    d.getElementById('cb-pane-' + name).classList.add('on');
  }

  // ── Show / hide ────────────────────────────────────────────────────────────
  function showModal() {
    buildModal();
    d.getElementById('cb-overlay').classList.add('on');
    d.body.style.overflow = 'hidden';
  }
  function hideModal() {
    var ov = d.getElementById('cb-overlay');
    if (ov) ov.classList.remove('on');
    d.body.style.overflow = '';
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  var saved = load();
  if (saved && saved.stamp) {
    CB.consent = Object.assign(CB.consent, saved);
    CB.hasResponse = true;
    updateConsent(CB.consent);
    if (d.readyState === 'loading') {
      d.addEventListener('DOMContentLoaded', function () { applyAll(CB.consent); });
    } else {
      applyAll(CB.consent);
    }
    fire('CookiebannerOnConsentReady', CB.consent);
  } else {
    if (d.readyState === 'loading') {
      d.addEventListener('DOMContentLoaded', showModal);
    } else {
      showModal();
    }
  }

}(window, document));
