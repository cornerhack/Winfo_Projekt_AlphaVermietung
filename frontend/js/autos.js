const filters = {
  sortierung: [],
  kategorie: [],
  getriebe: [],
  sitze: []
};

document.querySelectorAll('.dropdown-multi').forEach(dropdown => {
  const toggleBtn = dropdown.querySelector('.dropdown-toggle');
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  const countSpan = dropdown.querySelector('.count');
  const filterKey = dropdown.dataset.filter;
  const multiSelect = dropdown.dataset.multi === 'true';

  toggleBtn.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-multi').forEach(d => {
      if (d !== dropdown) d.classList.remove('open');
    });
    dropdown.classList.toggle('open');
  });

  optionsContainer.addEventListener('click', e => {
    const option = e.target.closest('div[data-value]');
    if (!option) return;

    const value = option.dataset.value;
    const index = filters[filterKey].indexOf(value);

    if (multiSelect) {
      if (index > -1) {
        filters[filterKey].splice(index, 1);
        option.classList.remove('selected');
      } else {
        filters[filterKey].push(value);
        option.classList.add('selected');
      }
    } else {
      filters[filterKey] = [value];
      optionsContainer.querySelectorAll('div').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    }

    countSpan.textContent = `(${filters[filterKey].length})`;
    applyFilters();
  });
});

document.addEventListener('click', e => {
  document.querySelectorAll('.dropdown-multi').forEach(dropdown => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
  });
});

function applyFilters() {
  console.log("Aktive Filter:", filters);

  // Hier kannst du alle Filter anwenden auf deine Auto-Liste
  // z. B. per Ajax an den Server senden oder die Autos im Frontend filtern
}


async function ladeVerfuegbareAutos() {
  const params = new URLSearchParams(window.location.search);
  const abholStationID = params.get('abholStationID');
  const von = params.get('von');
  const bis = params.get('bis');
  const container = document.getElementById('auto-liste');

  if (!abholStationID || !von || !bis) {
    container.innerText = 'Fehlende Suchparameter.';
    return;
  }

  try {
    const res = await fetch(`/return/verfuegbare-autos?stationID=${abholStationID}&von=${von}&bis=${bis}`);
    if (!res.ok) throw new Error('Fehler beim Laden der Daten');
    const autos = await res.json();

    container.innerHTML = '';

    if (autos.length === 0) {
      container.innerText = 'Keine Fahrzeuge verfügbar.';
      return;
    }

    for (const auto of autos) {
      const card = document.createElement('div');
      card.className = 'car-card';

      const preisProTag = auto.tarifPreis * auto.zuschlag;
      const tage = Math.ceil((new Date(bis) - new Date(von)) / (1000 * 60 * 60 * 24));
      const gesamtpreis = (preisProTag * tage).toFixed(2);

      card.innerHTML = `
        <div class="header">${auto.marke} ${auto.modell}</div>
        <div class="subtitle">${auto.typBezeichnung} ${auto.getriebe}</div>

        <div class="info-row">
          <div class="info-badge">${auto.kilometerStand} km</div>
          <div class="info-badge">${auto.anzahlSitze} Sitze</div>
          <div class="info-badge">${auto.anzahlTueren} Türen</div>
          <div class="info-badge">${auto.getriebe}</div>
        </div>

        <img class="image" src="../img/test.png" alt="${auto.marke} ${auto.modell}">

        <div class="price">
          ${preisProTag.toFixed(2)} € <span>/Tag</span><br>
          <span>${gesamtpreis} € Gesamtpreis</span>
        </div>
      `;
      container.appendChild(card);
    }

  } catch (error) {
    console.error(error);
    container.innerText = 'Fehler beim Laden der Fahrzeuge.';
  }
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const abholStation = params.get('abholStation');
  const abgabeStation = params.get('abgabeStation');
  const von = params.get('von');
  const bis = params.get('bis');
  const abholStationElement = document.getElementById('pickup');
  const abgabeStationElement = document.getElementById('dropoff');

  if (abholStation) {
    abholStationElement.value = abholStation;
    abholStationElement.setAttribute('title', abholStation);
  }
  if (abgabeStation) {
    abgabeStationElement.value = abgabeStation;
    abgabeStationElement.setAttribute('title', abgabeStation);
  }
  if (von) {
    document.getElementById('pickup-date').value = von;
  }
  if (bis) {
    document.getElementById('return-date').value = bis;
  }

  // Lade verfügbare Autos
  await ladeVerfuegbareAutos();
}

init();
