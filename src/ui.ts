import type { WeatherData } from "./types";

export function showNotification(message: string, type: "success" | "danger"): void {
  const zone = document.getElementById("notifications")!;
  const div = document.createElement("div");
  div.className = `notification is-${type} is-light`;
  div.innerHTML = `<button class="delete"></button>${message}`;
  div.querySelector(".delete")!.addEventListener("click", () => div.remove());
  zone.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

export function openModal(): void {
  document.getElementById("addModal")!.classList.add("is-active");
  (document.getElementById("modalSearchInput") as HTMLInputElement).value = "";
  document.getElementById("modalNotification")!.innerHTML = "";
}

export function closeModal(): void {
  document.getElementById("addModal")!.classList.remove("is-active");
}

export function buildCard(data: WeatherData): string {
  const iconCode = data.weather[0].icon.replace('n', 'd');
  const icon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  return `
    <div class="card mb-4">
      <div class="card-content">
        <div class="columns is-vcentered">
          <div class="column is-narrow">
            <img src="${icon}" alt="${data.weather[0].description}" width="80"/>
          </div>
          <div class="column">
            <p class="title is-4">${data.name}, ${data.sys.country}</p>
            <p class="subtitle is-6 has-text-grey">${data.weather[0].description}</p>
            <div class="tags">
              <span class="tag is-info is-light">
                <span class="icon"><i class="fas fa-temperature-half"></i></span>
                <span>${data.main.temp}°C</span>
              </span>
              <span class="tag is-primary is-light">
                <span class="icon"><i class="fas fa-droplet"></i></span>
                <span>${data.main.humidity}%</span>
              </span>
              <span class="tag is-warning is-light">
                <span class="icon"><i class="fas fa-wind"></i></span>
                <span>${data.wind.speed} m/s</span>
              </span>
              <span class="tag is-danger is-light">
                <span class="icon"><i class="fas fa-gauge"></i></span>
                <span>${data.main.pressure} hPa</span>
              </span>
              <span class="tag is-light">
                <span class="icon"><i class="fas fa-sun"></i></span>
                <span>Sunrise: ${sunrise}</span>
              </span>
              <span class="tag is-light">
                <span class="icon"><i class="fas fa-moon"></i></span>
                <span>Sunset: ${sunset}</span>
              </span>
            </div>
          </div>
          <div class="column is-narrow">
            <button class="button is-danger is-light remove-btn" data-city="${data.name}">
              <span class="icon"><i class="fas fa-trash"></i></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderPagination(
  totalPages: number,
  currentPage: number,
  onPageChange: (page: number) => void
): void {
  const nav = document.getElementById("pagination")!;
  if (totalPages <= 1) { nav.innerHTML = ""; return; }

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<a class="pagination-link ${i === currentPage ? "is-current" : ""}" data-page="${i}">${i}</a>`;
  }
  nav.innerHTML = html;

  nav.querySelectorAll(".pagination-link").forEach((link) => {
    link.addEventListener("click", () => {
      onPageChange(parseInt((link as HTMLElement).dataset.page!));
    });
  });
}