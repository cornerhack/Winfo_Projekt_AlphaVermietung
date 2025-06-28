document.addEventListener('DOMContentLoaded', function() {
  const suchleistePlaceholder = document.getElementById('suchleiste-placeholder');
  fetch('/html/suchleiste.html')
      .then(response => response.text())
      .then(data => {
        suchleistePlaceholder.innerHTML = data;
        initialSuchleiste();
      });
});

function initialSuchleiste() {
  setupAutocomplete("pickup", "pickup-list");
  setupAutocomplete("dropoff", "dropoff-list");

  document.getElementById('suchleiste').addEventListener('submit', function(e) {
          e.preventDefault();

            const pickupInput = document.getElementById('pickup');
            const dropoffInput = document.getElementById('dropoff');
            let abholStationID = pickupInput.dataset.id;
            let abgabeStationID = dropoffInput.dataset.id;
            const von = document.getElementById('pickup-date').value;
            const bis = document.getElementById('return-date').value;

            // URL-Parameter falls die Suche nicht über die Startseite geht
            const params = new URLSearchParams(window.location.search);

          // Datum überprüfen
          const heute = new Date().setHours(0, 0, 0, 0);
          if (!von || !bis || new Date(von) > new Date(bis) || new Date(von) < new Date(heute)) {
            alert("Bitte wählen Sie ein gültiges Datum.");
            return;
          }
          // Stationen überprüfen
          if(!abholStationID) {
            if (params.get('abholStationID').length > 0) {
              abholStationID = params.get('abholStationID');
            }else{
            alert("Bitte wählen Sie eine gültige Abholstation aus.");
            return;
            }
          } else if(!abgabeStationID) {
            if(params.get('abgabeStationID').length > 0) {
              abgabeStationID = params.get('abgabeStationID');
            }else{
              abgabeStationID = abholStationID;
            }
          }
            window.location.href = `/html/autos.html?abholStationID=${encodeURIComponent(abholStationID)}&abgabeStationID=${encodeURIComponent(abgabeStationID)}&von=${encodeURIComponent(von)}&bis=${encodeURIComponent(bis)}`;
        });
}