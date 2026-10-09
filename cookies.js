/* Nordic Interface — cookie consent. GA4 loads ONLY after the visitor accepts. */
(function () {
  var GA_ID = 'G-NPGSTCNE0H', KEY = 'ni_consent';
  var da = (document.documentElement.lang || '').toLowerCase().indexOf('da') === 0;
  var T = da ? {
    text: 'Vi bruger statistik-cookies (Google Analytics) til at forstå, hvordan siden bruges. De sættes kun, hvis du accepterer. Læs mere i vores <a href="privatlivspolitik.html">privatlivspolitik</a>.',
    yes: 'Accepter', no: 'Afvis'
  } : {
    text: 'We use statistics cookies (Google Analytics) to understand how the site is used. They are only set if you accept. Read more in our <a href="privatlivspolitik.html">privacy policy</a> (Danish).',
    yes: 'Accept', no: 'Decline'
  };

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.__niGA) return; window.__niGA = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function clearGA() {
    var host = location.hostname, parts = host.split('.');
    var domains = [host, '.' + host, '.' + parts.slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid' || n.indexOf('_gat') === 0) {
        domains.forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
        });
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    });
  }

  function close() { var b = document.getElementById('ni-cc'); if (b) b.remove(); }

  function choose(v) {
    var was = get();
    set(v); close();
    if (v === 'granted') loadGA();
    else { clearGA(); if (was === 'granted') location.reload(); }
  }

  function show() {
    if (document.getElementById('ni-cc')) return;
    if (!document.getElementById('ni-cc-css')) {
      var st = document.createElement('style'); st.id = 'ni-cc-css';
      st.textContent = '#ni-cc{position:fixed;left:20px;bottom:20px;right:20px;max-width:520px;z-index:9500;background:#0c0c10;border:1px solid rgba(255,255,255,.18);padding:24px;font-family:system-ui,-apple-system,sans-serif;color:#b8b8c2;font-size:.82rem;line-height:1.7}#ni-cc p{margin:0 0 18px}#ni-cc a{color:#7fd9ff;text-decoration:underline}#ni-cc .row{display:flex;gap:12px}#ni-cc button{flex:1;font:500 .68rem/1 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:14px 18px;cursor:pointer;background:#fff;color:#050506;border:1px solid #fff}#ni-cc button:hover{background:#7fd9ff;border-color:#7fd9ff}';
      document.head.appendChild(st);
    }
    var b = document.createElement('div');
    b.id = 'ni-cc'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookies');
    b.innerHTML = '<p>' + T.text + '</p><div class="row"><button type="button" data-v="denied">' + T.no + '</button><button type="button" data-v="granted">' + T.yes + '</button></div>';
    b.addEventListener('click', function (e) { var v = e.target.getAttribute && e.target.getAttribute('data-v'); if (v) choose(v); });
    document.body.appendChild(b);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#cookieSettings, .cookie-settings');
    if (t) { e.preventDefault(); show(); }
  });

  var c = get();
  if (c === 'granted') loadGA();
  else if (c !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
  }
})();
