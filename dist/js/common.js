/* Utilidades compartidas. Scripts clásicos para funcionar también con file://. */
(() => {
  'use strict';
  const data = window.AventuGoData;
  const catalog = [...data.destinations, data.hotel];
  const storageKey = 'aventugo:favorites:v1';
  let favorites = [];
  let persistent = true;
  let toastTimer;
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { persistent = false; return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { persistent = false; return false; }
  };
  const stored = read(storageKey, []);
  favorites = Array.isArray(stored) ? stored.filter(id => catalog.some(item => item.id === id)) : [];
  function toast(message) {
    const box = document.querySelector('#toast');
    if (!box) return;
    clearTimeout(toastTimer); box.textContent = message; box.hidden = false;
    toastTimer = setTimeout(() => { box.hidden = true; }, 4500);
  }
  function syncFavorites() {
    document.querySelectorAll('[data-save]').forEach(button => {
      const active = favorites.includes(button.dataset.save);
      const item = catalog.find(item => item.id === button.dataset.save);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', `${active ? 'Quitar' : 'Guardar'} ${item?.name || 'hospedaje'} de favoritos`);
      if (button.classList.contains('save-button')) button.textContent = active ? '♥' : '♡';
      else button.textContent = active ? 'Guardado en favoritos' : `Guardar ${item?.id === 'garza' ? 'hospedaje' : 'destino'}`;
    });
    document.querySelectorAll('[data-favorite-count]').forEach(el => { el.textContent = String(favorites.length); });
  }
  function toggleFavorite(id) {
    if (!catalog.some(item => item.id === id)) return;
    const exists = favorites.includes(id);
    favorites = exists ? favorites.filter(value => value !== id) : [...favorites, id];
    write(storageKey, favorites); syncFavorites();
    toast(`${exists ? 'Eliminado de' : 'Guardado en'} favoritos.${persistent ? '' : ' El navegador no permite guardarlo al cerrar.'}`);
    document.dispatchEvent(new CustomEvent('favorites-changed'));
  }
  function showDialog(id) {
    const dialog = document.getElementById(id);
    if (dialog && !dialog.open) dialog.showModal();
  }
  function renderSaved() {
    const list = document.querySelector('#saved-list');
    if (!list) return;
    list.replaceChildren();
    const items = catalog.filter(item => favorites.includes(item.id));
    document.querySelector('#no-saved').hidden = items.length > 0;
    items.forEach(item => {
      const li = document.createElement('li');
      const img = document.createElement('img'); img.src = `assets/${item.image}`; img.alt = ''; img.width = 64; img.height = 56;
      const content = document.createElement('div'); const name = document.createElement('strong'); name.textContent = item.name; content.append(name);
      if (item.url || item.id === 'garza') { const a = document.createElement('a'); a.href = item.url || 'hotel.html'; a.className = 'text-link'; a.textContent = ' Ver detalles'; content.append(document.createElement('br'), a); }
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-saved'; remove.dataset.remove = item.id; remove.textContent = 'Quitar'; remove.setAttribute('aria-label', `Quitar ${item.name}`);
      li.append(img,content,remove); list.append(li);
    });
  }
  document.addEventListener('click', event => {
    const save = event.target.closest('[data-save]');
    if (save) toggleFavorite(save.dataset.save);
    const remove = event.target.closest('[data-remove]');
    if (remove) { toggleFavorite(remove.dataset.remove); renderSaved(); }
    const opener = event.target.closest('[data-dialog]');
    if (opener) { if (opener.dataset.dialog === 'saved-dialog') renderSaved(); showDialog(opener.dataset.dialog); }
    const close = event.target.closest('[data-close]');
    if (close) close.closest('dialog').close();
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });
  const compact = document.querySelector('#compact-setting');
  if (compact) {
    compact.checked = read('aventugo:compact:v1', false) === true;
    document.body.classList.toggle('compact-mode', compact.checked);
    compact.addEventListener('change', () => {
      document.body.classList.toggle('compact-mode', compact.checked);
      if (!write('aventugo:compact:v1', compact.checked)) toast('El ajuste solo estará disponible mientras esta página siga abierta.');
    });
  }
  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    const values = read(storageKey, []);
    favorites = Array.isArray(values) ? values.filter(id => catalog.some(item => item.id === id)) : [];
    syncFavorites(); renderSaved(); document.dispatchEvent(new CustomEvent('favorites-changed'));
  });
  window.AventuGo = {toast, read, write, syncFavorites, showDialog, isFavorite: id => favorites.includes(id)};
  syncFavorites();
})();
