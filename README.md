# Weather App

A weather forecast application built with TypeScript and Vite.

## Features

- Add weather forecasts by city name, ZIP code or coordinates
- Search through added forecasts
- Remove forecasts
- Pagination (10 records per page)
- Data is automatically updated every 60 seconds
- Data caching
- Forecasts are saved in localStorage

## Requirements

- Node.js v20.19.0 or higher
- npm

## Setup

1. Clone the repository:
   git clone https://github.com/emika7/weather-app.git

2. Go to the project folder:
   cd weather-app

3. Install dependencies:
   npm install

4. Create a .env file in the root folder:
   VITE_API_KEY=your_api_key_here

5. Get your free API key from https://openweathermap.org/ and add it to the .env file

## Development

To run the app in development mode:

   npm run dev

Then open http://localhost:5173 in your browser.

## Production

1. Build the project:
   npm run build

2. Start the server:
   npm run serve

3. Open http://localhost:8080 in your browser.