/*!
 * CookieBanner — minimaler Cookie Consent Banner
 * <script id="Cookiebanner" src="cb.js" data-culture="de"></script>
 */
(function (w, d) {
  'use strict';

  var tag     = d.getElementById('Cookiebanner') || d.currentScript;
  var CULTURE = tag ? (tag.getAttribute('data-culture') || navigator.language || 'de') : 'de';
  var COOKIE  = 'CookieConsent';

  var TX = {
    de: { title:'Diese Website verwendet Cookies', body:'Wir nutzen Cookies für essenzielle Funktionen, Analysen und Marketing. Wählen Sie Ihre Präferenzen.',
          necessary:'Notwendig', preferences:'Präferenzen', statistics:'Statistiken', marketing:'Marketing',
          acceptAll:'Alle akzeptieren', acceptSel:'Auswahl akzeptieren', decline:'Ablehnen',
          alwaysOn:'Immer aktiv', details:'Details', hide:'Ausblenden',
          necessaryDesc:'Grundlegende Website-Funktionen.',
          preferencesDesc:'Erinnerung an Einstellungen wie Sprache.',
          statisticsDesc:'Anonyme Nutzungsanalyse.',
          marketingDesc:'Personalisierte Werbung.' },
    en: { title:'This website uses cookies', body:'We use cookies for essential functions, analytics and marketing. Choose your preferences.',
          necessary:'Necessary', preferences:'Preferences', statistics:'Statistics', marketing:'Marketing',
          acceptAll:'Allow all', acceptSel:'Allow selection', decline:'Decline',
          alwaysOn:'Always active', details:'Details', hide:'Hide',
          necessaryDesc:'Core website functionality.',
          preferencesDesc:'Remember settings like language.',
          statisticsDesc:'Anonymous usage analytics.',
          marketingDesc:'Personalised advertising.' }
  };
  function t(k) { var l = CULTURE.split('-')[0]; return (TX[l] || TX.en)[k] || TX.en[k]; }

  // ── Cookie r/w ─────────────────────────────────────────────────────────────
  function save(v) {
    v.stamp = new Date().toISOString();
    d.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(v)) + '; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
  }
  function load() {
    var m = d.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
    try { return m ? JSON.parse(decodeURIComponent(m[1])) : null; } catch(e) { return null; }
  }

  // ── Google Consent Mode v2 ─────────────────────────────────────────────────
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }

  // Defaults DENIED — läuft sofort, vor GTM
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

  // ── Script-Blocking aufheben ───────────────────────────────────────────────
  function unblock(cat) {
    d.querySelectorAll('script[type="text/plain"][data-cookieconsent]').forEach(function(s) {
      if (s.getAttribute('data-cookieconsent').split(',').map(Function.prototype.call, String.prototype.trim).indexOf(cat) < 0) return;
      var n = d.createElement('script');
      [].forEach.call(s.attributes, function(a) { if (a.name !== 'type') n.setAttribute(a.name, a.value); });
      n.text = s.text;
      s.parentNode.replaceChild(n, s);
    });
    d.querySelectorAll('iframe[data-src][data-cookieconsent="' + cat + '"]').forEach(function(f) { f.src = f.dataset.src; });
  }

  function applyAll(c) {
    unblock('necessary');
    if (c.preferences) unblock('preferences');
    if (c.statistics)  unblock('statistics');
    if (c.marketing)   unblock('marketing');
  }

  // ── Events ────────────────────────────────────────────────────────────────
  function fire(name, c) {
    try { w.dispatchEvent(new Event(name, {bubbles:true})); } catch(e) {}
    if (typeof w[name] === 'function') w[name]();
    w.dataLayer.push({ event: name, cookieConsent: c });
  }

  // ── Öffentliche API ───────────────────────────────────────────────────────
  var CB = {
    hasResponse: false,
    consent: { necessary:true, preferences:false, statistics:false, marketing:false, stamp:'' },
    show:     function() { showBanner(); },
    renew:    function() { d.cookie = COOKIE+'=; max-age=0; path=/'; CB.hasResponse=false; showBanner(); },
    withdraw: function() { d.cookie = COOKIE+'=; max-age=0; path=/'; CB.hasResponse=false; hideBanner(); }
  };
  w.Cookiebanner = CB;

  // ── Commit ────────────────────────────────────────────────────────────────
  function commit(c) {
    c.necessary    = true;
    CB.consent     = c;
    CB.hasResponse = true;
    save(c);
    updateConsent(c);
    applyAll(c);
    hideBanner();
    fire('CookiebannerOnAccept', c);
    fire('CookiebannerOnConsentReady', c);
  }

  // ── Banner CSS ────────────────────────────────────────────────────────────
  var CSS = '#cb{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:3px solid #1e6ef5;box-shadow:0 -4px 20px rgba(0,0,0,.12);z-index:2147483646;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:none}'
    + '#cb.on{display:block}'
    + '#cb *{box-sizing:border-box}'
    + '#cb-inner{max-width:960px;margin:0 auto;padding:18px 20px}'
    + '#cb-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}'
    + '#cb-text h3{margin:0 0 6px;font-size:15px;font-weight:600;color:#111}'
    + '#cb-text p{margin:0;font-size:13px;color:#555;line-height:1.5}'
    + '#cb-btns{display:flex;gap:8px;flex-shrink:0;align-items:center;flex-wrap:wrap}'
    + '.cb-b{padding:9px 16px;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;border:none;white-space:nowrap}'
    + '.cb-b:hover{filter:brightness(.93)}'
    + '#cb-b-dec{background:#f3f4f6;color:#374151;border:1px solid #d1d5db}'
    + '#cb-b-sel{background:#6b7280;color:#fff}'
    + '#cb-b-all{background:#1e6ef5;color:#fff}'
    + '#cb-b-det{background:none;border:none;font-size:12px;color:#1e6ef5;cursor:pointer;text-decoration:underline;padding:0}'
    + '#cb-detail{display:none;margin-top:14px;border-top:1px solid #e5e7eb;padding-top:14px}'
    + '#cb-detail.on{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px}'
    + '.cb-cat{border:1px solid #e5e7eb;border-radius:7px;padding:10px 12px}'
    + '.cb-cat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}'
    + '.cb-cat-name{font-size:13px;font-weight:600;color:#111}'
    + '.cb-cat-desc{font-size:12px;color:#6b7280;line-height:1.4}'
    + '.cb-always{font-size:11px;font-weight:500;color:#059669}'
    + '.sw{position:relative;display:inline-block;width:36px;height:20px;flex-shrink:0}'
    + '.sw input{opacity:0;width:0;height:0}'
    + '.tr{position:absolute;inset:0;background:#d1d5db;border-radius:20px;cursor:pointer;transition:.2s}'
    + '.tr:before{content:"";position:absolute;width:14px;height:14px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}'
    + 'input:checked+.tr{background:#1e6ef5}'
    + 'input:checked+.tr:before{transform:translateX(16px)}'
    + 'input:disabled+.tr{opacity:.5;cursor:not-allowed}'
    + '@media(max-width:600px){#cb-btns{width:100%}.cb-b{flex:1;text-align:center}#cb-detail.on{grid-template-columns:1fr 1fr}}';

  // ── Banner HTML ───────────────────────────────────────────────────────────
  function buildBanner() {
    if (d.getElementById('cb')) return;
    var s = d.createElement('style'); s.textContent = CSS; d.head.appendChild(s);
    var wrap = d.createElement('div'); wrap.id = 'cb';
    wrap.innerHTML =
      '<div id="cb-inner">'
      + '<div id="cb-top">'
      +   '<div id="cb-text"><h3>'+t('title')+'</h3><p>'+t('body')+'</p></div>'
      +   '<div id="cb-btns">'
      +     '<button class="cb-b" id="cb-b-dec">'+t('decline')+'</button>'
      +     '<button class="cb-b" id="cb-b-sel">'+t('acceptSel')+'</button>'
      +     '<button class="cb-b" id="cb-b-all">'+t('acceptAll')+'</button>'
      +     '<button id="cb-b-det">'+t('details')+'</button>'
      +   '</div>'
      + '</div>'
      + '<div id="cb-detail">'
      + renderCat('necessary',   true)
      + renderCat('preferences', false)
      + renderCat('statistics',  false)
      + renderCat('marketing',   false)
      + '</div>'
      + '</div>';
    d.body.appendChild(wrap);

    d.getElementById('cb-b-all').onclick = function() { commit({preferences:true,statistics:true,marketing:true}); };
    d.getElementById('cb-b-sel').onclick = function() {
      commit({
        preferences: d.getElementById('cb-pref').checked,
        statistics:  d.getElementById('cb-stat').checked,
        marketing:   d.getElementById('cb-mkt').checked
      });
    };
    d.getElementById('cb-b-dec').onclick = function() { commit({preferences:false,statistics:false,marketing:false}); };
    d.getElementById('cb-b-det').onclick = function() {
      var det = d.getElementById('cb-detail');
      var on  = det.classList.toggle('on');
      this.textContent = on ? t('hide') : t('details');
    };
  }

  function renderCat(id, always) {
    var ids = {necessary:'',preferences:'cb-pref',statistics:'cb-stat',marketing:'cb-mkt'};
    return '<div class="cb-cat">'
      + '<div class="cb-cat-top"><span class="cb-cat-name">'+t(id)+'</span>'
      + (always
          ? '<span class="cb-always">'+t('alwaysOn')+'</span>'
          : '<label class="sw"><input type="checkbox" id="'+ids[id]+'"><span class="tr"></span></label>')
      + '</div>'
      + '<div class="cb-cat-desc">'+t(id+'Desc')+'</div>'
      + '</div>';
  }

  function showBanner() { buildBanner(); d.getElementById('cb').classList.add('on'); }
  function hideBanner() { var b=d.getElementById('cb'); if(b) b.classList.remove('on'); }

  // ── Init ──────────────────────────────────────────────────────────────────
  var saved = load();
  if (saved && saved.stamp) {
    CB.consent = Object.assign(CB.consent, saved);
    CB.hasResponse = true;
    updateConsent(CB.consent);
    if (d.readyState === 'loading') {
      d.addEventListener('DOMContentLoaded', function() { applyAll(CB.consent); });
    } else {
      applyAll(CB.consent);
    }
    fire('CookiebannerOnConsentReady', CB.consent);
  } else {
    if (d.readyState === 'loading') {
      d.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

}(window, document));
