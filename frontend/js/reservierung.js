const params = new URLSearchParams(window.location.search);
    const kfzID = params.get('kfzID');
    const von = new Date(params.get('von'));
    const bis = new Date(params.get('bis'));
    const tage = Math.max(1, Math.ceil((bis - von) / (1000 * 60 * 60 * 24)));

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

    ladeAuto();