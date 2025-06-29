import {initParams} from "./initParams.js";

const filters = {
  sortierung: [],
  kategorie: [],
  getriebe: [],
  sitze: []
};

let abgabeStationID;
let abholStationID;
let abholStation;
let abgabeStation;
let von;
let bis;


document.querySelectorAll('.dropdown-multi').forEach(dropdown => {
  const toggleBtn = dropdown.querySelector('.dropdown-toggle');
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  const countSpan = dropdown.querySelector('.count');
  const nameSpan = dropdown.querySelector('.name');
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
      
    countSpan.textContent = `(${filters[filterKey].length})`;
    } else {
      filters[filterKey] = [value];
      optionsContainer.querySelectorAll('div').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      nameSpan.textContent = ": " + option.textContent;
    }
    applyFilters();
  });
});

document.addEventListener('click', e => {
  document.querySelectorAll('.dropdown-multi').forEach(dropdown => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
  });
});

function applyFilters() {
  const container = document.getElementById('auto-liste');
  const alleAutos = container.querySelectorAll('.car-card');

  // Preis-Sortierung
  const sortierung = filters.sortierung[0] || null;

  // Filterkriterien
  const kategorien = filters.kategorie;
  const getriebe = filters.getriebe;
  const sitze = filters.sitze[0] ? parseInt(filters.sitze[0]) : null;

  const autoArray = Array.from(alleAutos);

  autoArray.forEach(card => {
    const typ = card.querySelector('.subtitle').textContent.toLowerCase();
    const getriebeText = card.querySelector('.info-badge:last-child').textContent.toLowerCase();
    const sitzText = card.querySelector('.info-badge:nth-child(3)').textContent;
    const sitzAnzahl = parseInt(sitzText);

    let sichtbar = true;

    // Fahrzeugkategorie prüfen
    if (kategorien.length > 0 && !kategorien.some(k => typ.includes(k.toLowerCase()))) {
      sichtbar = false;
    }

    // Getriebe prüfen
    if (getriebe.length > 0 && !getriebe.includes(getriebeText)) {
      sichtbar = false;
    }

    // Sitzanzahl prüfen
    if (sitze && sitzAnzahl < sitze) {
      sichtbar = false;
    }

    card.style.display = sichtbar ? '' : 'none';
  });

  // Preis sortieren
  if (sortierung) {
    autoArray.sort((a, b) => {
      const preisA = parseFloat(a.querySelector('.price').textContent);
      const preisB = parseFloat(b.querySelector('.price').textContent);
      return sortierung === 'preis-auf' ? preisA - preisB : preisB - preisA;
    });

    // Neu anordnen
    autoArray.forEach(card => container.appendChild(card));
  }
}


async function ladeVerfuegbareAutos() {
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
      
      const kfzID = auto.kfzID;
      const preisProTag = auto.tarifPreis * auto.zuschlag;
      let tage = Math.ceil((new Date(bis) - new Date(von)) / (1000 * 60 * 60 * 24));
      tage === 0 ? tage = 1 : tage; // Mindestens 1 Tag
      const gesamtpreis = (preisProTag * tage).toFixed(2);

      card.innerHTML = `
        <div class="header">${auto.marke} ${auto.modell}</div>
        <div class="subtitle">${auto.typBezeichnung}</div>

        <div class="info-row">
          <div class="hidden">${auto.kfzID}</div>
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
      card.addEventListener('click', () => {
        window.location.href = `/html/reservierung.html?kfzID=${kfzID}&von=${encodeURIComponent(von)}&bis=${encodeURIComponent(bis)}&abholStationID=${encodeURIComponent(abholStationID)}&abgabeStationID=${encodeURIComponent(abgabeStationID)}`;
      });
      container.appendChild(card);
    }
  } catch (error) {
    console.error(error);
    container.innerText = 'Fehler beim Laden der Fahrzeuge.';
  }
}

async function init() {
  const {v, b, ahID, agID, ah, ag} = await initParams();
  von = v;
  bis = b;
  abholStationID = ahID;
  abgabeStationID = agID;
  abholStation = ah;
  abgabeStation = ag;
  const abholStationElement = document.getElementById('pickup');
  const abgabeStationElement = document.getElementById('dropoff');

  if (abholStation) {
    abholStationElement.value = abholStation;
    abholStationElement.setAttribute('title', abholStation);
    abholStationElement.dataset.id = abholStationID;
  }
  if (abgabeStation) {
    abgabeStationElement.value = abgabeStation;
    abgabeStationElement.setAttribute('title', abgabeStation);
    abgabeStationElement.dataset.id = abgabeStationID;
  }
  if (von) {
    document.getElementById('pickup-date').value = von;
    von = new Date(von);
  }
  if (bis) {
    document.getElementById('return-date').value = bis;
    bis = new Date(bis);
  }

  // Lade verfügbare Autos
  await ladeVerfuegbareAutos();
}

init();
