const STORAGE_KEY = "weatherCities";

export function loadFromStorage(): string[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveToStorage(cities: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}