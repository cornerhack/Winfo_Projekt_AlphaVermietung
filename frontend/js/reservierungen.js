document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('reservierungen-list');

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-multi.open').forEach(d => d.classList.remove('open'));
    });

    const dropdowns = document.querySelectorAll('.dropdown-multi');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // verhindert ungewolltes Schließen
            dropdown.classList.toggle('open');
        });

        // Option auswählen
        const nameSpan = dropdown.querySelector('.name');
        const options = dropdown.querySelector('.dropdown-options');
        options.addEventListener('click', e => {
            const option = e.target.closest('div[data-value]');
            const value = option.dataset.value;
            options.querySelectorAll('div').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            // name und so
            nameSpan.textContent = ": " + option.textContent;
            filterReservierungen(value); // deine Filterfunktion
        });
    });

    function filterReservierungen(status) {
        console.log("hier");
        const cards = document.querySelectorAll('.reservierungs-card');
        console.log(cards);
        cards.forEach(card => {
            console.log(card.dataset.status , status);
            if (status === 'alle' || card.dataset.status === status) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    try {
        const res = await fetch('/return/meineReservierungen');
        const reservierungen = await res.json();

        if (!reservierungen.length) {
            container.innerHTML = '<p>Keine Reservierungen gefunden.</p>';
            return;
        }

        const formatDate = dateStr => new Date(dateStr).toLocaleDateString('de-DE');
        reservierungen.forEach(r => {
            const card = document.createElement('div');
            card.className = 'reservierungs-card';
            card.dataset.status = r.status;

            const mietbeginnDate = new Date(r.mietbeginn).setHours(0,0,0);
            const jetzt = new Date().setHours(0,0,0);
            const diffInMs = mietbeginnDate - jetzt;
            const diffInHours = diffInMs / (1000 * 60 * 60);

            const darfBearbeiten = r.status === 'bestätigt' && diffInHours >= 24;

            card.innerHTML = `
        <h2>${r.marke} ${r.modell}</h2>
        <p><strong>Zeitraum:</strong> ${formatDate(r.mietbeginn)} bis ${formatDate(r.mietende)}</p>
        <p><strong>Abholung:</strong> ${r.abholort}</p>
        <p><strong>Rückgabe:</strong> ${r.abgabeort}</p>
        <p><strong>Status:</strong> ${r.status}</p>
        <p><strong>Gesamtbetrag:</strong> ${r.gesamtbetrag} €</p>
        ${darfBearbeiten ? `
          <div class="reservierungs-actions">
            <button class="cancel-btn" data-id="${r.reservierungID}">Stornieren</button>
            <button class="edit-btn" data-id="${r.reservierungID}">Ändern</button>
          </div>
        ` : ''}
      `;
            container.appendChild(card);
        });

        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('cancel-btn')) {
                const id = e.target.dataset.id;
                if (confirm('Möchten Sie diese Reservierung wirklich stornieren?')) {
                    await fetch(`/return/stornieren/${id}`, { method: 'POST' });
                    location.reload();
                }
            }

            if (e.target.classList.contains('edit-btn')) {
                const id = e.target.dataset.id;
                const res = await fetch(`/return/reservierung/${id}`);
                const data = await res.json();

                currentReservierung = data;

                openEditModal(data);
            }
        });
    } catch (err) {
        container.innerHTML = '<p>Fehler beim Laden der Reservierungen.</p>';
    }

    const zusatzOptionen = [
        { id: 'fahrer', preis: 5, art: 'proTag', label: 'Zusatzfahrer (5€/Tag)', beschreibung: 'Ermöglicht einer weiteren Person das Fahren des Fahrzeugs – ideal für längere Reisen.' },
        { id: 'kindersitz', preis: 3, art: 'proTag', label: 'Kindersitz (3€/Tag)', beschreibung: 'Sicherer Kindersitz für Kinder bis 12 Jahre oder 1,50 m Körpergröße.' },
        { id: 'navi', preis: 7, art: 'proTag', label: 'Navigationssystem (7€/Tag)', beschreibung: 'Integriertes Navigationssystem mit aktuellen Karten.' },
        { id: 'versicherung', preis: 15, art: 'proTag', label: 'Vollkaskoversicherung (15€/Tag)', beschreibung: 'Schutz vor hohen Kosten bei Unfällen.' },
        { id: 'tankservice', preis: 50, art: 'einmalig', label: 'Tankservice (50€ einmalig)', beschreibung: 'Fahrzeug kann mit leerem Tank zurückgegeben werden.' },
    ];

    let currentReservierung = null;

    function openEditModal(data) {
        const modal = document.getElementById('edit-modal');
        const container = document.getElementById('zusatz-optionen-box');
        const gesamtpreisEl = document.getElementById('edit-gesamtpreis');

        const tage = getMietTage(data.mietbeginn, data.mietende);
        const ausgewaehlt = data.zusaetze ? data.zusaetze.split(', ') : [];

        let gesamt = data.gesamtbetrag;
        container.innerHTML = zusatzOptionen.map(opt => {
            const checked = ausgewaehlt.includes(opt.id) ? 'checked' : '';
            return `
      <div class="zusatz-option">
        <div class="option-header">
          <label for="${opt.id}">${opt.label}</label>
          <input type="checkbox" id="${opt.id}" data-preis="${opt.preis}" data-art="${opt.art}" ${checked}>
        </div>
        <p class="beschreibung">${opt.beschreibung}</p>
      </div>
    `;
        }).join('');

        gesamtpreisEl.textContent = gesamt.toFixed(2);
        modal.style.display = 'flex';

        // neu berechnen bei Änderungen
        container.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const preis = parseFloat(checkbox.dataset.preis);
                const art = checkbox.dataset.art;
                const betrag = art === 'proTag' ? preis * tage : preis;

                let aktuellerPreis = parseFloat(gesamtpreisEl.textContent);

                if (checkbox.checked)
                    aktuellerPreis += betrag;
                else
                    aktuellerPreis -= betrag;

                gesamtpreisEl.textContent = aktuellerPreis.toFixed(2);
            });
        });
    }

// Schließen
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('edit-modal').style.display = 'none';
    });

// Speichern
    document.getElementById('save-edit-btn').addEventListener('click', async () => {
        const checked = Array.from(document.querySelectorAll('#zusatz-optionen-box input[type=checkbox]:checked'))
            .map(el => el.id);
        const gesamt = parseFloat(document.getElementById('edit-gesamtpreis').textContent);

        await fetch(`/return/reservierungen/${currentReservierung.reservierungID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zusaetze: checked.join(', '), gesamtbetrag: gesamt })
        });

        document.getElementById('edit-modal').style.display = 'none';
        location.reload();
    });

    function getMietTage(start, ende) {
        const startDate = new Date(start);
        const endDate = new Date(ende);
        const ms = endDate - startDate;
        return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    }

});
