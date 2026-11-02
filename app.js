(() => {
  const LANGS = ['en', 'pt'];
  const HTML_LANG = { en: 'en', pt: 'pt-BR' };
  const OG_LOCALE = { en: 'en_US', pt: 'pt_BR' };
  const KEY = 'lang';
  let request = 0;

  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  const el = (tag, attrs = {}, text) => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => { if (v != null) n.setAttribute(k, v); });
    if (text != null) n.textContent = text;
    return n;
  };

  const pickLang = () => {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem(KEY);
      if (LANGS.includes(saved)) return saved;
    } catch (_) {}
    return (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  };

  const render = (c) => {
    document.querySelectorAll('[data-i18n]').forEach((n) => {
      const v = get(c, n.dataset.i18n);
      if (v != null) n.textContent = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((n) => {
      const [attr, path] = n.dataset.i18nAttr.split(':');
      const v = get(c, path);
      if (v != null) n.setAttribute(attr, v);
    });

    const profile = c.profile || {};

    // Foto: placeholder neutro por padrão; <img> só quando profile.photo tiver valor.
    const photo = document.getElementById('photo');
    const showPlaceholder = () => {
      photo.replaceChildren();
      photo.setAttribute('aria-hidden', 'true');
    };
    if (profile.photo) {
      const img = el('img', { src: profile.photo, alt: profile.photoAlt || '', width: 96, height: 96, decoding: 'async' });
      img.addEventListener('error', () => { if (img.parentNode === photo) showPlaceholder(); }, { once: true });
      photo.removeAttribute('aria-hidden');
      photo.replaceChildren(img);
    } else {
      showPlaceholder();
    }

    // Big numbers: itens { "value": "...", "label": "..." }; bloco oculto se o array estiver vazio.
    const bigNumbers = c.bigNumbers || [];
    const bigList = document.getElementById('big-numbers');
    bigList.replaceChildren(...bigNumbers.map((b) => {
      const li = el('li');
      li.append(el('span', { class: 'value' }, b.value), el('span', { class: 'label' }, b.label));
      return li;
    }));
    bigList.hidden = bigNumbers.length === 0;

    const highlights = c.highlights || [];
    const hlList = document.getElementById('highlights');
    hlList.replaceChildren(...highlights.map((h) => el('li', {}, h)));
    hlList.hidden = highlights.length === 0;

    // Itens com needsConfirmation ficam no JSON aguardando confirmação e não são exibidos.
    document.getElementById('experience').replaceChildren(...(c.experience || []).map((e) => {
      const li = el('li');
      li.append(el('h3', {}, e.role), el('p', { class: 'meta' }, `${e.company} · ${e.period}`));
      const bullets = (e.bullets || []).filter((b) => !(b && b.needsConfirmation));
      if (bullets.length) {
        const ul = el('ul');
        bullets.forEach((b) => ul.append(el('li', {}, b.text ?? b)));
        li.append(ul);
      }
      return li;
    }));

    const projects = c.projects || [];
    document.getElementById('projects').replaceChildren(...projects.map((p) => {
      const li = el('li');
      li.append(el('a', { href: p.url, rel: 'noopener' }, p.name));
      if (p.description) li.append(el('p', { class: 'muted' }, p.description));
      return li;
    }));
    document.getElementById('projects-empty').hidden = projects.length > 0;

    document.getElementById('education').replaceChildren(...(c.education || []).map((e) =>
      el('li', {}, `${e.title} — ${e.school} (${e.period})`)));

    document.getElementById('links').replaceChildren(...(c.links || []).map((l) => {
      const li = el('li');
      li.append(el('a', { href: l.url, rel: 'me noopener' }, l.label));
      return li;
    }));
  };

  const setLang = async (lang) => {
    const id = ++request;
    const y = window.scrollY;
    let content;
    try {
      const res = await fetch(`data/content.${lang}.json`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      content = await res.json();
    } catch (_) {
      if (lang !== 'en') return setLang('en');
      return;
    }
    if (id !== request) return; // clique mais recente venceu

    document.documentElement.lang = HTML_LANG[lang];
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    const ogAlt = document.querySelector('meta[property="og:locale:alternate"]');
    if (ogLocale) ogLocale.content = OG_LOCALE[lang];
    if (ogAlt) ogAlt.content = OG_LOCALE[lang === 'en' ? 'pt' : 'en'];

    render(content);
    document.querySelectorAll('[data-lang]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem(KEY, lang); } catch (_) {}
    window.scrollTo(0, y);
  };

  document.querySelectorAll('[data-lang]').forEach((b) =>
    b.addEventListener('click', () => setLang(b.dataset.lang)));

  setLang(pickLang());
})();
