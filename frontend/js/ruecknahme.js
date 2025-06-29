document.addEventListener('DOMContentLoaded', async() => {
    const container = document.getElementById('reservierungen-list');
    const modal = document.getElementById('ruecknahmeForm-modal');
    let kfzID;
    let rID;
    let reservierung;
    let schadenTarifID;
    let t;
    let gesamtK;
    try {
        const res = await fetch('/return/alleReservierungen');
        const reservierungen = await res.json();

        if (!reservierungen.length) {
            container.innerHTML = '<p>Keine Reservierungen gefunden.</p>';
            return;
        }

        const formatDate = dateStr => new Date(dateStr).toLocaleDateString('de-DE');
        reservierungen.forEach(r => {
            if (r.status === "aktiv") {
                const card = document.createElement('div');
                card.className = 'reservierungs-card';
                card.dataset.status = r.status;

                card.innerHTML = `
                    <h2>${r.marke} ${r.modell} ${r.getriebe} (${r.typBezeichnung})</h2>
                    <p><strong>Kunden-nr:</strong> ${r.kundeID}</p>
                    <p><strong>Name:</strong> ${r.vorname} ${r.nachname}</p>
                    <p><strong>Rückgabedatum:</strong> ${formatDate(r.mietende)}</p>
                     <div class="reservierungs-actions">
                       <button class="form-btn" data-id="${r.reservierungID},${r.kfzID}">Fahrzeug zurücknehmen</button>
                     </div>
                  `;
                container.appendChild(card);
            }
        });

        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('form-btn')) {
                const ids = e.target.dataset.id.split(',');
                rID = ids[0];
                kfzID = ids[1];
                const data = await fetch(`/return/reservierung/${rID}`);
                reservierung = await data.json();
                validateForm();
                modal.style.display = 'flex';
            }
        });

    }catch (err){
        container.innerHTML = '<p>Fehler beim Laden der Reservierungen.</p>';
    }

    const tank = document.getElementById('tank');
    const fehlerHinweis = document.getElementById('bewertungFehler');

// Automatisch Punkt durch Komma ersetzen und live prüfen
    tank.addEventListener('input', () => {
        tank.value = tank.value.replace(',', '.');  // Punkt zu Komma
        const pattern = /^(0([.][0-9])?|1([.]0)?)$/;
        if (tank.value === '' || pattern.test(tank.value)) {
            fehlerHinweis.style.display = 'none';
            tank.setCustomValidity('');
        } else {
            fehlerHinweis.style.display = 'inline';
            tank.setCustomValidity('Ungültiger Wert');
        }
    });
    document.getElementById('kmStand').addEventListener('input', e => {
        const input = e.target;
        input.value = input.value.replace(/[^0-9]/g, ''); // Entfernt alles außer Ziffern
    });

    document.querySelector('.closeIdent-btn').addEventListener('click', async () => {
        modal.style.display = 'none';
    });

    const form = document.getElementById('rueck-form');
    const abschliessenBtn = document.getElementById('abschliessenBtn');
    const kmElement = document.getElementById('kmStand');
    const zusatzKosten = document.getElementById('zusaetzlicheKosten');


    abschliessenBtn.addEventListener('click', async ()=>{
        abschliessenBtn.disabled = true;
        abschliessenBtn.textContent = "Bitte warten...";
        const kfzs = await fetch(`/return/fahrzeug?kfzID=${kfzID}`);
        const kfz = await kfzs.json();
        const km = kmElement.value;
        const zusatzK = zusatzKosten.textContent;
        gesamtK = reservierung.gesamtbetrag + kosten;

        if(km.value <= kfz.kilometerStand){
            alert(`Der Kilometerstand muss über ${kfz.kilometerStand} liegen!`);
            return;
        }

        const [res] = await fetch('/pdf_vorlagen/rueckgabeprotokoll', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                resID: rID, tank: t, sauberkeit: sauberkeit, schadenTarifID: schadenTarifID, kmNew: km, kfzID: kfzID, schadenKosten: zusatzK, gesamtbetrag: gesamtK
            })
        });
        const data = await res.json();
        const protokollID = data.protokollID;
        window.open(`/pdfs/protokolle/rueckgabe-${protokollID}`, '_blank');

        await fetch('/pdf_vorlagen/rechnung', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({rechnungNr: data.rechnungsID})
        });
        abschliessenBtn.disabled = false;
        abschliessenBtn.textContent = "Abholung abschließen";
        modal.style.display = 'none';
    });


    const inputs = form.querySelectorAll('input[type="text"]');
    const radiosSchaden = form.querySelectorAll('input[name="schaden"]');
    const radiosSauberkeit = form.querySelectorAll('input[name="sauberkeit"]');
    let schaden;
    let sauberkeit;

    function isRadioChecked(name) {
        return [...form.querySelectorAll(`input[name="${name}"]`)].some(r => r.checked);
    }

    function validateForm() {
        let allValid = true;

        // Prüfen, ob Textfelder gültig sind
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                allValid = false;
            }
        });

        // Prüfen, ob jeweils ein Radio ausgewählt ist
        if (!isRadioChecked('schaden') || !isRadioChecked('sauberkeit')) {
            allValid = false;
        }
        schaden = getSelectedRadioText('schaden');
        sauberkeit = getSelectedRadioText('sauberkeit');

        calculate();
        abschliessenBtn.disabled = !allValid;
    }

    function getSelectedRadioText(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.parentElement.textContent.trim() : null;
    }

    // Events für Textfelder
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Events für Radio-Gruppen
    [...radiosSchaden, ...radiosSauberkeit].forEach(radio => {
        radio.addEventListener('change', validateForm);
    });
    let kosten;
    async function calculate(){
        const zusatz = reservierung.zusaetze;
        kosten = 0;
        t = tank.value || 1;
        if(!zusatz.includes("Tankservice"))
            kosten += Math.round(((1 - t) * 150),2);

        if(!zusatz.includes("Vollkaskoversicherung")){
            switch (schaden){
                case "Leichter Schaden":
                    kosten += 50;
                    schadenTarifID = 14;
                    break;
                case "Starker Schaden":
                    kosten += 250;
                    schadenTarifID = 15;
                    break;
                case "Totalschaden":
                    kosten += 1000;
                    schadenTarifID = 16;
                    break;
                default:
                    schadenTarifID = 13;
                    break;
            }
        }
        zusatzKosten.textContent = `${Math.round(kosten, 2)}`;
    }
});