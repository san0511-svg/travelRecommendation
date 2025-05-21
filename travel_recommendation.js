// Elementos del DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsDiv = document.getElementById("results");

let recommendations = [];

// Zona horaria aproximada por país
const timeZoneMap = {
  "Japón": "Asia/Tokyo",
  "India": "Asia/Kolkata",
  "República Dominicana": "America/Santo_Domingo",
  "Brasil": "America/Sao_Paulo",
  "España": "Europe/Madrid"
};

// Cargar datos desde el archivo JSON
fetch("travel_recommendation_api.json")
  .then(response => response.json())
  .then(data => {
    recommendations = data.recommendations;
  })
  .catch(error => {
    console.error("Error cargando las recomendaciones:", error);
  });

// Mostrar resultados
function displayResults(keyword) {
  resultsDiv.innerHTML = ""; // Limpiar resultados anteriores

  const keywordLower = keyword.toLowerCase();
  const matched = recommendations.filter(item =>
    item.type.toLowerCase().includes(keywordLower) ||
    item.name.toLowerCase().includes(keywordLower) ||
    item.country.toLowerCase().includes(keywordLower)
  );

  if (matched.length === 0) {
    resultsDiv.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  matched.forEach(place => {
    const card = document.createElement("div");
    card.className = "card";

    // Obtener hora local
    let timeHTML = "";
    const timeZone = timeZoneMap[place.country];
    if (timeZone) {
      const time = new Date().toLocaleTimeString('es-ES', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      timeHTML = `<p><strong>Hora local:</strong> ${time}</p>`;
    }

    card.innerHTML = `
      <h3>${place.name} (${place.country})</h3>
      <img src="${place.imageUrl}" alt="${place.name}" width="300">
      <p>${place.description}</p>
      ${timeHTML}
    `;
    resultsDiv.appendChild(card);
  });
}

// Limpiar resultados y campo de búsqueda
function clearResults() {
  resultsDiv.innerHTML = "";
  searchInput.value = "";
}

// Evento: clic en botón buscar
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim();
  if (keyword) {
    displayResults(keyword);
  }
});

// Evento: clic en botón limpiar
clearBtn.addEventListener("click", clearResults);

// Evento: presionar Enter
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const keyword = searchInput.value.trim();
    if (keyword) {
      displayResults(keyword);
    }
  }
});
