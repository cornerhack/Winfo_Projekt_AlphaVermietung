async function fetchStations(query) {
    const res = await fetch(`/return/stationen?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        });
    return res.ok ? await res.json() : [];
  }

  function setupAutocomplete(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    input.addEventListener("input", async () => {
      const query = input.value.trim();
      list.innerHTML = "";
      if (query.length < 2) return;

      const stations = await fetchStations(query);
      stations.forEach(station => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = station.name;
        item.addEventListener("click", () => {
          input.value = station.name;
          input.dataset.id = station.id;
          list.innerHTML = "";
        });
        list.appendChild(item);
      });
    });

    document.addEventListener("click", (e) => {
      if (!list.contains(e.target) && e.target !== input) {
        list.innerHTML = "";
      }
    });
  }

  setupAutocomplete("pickup", "pickup-list");
  setupAutocomplete("dropoff", "dropoff-list");

document.getElementById('suchleiste').addEventListener('submit', function(e) {
  e.preventDefault();

    const pickupInput = document.getElementById('pickup');
    const dropoffInput = document.getElementById('dropoff');
    let abholStationID = pickupInput.dataset.id;
    let abgabeStationID = dropoffInput.dataset.id;
    console.log(abholStationID, abgabeStationID);
    let abholStation = pickupInput.value.trim();
    let abgabeStation = dropoffInput.value.trim();
    const von = document.getElementById('pickup-date').value;
    const bis = document.getElementById('return-date').value;

    // URL-Parameter falls die Suche nicht über die Startseite geht
    const params = new URLSearchParams(window.location.search);

  // Datum überprüfen
  if (!von || !bis || new Date(von) > new Date(bis) || new Date(von) < new Date()) {
    alert("Bitte wählen Sie ein gültiges Datum.");
    return;
  }
  // Stationen überprüfen
  if(!abholStationID) {
    if (params.has('abholStationID')) {
      abholStationID = params.get('abholStationID');
      abholStation = params.get('abholStation');
    }else{
    alert("Bitte wählen Sie eine gültige Abholstation aus.");
    return;
    }
  } else if(!abgabeStationID) {
    if(params.has('abgabeStationID')) {
      abgabeStationID = params.get('abgabeStationID');
      abgabeStation = params.get('abgabeStation');
    }else{
      abgabeStationID = abholStationID; // Wenn Abgabestation nicht angegeben, gleiche ID wie Abholstation verwenden
      abgabeStation = abholStation; // Abgabestation auf Abholstation setzen
    }
  }
    window.location.href = `/html/autos.html?abholStationID=${encodeURIComponent(abholStationID)}&abgabeStationID=${encodeURIComponent(abgabeStationID)}&von=${encodeURIComponent(von)}&bis=${encodeURIComponent(bis)}&abholStation=${encodeURIComponent(abholStation)}&abgabeStation=${encodeURIComponent(abgabeStation)}`;
});