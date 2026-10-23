const categories = [
  { name: 'Cocktails', subtitle: 'SIGNATUR-MIXOLOGY', icon: 'cocktail', artwork: 'cocktails' },
  { name: 'Mocktails', subtitle: 'ZERO-PROOF. VOLLER CHARAKTER.', icon: 'mocktail', artwork: 'mocktails' },
  { name: 'Shisha', subtitle: 'DAS RITUAL', icon: 'shisha', artwork: 'shisha' },
  { name: 'Softdrinks', subtitle: 'ERLESENE ERFRISCHUNG', icon: 'softdrink', artwork: 'softdrinks' },
  { name: 'Energy Drinks', subtitle: 'PULSIERENDE NÄCHTE', icon: 'energy', artwork: 'energy' },
  { name: 'Eistee & Limonade', subtitle: 'HAUSGEMACHTE FRISCHE', icon: 'iced-tea', artwork: 'iced-tea' },
  { name: 'Säfte', subtitle: 'FRUCHTIGE MOMENTE', icon: 'juice', artwork: 'juice' },
  { name: 'Longdrink', subtitle: 'KLASSISCHE ELEGANZ', icon: 'longdrink', artwork: 'longdrinks' },
  { name: 'Spirituosen & Flaschen', subtitle: 'BESONDERE AUGENBLICKE', icon: 'spirits', artwork: 'spirits' },
  { name: 'Bier & Wein', subtitle: 'HOPFEN & REBE', icon: 'wine', artwork: 'beer-wine' }
];

const selections = [
  ['Espresso Martini', 'Mojito', 'Passionfruit Martini'],
  ['Virgin Mojito', 'Berry Breeze', 'Tropical Sunset'],
  ['Doppelapfel', 'Traube Minze', 'Frucht-Mix'],
  ['Cola', 'Tonic Water', 'Mineralwasser'],
  ['Classic Energy', 'Sugarfree Energy'],
  ['Pfirsich Eistee', 'Zitronenlimonade', 'Beeren Eistee'],
  ['Orangensaft', 'Ananassaft', 'Apfelsaft'],
  ['Gin & Tonic', 'Cuba Libre', 'Vodka Lemon'],
  ['Whisky', 'Rum', 'Gin'],
  ['Pils', 'Weißwein', 'Rotwein']
];

const descriptions = [
  ['Kaffee trifft auf die Eleganz der Nacht.', 'Frische Minze und Limette. Ein zeitloser Klassiker.', 'Tropische Frucht mit einem eleganten Finish.'],
  ['Minze, Limette und eine spritzige Note.', 'Fruchtige Beeren. Erfrischend anders.', 'Ein Hauch Tropen für deinen Abend.'],
  ['Ein klassisches Aromaprofil für dein Ritual.', 'Fruchtige Traube mit kühler Minznote.', 'Fruchtige Nuancen, entspannt genießen.']
];
const photos = ['cocktail-monograph.jpg', 'cocktail-macro.jpg', 'hero.jpg'];
const artwork = category => `assets/illustrations/${category.artwork}.svg`;
const items = selections.flatMap((names, categoryIndex) => names.map((name, index) => {
  const category = categories[categoryIndex];
  const hasPhoto = categoryIndex === 0 || categoryIndex === 2;
  return {
    id: `${categoryIndex}-${index}`,
    name,
    category: categoryIndex,
    description: descriptions[categoryIndex]?.[index] || 'Ein ausgewählter Begleiter für deinen Abend. Beispiel für die spätere Menükarte.',
    image: categoryIndex === 2 ? 'assets/shisha-monograph.jpg' : categoryIndex === 0 ? `assets/${photos[index]}` : artwork(category),
    imageAlt: `${category.name} · ${hasPhoto ? 'illustrative Aufnahme' : 'Illustration'}`,
    tag: categoryIndex === 2 ? 'DAS RITUAL' : categoryIndex === 1 ? 'ALKOHOLFREI' : index === 0 ? 'THE CLASSICS' : 'ENTDECKEN'
  };
}));

const $ = selector => document.querySelector(selector);
const cards = $('#cards');
let current = 0;
let savedOnly = false;
let selected = null;
let saved = new Set();
try {
  saved = new Set(JSON.parse(localStorage.getItem('oud-favorites') || '[]'));
} catch {}

function icon(name, extraClass = '') {
  return `<svg class="icon ${extraClass}" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
}

function recoverImage(image) {
  if (!(image instanceof HTMLImageElement)) return;
  const fallback = image.dataset.fallback;
  if (fallback && image.src !== new URL(fallback, document.baseURI).href) {
    image.src = fallback;
    image.alt = image.dataset.fallbackAlt || image.alt;
  } else {
    // Keep the category icon visible when neither image can be loaded.
    image.hidden = true;
  }
}

document.addEventListener('error', event => recoverImage(event.target), true);
for (const image of document.images) {
  if (image.getAttribute('src') && image.complete && !image.naturalWidth) recoverImage(image);
}

function render() {
  $('#categories').innerHTML = categories.map((category, index) => `
    <button class="category ${index === current && !savedOnly ? 'active' : ''}"
      data-category="${index}" aria-pressed="${index === current && !savedOnly}">
      ${icon(category.icon)}
      <span class="category-label">${category.name}</span>
      ${icon('arrow-up-right', 'arrow')}
    </button>
  `).join('');

  const query = $('#search').value.trim().toLocaleLowerCase('de');
  const list = items.filter(item =>
    (savedOnly ? saved.has(item.id) : query || item.category === current) &&
    (!query || `${item.name} ${categories[item.category].name} ${item.description}`.toLocaleLowerCase('de').includes(query))
  );
  $('#category-title').textContent = savedOnly ? 'Deine Favoriten' : query ? 'Deine Suchergebnisse' : categories[current].name;
  $('#category-subtitle').textContent = savedOnly ? 'FÜR DEINEN ABEND GEMERKT' : query ? 'FINDE DEINEN GESCHMACK' : categories[current].subtitle;
  $('#count').textContent = `${String(list.length).padStart(2, '0')} ENTDECKUNGEN`;
  $('#saved').setAttribute('aria-pressed', String(savedOnly));
  $('#saved').classList.toggle('is-active', savedOnly);

  cards.innerHTML = list.length ? list.map(item => {
    const category = categories[item.category];
    const isSaved = saved.has(item.id);
    return `
      <article class="card">
        <button class="heart ${isSaved ? 'selected' : ''}" data-save="${item.id}"
          aria-label="${item.name} ${isSaved ? 'aus Favoriten entfernen' : 'merken'}" aria-pressed="${isSaved}">
          ${icon('heart', isSaved ? 'is-filled' : '')}
        </button>
        <button class="card-open" data-item="${item.id}" aria-label="${item.name} ansehen">
          <div class="card-media">
            <div class="image-fallback" aria-hidden="true">${icon(category.icon)}<span>${category.name}</span></div>
            <img src="${item.image}" alt="${item.imageAlt}" loading="lazy"
              data-fallback="${artwork(category)}" data-fallback-alt="${category.name} · Illustration">
            <span class="card-tag">${item.tag}</span>
          </div>
          <div class="card-body">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="card-bottom"><span>BEISPIELAUSWAHL</span>${icon('arrow-up-right')}</div>
          </div>
        </button>
      </article>
    `;
  }).join('') : `
    <div class="empty">
      ${icon(savedOnly ? 'heart' : 'search')}
      <p>${savedOnly ? 'Noch keine Favoriten. Tippe auf ein Herz in der Karte.' : 'Keine passenden Einträge. Probiere einen anderen Suchbegriff.'}</p>
    </div>
  `;
}

function updateSaveButton() {
  const isSaved = saved.has(selected.id);
  $('#save-item').innerHTML = `${icon('heart', isSaved ? 'is-filled' : '')} ${isSaved ? 'Gemerkt · Entfernen' : 'Favorit merken'}`;
  $('#save-item').setAttribute('aria-pressed', String(isSaved));
}

function toggle(id) {
  saved.has(id) ? saved.delete(id) : saved.add(id);
  try {
    localStorage.setItem('oud-favorites', JSON.stringify([...saved]));
  } catch {}
  render();
  if (selected) updateSaveButton();
}

$('#categories').onclick = event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  current = Number(button.dataset.category);
  savedOnly = false;
  $('#search').value = '';
  render();
};
$('#search').oninput = render;

cards.onclick = event => {
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) {
    toggle(saveButton.dataset.save);
    return;
  }
  const button = event.target.closest('[data-item]');
  if (!button) return;
  selected = items.find(item => item.id === button.dataset.item);
  const category = categories[selected.category];
  $('#detail-title').textContent = selected.name;
  $('#detail-description').textContent = selected.description;
  const image = $('#detail-image');
  image.hidden = false;
  image.dataset.fallback = artwork(category);
  image.dataset.fallbackAlt = `${category.name} · Illustration`;
  image.alt = selected.imageAlt;
  image.src = selected.image;
  $('#detail-fallback').innerHTML = `${icon(category.icon)}<span>${category.name}</span>`;
  updateSaveButton();
  $('#item-dialog').showModal();
};
$('#save-item').onclick = () => toggle(selected.id);
$('#saved').onclick = () => {
  savedOnly = !savedOnly;
  $('#search').value = '';
  render();
  $('#menu').scrollIntoView({ behavior: 'smooth' });
};

for (const button of document.querySelectorAll('.wifi-open')) {
  button.onclick = () => {
    renderWifi();
    $('#wifi-dialog').showModal();
  };
}
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.close').onclick = () => dialog.close();
  dialog.onclick = event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  };
}

let wifiStep = 0;
const stages = [
  {
    icon: 'instagram',
    title: 'Folge der Nacht.',
    intro: 'Entdecke @ou_d_bar auf Instagram. Für diese Präsentation kannst du den Follow direkt hier simulieren.',
    body: `<a class="text-button real-instagram" href="https://www.instagram.com/ou_d_bar/" target="_blank" rel="noopener">${icon('instagram')} Echtes Instagram-Profil öffnen ${icon('arrow-up-right')}</a><div class="event-card"><span class="dot"></span><div>Warte auf Follow-Ereignis<small>Demo-Sitzung · GAST-001</small></div></div>`,
    button: 'Follow simulieren'
  },
  {
    icon: 'check',
    title: 'Ein neuer Moment.',
    intro: 'So könnte die Bestätigung in unserem System aussehen. Der Follow wurde für die Vorführung simuliert.',
    body: `<div class="event-card verified">${icon('check')}<div>Neuer Follower · Demo-Ereignis<small>@demo_gast → @ou_d_bar</small></div><span class="event-badge">SIMULIERT</span></div><p class="fine">Nächster Schritt: Eine Instagram-DM lädt den Gast ein, seinen persönlichen Zugang abzurufen.</p>`,
    button: 'Instagram-DM ansehen'
  },
  {
    icon: 'message',
    title: 'Deine Einladung.',
    intro: 'Vorschau der Instagram-Nachricht. Hier wird keine echte Nachricht gesendet.',
    body: '<div class="dm-preview"><div class="dm-header"><img src="assets/logo.webp" alt="OU D’BAR" data-fallback="assets/brand-mark.svg"><div>OU D’BAR<small>Instagram-DM · Simulation</small></div></div><div class="dm-bubble">Willkommen bei OU D’BAR ✨ Danke fürs Folgen! Möchtest du deinen persönlichen Gäste-WLAN-Zugang abrufen?</div></div>',
    button: 'Ja, WLAN-Zugang erhalten'
  },
  {
    icon: 'link',
    title: 'Nur für deinen Abend.',
    intro: 'Nach dem Tippen erhält der Gast den persönlichen Link. In der Live-Version würde er den Zugang mit der passenden Gäste-Sitzung verbinden.',
    body: `<div class="dm-preview"><div class="dm-header"><img src="assets/logo.webp" alt="OU D’BAR" data-fallback="assets/brand-mark.svg"><div>OU D’BAR<small>Instagram-DM · Simulation</small></div></div><div class="dm-bubble">Dein persönlicher Zugang ist bereit.<br>Tippe unten, um zur Lounge zurückzukehren.</div><div class="access-preview">${icon('link')} Persönlicher WLAN-Link <span>DEMO</span></div></div>`,
    button: 'Persönlichen Link öffnen'
  },
  {
    icon: 'wifi',
    title: 'Du bist angekommen.',
    intro: 'So sieht der erfolgreiche Abschluss aus. Danach geht es direkt zurück zur Karte.',
    body: `<div class="event-card verified">${icon('wifi')}<div>Gäste-WLAN freigeschaltet<small>Simulierter Erfolg · keine echte Netzwerkverbindung</small></div></div>`,
    button: 'Karte entdecken'
  }
];

function renderWifi() {
  const stage = stages[wifiStep];
  $('#wifi-stage').innerHTML = `<div class="wifi-symbol">${icon(stage.icon)}</div><h2>${stage.title}</h2><p class="wifi-intro">${stage.intro}</p>${stage.body}<button class="primary" id="demo-next">${stage.button} ${icon('arrow-right')}</button>`;
  document.querySelectorAll('.journey-progress span').forEach((element, index) => {
    element.classList.toggle('current', index === (wifiStep < 2 ? 0 : wifiStep < 4 ? 1 : 2));
  });
  $('#wifi-dialog').scrollTop = 0;
}
$('#wifi-stage').onclick = event => {
  if (!event.target.closest('#demo-next')) return;
  if (wifiStep < 4) {
    wifiStep++;
    renderWifi();
    $('#demo-next').focus();
  } else {
    $('#wifi-dialog').close();
    $('#menu').scrollIntoView({ behavior: 'smooth' });
    toast('Demo abgeschlossen · Willkommen zurück in der Karte.');
  }
};
$('.restart-demo').onclick = () => {
  wifiStep = 0;
  renderWifi();
  $('#demo-next').focus();
};
$('.skip').onclick = () => {
  $('#wifi-dialog').close();
  $('#menu').scrollIntoView({ behavior: 'smooth' });
};

function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  setTimeout(() => $('#toast').classList.remove('show'), 4500);
}
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault();
    $('#search').focus();
    $('#menu').scrollIntoView();
  }
});
render();
