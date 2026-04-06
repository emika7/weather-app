import axios from "axios";
import type { CacheEntry, WeatherData } from "./types";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE = "https://api.openweathermap.org/data/2.5/weather";
const CACHE_TTL = 60000;

const cache = new Map<string, CacheEntry>();

const http = {
  async get(url: string, config: any) {
    const key = JSON.stringify(config.params);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < CACHE_TTL) {
      return { data: cached.data };
    }
    const response = await axios.get(url, config);
    cache.set(key, { data: response.data, time: Date.now() });
    return response;
  }
};

export async function fetchWeather(query: string): Promise<WeatherData> {
  let params: any = { appid: API_KEY, units: "metric" };

  if (/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(query.trim())) {
    const [lat, lon] = query.split(",");
    params.lat = lat.trim();
    params.lon = lon.trim();
  } else if (/^\d{4,10}/.test(query.trim())) {
    params.zip = query.trim();
  } else {
    params.q = query.trim();
  }

  const response = await http.get(API_BASE, { params });
  return response.data;
}