document.addEventListener("DOMContentLoaded", async () =>{
    const container = document.getElementById('reservierungen-list');
    const modal = document.getElementById('cars-modal');
    let kfzID;
    let rID;
    let kID;
    try {
        const res = await fetch('/return/alleReservierungen');
        const reservierungen = await res.json();

        if (!reservierungen.length) {
            container.innerHTML = '<p>Keine Reservierungen gefunden.</p>';
            return;
        }

        const formatDate = dateStr => new Date(dateStr).toLocaleDateString('de-DE');
        reservierungen.forEach(r => {
            if(r.status === "bestätigt") {
                const card = document.createElement('div');
                card.className = 'reservierungs-card';
                card.dataset.status = r.status;

                card.innerHTML = `
                    <h2>${r.marke} ${r.modell} ${r.getriebe} (${r.typBezeichnung})</h2>
                    <p><strong>Kunden-nr:</strong> ${r.kundeID}</p>
                    <p><strong>Name:</strong> ${r.vorname} ${r.nachname}</p>
                    <p><strong>Zeitraum:</strong> ${formatDate(r.mietbeginn)} bis ${formatDate(r.mietende)}</p>
                     <div class="reservierungs-actions">
                       <button class="nichtDa-btn" data-id="${r.reservierungID},${r.kfzID}">Fahrzeug nicht da?</button>
                       <button class="weiter-btn" data-id="${r.reservierungID}, ${r.kundeID}">Kundendaten überprüfen</button>
                     </div>
                  `;
                container.appendChild(card);
            }
        });

        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('nichtDa-btn')) {
                const ids = e.target.dataset.id.split(',');
                rID = ids[0];
                kfzID = ids[1];
                const r = await fetch(`/return/bessereFahrzeuge?kfzID=${kfzID}`);
                const autos = await r.json();

                // modales Fenster öffnen mit den Alternativen
                const modal = document.getElementById('cars-modal');
                const container = document.getElementById('auto-liste');
                container.innerHTML = '';

                for (const auto of autos) {
                    const card = document.createElement('div');
                    card.className = 'car-card';

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
                      `;
                    card.addEventListener('click', async () => {
                        await fetch(`/return/reservierungen/autoWechseln/${rID}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json'},
                            body: JSON.stringify({kfzID: auto.kfzID})
                        });
                        modal.style.display = 'none';
                        location.reload();
                    });
                    container.appendChild(card);
                }
                modal.style.display = 'flex';
            }

            if (e.target.classList.contains('weiter-btn')) {
                const ids = e.target.dataset.id.split(',');
                rID = ids[0];
                kID = ids[1];
                const kundeRes = await fetch(`/return/kunde/${kID}`);
                const kunde = await kundeRes.json();
                openKundenModal(kunde);
            }
        });
        document.querySelector('.close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    } catch (err) {
        container.innerHTML = '<p>Fehler beim Laden der Reservierungen.</p>';
    }
    const v = document.getElementById('vorname');
    const nn = document.getElementById('nachname');
    const m = document.getElementById('emailAdresse');
    const s = document.getElementById('strasse');
    const n = document.getElementById('hausNr');
    const p = document.getElementById('plz');
    const o = document.getElementById('ort');
    const l = document.getElementById('land');
    const t = document.getElementById('telefonNr');
    const modalKunde = document.getElementById('kunden-modal');
    const abschliessen = document.getElementById('abschliessenBtn');

    function openKundenModal(kunde) {
        modalKunde.style.display = 'flex';

        // Felder befüllen
        v.value = kunde.vorname || '';
        nn.value = kunde.nachname || '';
        m.value = kunde.emailAdresse || '';
        s.value = kunde.strasse || '';
        n.value = kunde.hausNr || '';
        p.value = kunde.plz || '';
        o.value = kunde.ort || '';
        l.value = kunde.land || '';
        t.value = kunde.telefonNr || '';

        validateForm(); // Initial prüfen
    }

    function validateForm() {
        const requiredFields = ['vorname', 'nachname', 'emailAdresse', 'strasse', 'hausNr', 'plz', 'ort', 'land', 'telefonNr'];
        const fuehrerschein = document.getElementById('fuehrerscheinCheckbox').checked;
        const alleAusgefuellt = requiredFields.every(id => document.getElementById(id).value.trim() !== '');

        abschliessen.disabled = !(alleAusgefuellt && fuehrerschein);
    }

// Event-Listener
    document.getElementById('kunden-form').addEventListener('input', validateForm);
    document.getElementById('fuehrerscheinCheckbox').addEventListener('change', validateForm);

    abschliessen.addEventListener('click', async() => {
        abschliessen.textContent = 'Bitte warten...';
        abschliessen.disabled = true;
        const vorname = v.value;
        const nachname = nn.value;
        const mail = m.value;
        const str = s.value;
        const nr = n.value;
        const plz = p.value;
        const ort = o.value;
        const land = l.value;
        const tel = t.value;
        await fetch(`/return/updateKundeReservierung/${kID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vorname,
                nachname,
                mail,
                str,
                nr,
                plz,
                ort,
                land,
                tel
            })
        });
        // Reservierung auf aktiv setzen und Mietvertrag erstellen
        await fetch(`/return/updateStatus/${rID}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'}});

        const mietvertag = await fetch(`/pdf_vorlagen/mietvertrag/${rID}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        });
        const d = await mietvertag.json();
        const id = d.mietvertragID;
        window.open(`/pdfs/mietvertraege/mietvertrag-${id}.pdf`,'_blank');
        abschliessen.textContent = "Abholung abschließen";
        abschliessen.disabled = false;
        modalKunde.style.display = 'none';
        location.reload();
    });
// Modal schließen
    document.querySelector('.closeIdent-btn').addEventListener('click', async () => {
        modalKunde.style.display = 'none';
    });
});