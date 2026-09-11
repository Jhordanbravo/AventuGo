/* La estancia es una simulación local: no se envía ninguna reserva. */
(() => {
  'use strict';
  const app = window.AventuGo;
  const hotel = window.AventuGoData.hotel;
  const form = document.querySelector('#booking-form');
  const arrival = document.querySelector('#arrival');
  const departure = document.querySelector('#departure');
  const guests = document.querySelector('#guests');
  const error = document.querySelector('#booking-error');
  const currency = value => new Intl.NumberFormat('es-MX', {style:'currency',currency:'MXN',maximumFractionDigits:0}).format(value);
  const localDate = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const addDay = (value, count) => { const d = new Date(`${value}T12:00:00`); d.setDate(d.getDate()+count); return localDate(d); };
  const today = localDate(new Date());
  arrival.min = today; arrival.value = addDay(today, 7); departure.value = addDay(today, 10);
  const draft = app.read('aventugo:stay:v1', null);
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
  if (draft && validDate(draft.arrival) && validDate(draft.departure) && draft.arrival >= today && draft.departure > draft.arrival && [1,2,3,4].includes(Number(draft.guests))) {
    arrival.value = draft.arrival; departure.value = draft.departure; guests.value = String(draft.guests);
  }
  function calculate(showErrors = false) {
    departure.min = arrival.value ? addDay(arrival.value, 1) : today;
    const nights = Math.round((Date.parse(departure.value)-Date.parse(arrival.value))/86400000);
    let message = '';
    if (!validDate(arrival.value) || !validDate(departure.value)) message = 'Selecciona las fechas de entrada y salida.';
    else if (arrival.value < today) message = 'La entrada debe ser hoy o una fecha posterior.';
    else if (nights < 1) message = 'La salida debe ser posterior a la entrada.';
    else if (nights > 30) message = 'Esta demostración permite estancias de hasta 30 noches.';
    const valid = !message;
    error.textContent = showErrors ? message : ''; error.hidden = !showErrors || valid;
    document.querySelector('#nights-label').textContent = valid ? `${currency(hotel.demoNightlyRate)} × ${nights} ${nights === 1 ? 'noche' : 'noches'}` : 'Selecciona fechas válidas';
    document.querySelector('#subtotal').textContent = valid ? currency(nights*hotel.demoNightlyRate) : '—';
    document.querySelector('#total').textContent = valid ? `${currency(nights*hotel.demoNightlyRate)} MXN` : '—';
    return {valid,nights,total:nights*hotel.demoNightlyRate};
  }
  arrival.addEventListener('change', () => {
    if (validDate(arrival.value) && (!validDate(departure.value) || departure.value <= arrival.value)) departure.value = addDay(arrival.value, 1);
    calculate(true);
  });
  departure.addEventListener('change', () => calculate(true));
  form.addEventListener('submit', event => {
    event.preventDefault(); const result = calculate(true); if (!result.valid) { error.focus(); return; }
    const stay = {hotelId:hotel.id,arrival:arrival.value,departure:departure.value,guests:Number(guests.value),nights:result.nights,total:result.total};
    const persisted = app.write('aventugo:stay:v1',stay);
    form.hidden = true;
    const success = document.querySelector('#booking-success'); success.hidden = false;
    document.querySelector('#stay-summary').textContent = `${stay.nights} ${stay.nights === 1 ? 'noche' : 'noches'}, del ${stay.arrival.split('-').reverse().join('/')} al ${stay.departure.split('-').reverse().join('/')}, para ${stay.guests} ${stay.guests === 1 ? 'persona' : 'personas'}. Estimación ficticia: ${currency(stay.total)} MXN.`;
    document.querySelector('#stay-persistence').textContent = persisted ? 'Puedes cerrar la página: las fechas quedan guardadas en este navegador.' : 'El navegador no permite conservar estas fechas al cerrar la página.';
    success.focus();
  });
  document.querySelector('#edit-stay').addEventListener('click', () => { document.querySelector('#booking-success').hidden = true; form.hidden = false; arrival.focus(); });
  let photo = 0;
  const lightbox = document.querySelector('#gallery-dialog');
  const mainImage = document.querySelector('#gallery-image');
  function showPhoto(index) {
    photo = (index+hotel.gallery.length)%hotel.gallery.length;
    mainImage.src = `assets/${hotel.gallery[photo].src}`; mainImage.alt = hotel.gallery[photo].alt;
    document.querySelector('#photo-count').textContent = `${photo+1} / ${hotel.gallery.length}`;
  }
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => { showPhoto(Number(button.dataset.photo)); lightbox.showModal(); }));
  document.querySelector('#photo-prev').addEventListener('click', () => showPhoto(photo-1));
  document.querySelector('#photo-next').addEventListener('click', () => showPhoto(photo+1));
  lightbox.addEventListener('keydown', event => { if(event.key === 'ArrowRight'){event.preventDefault();showPhoto(photo+1);} if(event.key === 'ArrowLeft'){event.preventDefault();showPhoto(photo-1);} });
  calculate();
})();
