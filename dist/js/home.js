(() => {
  'use strict';
  const data = window.AventuGoData;
  const app = window.AventuGo;
  const form = document.querySelector('#search-form');
  const search = document.querySelector('#search');
  const country = document.querySelector('#country');
  const sort = document.querySelector('#sort');
  const grid = document.querySelector('#destinations-grid');
  const restaurants = document.querySelector('#restaurants-grid');
  let category = 'destinations';
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  function update() {
    const query = normalize(search.value);
    const isRestaurants = category === 'restaurants';
    const source = isRestaurants ? data.restaurants : data.destinations;
    let items = source.filter(item => normalize(`${item.name} ${item.country || ''}`).includes(query));
    if (!isRestaurants && country.value) items = items.filter(item => item.country === country.value);
    if (category === 'saved') items = items.filter(item => app.isFavorite(item.id));
    if (sort.value === 'name') items = [...items].sort((a,b) => a.name.localeCompare(b.name, 'es'));
    if (sort.value === 'reverse') items = [...items].sort((a,b) => b.name.localeCompare(a.name, 'es'));
    grid.hidden = isRestaurants; restaurants.hidden = !isRestaurants; country.disabled = isRestaurants;
    document.querySelector('#results-title').textContent = isRestaurants ? 'Restaurantes para descubrir' : category === 'saved' ? 'Tus destinos guardados' : 'Destinos para descubrir';
    document.querySelector('#results-count').textContent = `${items.length} ${isRestaurants ? 'restaurantes' : 'destinos'}`;
    document.querySelector('#empty-state').hidden = items.length > 0;
    const filtered = !!query || !!country.value || category !== 'destinations' || sort.value !== 'recommended';
    grid.classList.toggle('is-filtered', filtered);
    if (isRestaurants) restaurants.innerHTML = items.map(item => `<article class="restaurant-card"><img src="assets/${item.image}" alt="${item.name}" width="360" height="200" loading="lazy"><div><h3>${item.name}</h3><p>${item.note}</p><span class="small muted">Inspiración del diseño AventuGo</span></div></article>`).join('');
    else grid.innerHTML = items.map(item => `<article class="destination-card ${item.featured ? 'featured' : ''}"><img src="assets/${item.image}" alt="Vista de ${item.name}" width="600" height="420" ${item.featured ? 'fetchpriority="high"' : 'loading="lazy"'}>${item.featured ? '<span class="card-kicker">Tu siguiente escapada</span>' : ''}<button class="save-button" type="button" data-save="${item.id}" aria-pressed="false" aria-label="Guardar ${item.name}">♡</button><div class="destination-content"><h3>${item.name}</h3><p>${item.country} · ${item.note}</p>${item.url ? `<a class="button button-mint" href="${item.url}">Explorar Cancún <span aria-hidden="true">↗</span></a>` : ''}</div></article>`).join('');
    app.syncFavorites();
  }
  function reset() {
    search.value = ''; country.value = ''; sort.value = 'recommended'; category = 'destinations';
    document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.category === category)));
    update();
  }
  search.addEventListener('input', update); country.addEventListener('change', update); sort.addEventListener('change', update);
  form.addEventListener('submit', event => { event.preventDefault(); update(); document.querySelector('#results-title').focus(); });
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach(other => other.setAttribute('aria-pressed',String(other === button)));
    update();
  }));
  document.querySelector('#reset-filters').addEventListener('click', reset);
  document.addEventListener('favorites-changed', () => { if (category === 'saved') update(); });
  update();
})();
