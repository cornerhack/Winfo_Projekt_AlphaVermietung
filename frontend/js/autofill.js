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