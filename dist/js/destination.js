(() => {
  'use strict';
  const app = window.AventuGo;
  const radios = [...document.querySelectorAll('[name=airline]')];
  const saved = app.read('aventugo:airline:v1', '');
  radios.forEach(radio => {
    radio.checked = radio.value === saved;
    radio.addEventListener('change', () => {
      const persisted = app.write('aventugo:airline:v1', radio.value);
      app.toast(`${radio.value} seleccionada como preferencia.${persisted ? '' : ' Solo durante esta sesión.'}`);
    });
  });
})();
