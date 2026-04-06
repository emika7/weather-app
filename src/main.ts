import { fetchWeather } from "./api";
import { loadFromStorage, saveToStorage } from "./storage";
import { showNotification, openModal, closeModal, buildCard, renderPagination } from "./ui";

const PAGE_SIZE = 10;
let savedCities: string[] = loadFromStorage();
let currentPage = 1;
let searchQuery = "";

async function renderList(): Promise<void> {
  const list = document.getElementById("forecastList")!;
  list.innerHTML = `<p class="has-text-grey has-text-centered">Loading...</p>`;

  const filtered = savedCities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    list.innerHTML = `<p class="has-text-grey has-text-centered">No forecasts added yet.</p>`;
    renderPagination(0, currentPage, (page) => { currentPage = page; renderList(); });
    return;
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (currentPage > totalPages) currentPage = totalPages;
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const results = await Promise.allSettled(
    paginated.map((city) => fetchWeather(city))
  );

  let html = "";
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      html += buildCard(result.value);
    } else {
      html += `<div class="notification is-warning is-light">Could not load: ${paginated[i]}</div>`;
    }
  });

  list.innerHTML = html;
  renderPagination(totalPages, currentPage, (page) => { currentPage = page; renderList(); });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = (btn as HTMLElement).dataset.city!;
      savedCities = savedCities.filter((c) => c !== city);
      saveToStorage(savedCities);
      showNotification(`"${city}" removed.`, "danger");
      renderList();
    });
  });
}

document.getElementById("openModalBtn")!.addEventListener("click", openModal);
document.getElementById("closeModalBtn")!.addEventListener("click", closeModal);
document.getElementById("cancelModalBtn")!.addEventListener("click", closeModal);

document.getElementById("addForecastBtn")!.addEventListener("click", async () => {
  const input = document.getElementById("modalSearchInput") as HTMLInputElement;
  const query = input.value.trim();
  if (!query) return;

  try {
    const data = await fetchWeather(query);
    const cityName = data.name;

    if (savedCities.includes(cityName)) {
      document.getElementById("modalNotification")!.innerHTML =
        `<p class="has-text-warning"> "${cityName}" already added.</p>`;
      return;
    }

    savedCities.push(cityName);
    saveToStorage(savedCities);
    closeModal();
    showNotification(`"${cityName}" added successfully!`, "success");
    renderList();
  } catch (error) {
    document.getElementById("modalNotification")!.innerHTML =
      `<p class="has-text-danger">City not found. Try again.</p>`;
  }
});

document.getElementById("searchBar")!.addEventListener("input", (e) => {
  searchQuery = (e.target as HTMLInputElement).value;
  currentPage = 1;
  renderList();
});

setInterval(() => {
  if (savedCities.length > 0) renderList();
}, 60000);

renderList();
