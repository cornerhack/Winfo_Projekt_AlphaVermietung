import {initParams} from "./initParams.js";

let abgabeStationID;
let abholStationID;
let abholStation;
let abgabeStation;
let von;
let bis;
let kfzID;
let tage;

async function ladeAuto() {
    try {
        const res = await fetch(`/return/fahrzeug?kfzID=${kfzID}`);
        const auto = await res.json();

        const preisProTag = auto.tarifPreis * auto.zuschlag;
        const gesamt = (preisProTag * tage).toFixed(2);

        const card = document.getElementById('fahrzeug-card');
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
            <span id="basispreis">Mietpreis für ${tage} Tage: ${gesamt} €</span>
          </div>
        `;

        berechneGesamtpreis(preisProTag);
    } catch (e) {
        console.error('Fehler beim Laden:', e);
    }
}

function berechneGesamtpreis(preisProTag) {
    let zusatz = 0;
    document.querySelectorAll('.zusatz-option input:checked').forEach(opt => {
        const preis = parseFloat(opt.dataset.preis);
        const art = opt.dataset.art;
        zusatz += art === 'proTag' ? preis * tage : preis;
    });
    const grundpreis = preisProTag * tage;
    document.getElementById('gesamtpreis').innerText = (grundpreis + zusatz).toFixed(2);
}

document.querySelectorAll('.zusatz-option input').forEach(input => {
    input.addEventListener('change', () => {
        const preisProTag = parseFloat(document.querySelector('.price').innerText);
        berechneGesamtpreis(preisProTag);
    });
});

document.getElementById('absenden').addEventListener("click", absenden);

async function absenden(){
    const loginBtn = document.querySelector('.login-btn');
    if(loginBtn != null){
        alert('Bitte loggen Sie sich vorher ein oder erstellen Sie einen neuen Nutzer, um eine Reservierung durchzuführen!');
        return;
    }

    const kundeID = document.querySelector('.user-info')?.dataset.id;
    const fahrzeug = document.querySelector('#fahrzeug-card .header')?.textContent || 'Fahrzeug';
    const optionen = Array.from(document.querySelectorAll('.zusatz-option input:checked')).map(el => {
        return el.parentElement.querySelector('label').textContent.split(' ')[0];
    });

    const preis = document.getElementById('gesamtpreis').textContent;
    const zusatz = optionen.length > 0 ? optionen.join(', ') : 'Keine';
    const res = await fetch(`/pdf_vorlagen/bestaetigung`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ kfzID: kfzID, abholStationID: abholStationID, abgabeStationID: abgabeStationID, kundeID: kundeID, von: von, bis: bis, tage: tage, gesamtbetrag: parseFloat(preis), zusatz: zusatz })
    });
    const data = await res.json();
    const reservierungsID = data.reservierungsID;
    const link = document.createElement('a');
    link.href = `/pdfs/reservierungen/reservierung-${reservierungsID}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'hier als PDF geöffnet werden.';

    const paragraph = document.querySelector('.bestaetigung-card p');
    paragraph.appendChild(link);

    // Bestätigungsdaten einfügen
    const ul = document.getElementById('bestaetigungs-details');
    ul.innerHTML = `
    <li><strong>Reservierungsnummer:</strong> ${reservierungsID}</li>
    <li><strong>Abholort:</strong> ${abholStation}</li>
    <li><strong>Abgabeort:</strong> ${abgabeStation}</li>
    <li><strong>Fahrzeug:</strong> ${fahrzeug}</li>
    <li><strong>Zusatzoptionen:</strong> ${zusatz}</li>
    <li><strong>Anzahl Tage:</strong> ${tage}</li>
    <li><strong>Gesamtpreis:</strong> ${preis} €</li>
  `;

    // Umschalten der Ansicht
    document.querySelector('.reservierungs-container').style.display = 'none';
    document.getElementById('bestaetigungs-container').style.display = 'flex';
}

async function init(){
    const {v, b, ahID, agID, ah, ag} = await initParams();
    von = new Date(v);
    bis = new Date(b);
    abholStationID = ahID;
    abgabeStationID = agID;
    abholStation = ah;
    abgabeStation = ag;
    kfzID = new URLSearchParams(window.location.search).get('kfzID');
    tage = Math.max(1, Math.ceil((bis - von) / (1000 * 60 * 60 * 24)));

    await ladeAuto();
}

init();