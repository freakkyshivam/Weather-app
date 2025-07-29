const button = document.getElementById("getWeather");
const input = document.getElementById("city");
const loader = document.querySelector(".loader");
const resultBox = document.getElementById("weatherResult");
const forecastBox = document.getElementById("forecastResult");
const nearbyCitiesBox = document.getElementById("nearbyCities");
const hourlyBox = document.getElementById("hourlyForecast");
const refreshBtn = document.getElementById("refreshBtn");

// const API_KEY= process.env.API_KEY ;

const getCurrentWeather = async (city) => {
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`;
  const res = await fetch(url);
  return await res.json();
};

const getForecast = async (city) => {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=14&aqi=no&alerts=no`;
  const response = await fetch(url);
  return await response.json();
};

const displayWeather = (data) => {
  resultBox.innerHTML = `
    <div class="weather-info">
      <h2>${data.location.name}, ${data.location.country}</h2>
      <p><img src="${data.current.condition.icon}" alt="icon" /> ${data.current.condition.text}</p>
      <h2>${data.current.temp_c} °C</h2>
      <p>Feels like: ${data.current.feelslike_c} °C</p>
      <div class="grid">
        <div><strong>Humidity:</strong> ${data.current.humidity}%</div>
        <div><strong>Wind:</strong> ${data.current.wind_kph} kph</div>
        <div><strong>Pressure:</strong> ${data.current.pressure_mb} mb</div>
        <div><strong>UV Index:</strong> ${data.current.uv}</div>
      </div>
    </div>
  `;
};

const displayForecast = (forecast) => {
  forecastBox.innerHTML = `<div class="forecast-grid">`;
  forecast.forecast.forecastday.forEach(day => {
    forecastBox.innerHTML += `
      <div class="forecast-day">
        <p><strong>${day.date}</strong></p>
        <img src="${day.day.condition.icon}" alt="icon">
        <p>${day.day.avgtemp_c} °C</p>
        <p>${day.day.condition.text}</p>
      </div>`;
  });
  forecastBox.innerHTML += `</div>`;
};

 

const showNearbyCities = async (cities) => {
  nearbyCitiesBox.innerHTML = "<h3>Nearby Cities (°C)</h3><div class='city-temps'>";
  for (const city of cities) {
    try {
      const data = await getCurrentWeather(city);
      nearbyCitiesBox.innerHTML += `<div>${city}: ${data.current.temp_c}°C</div>`;
    } catch (err) {
      nearbyCitiesBox.innerHTML += `<div>${city}: ❌</div>`;
    }
  }
  nearbyCitiesBox.innerHTML += "</div>";
};

const showWeather = async (city) => {
  if (!city) return;
  loader.style.display = "block";
  resultBox.innerHTML = forecastBox.innerHTML  = nearbyCitiesBox.innerHTML = "";

  try {
    const current = await getCurrentWeather(city);
    const forecast = await getForecast(city);
    loader.style.display = "none";
    refreshBtn.style.display = "block";
    displayWeather(current);
    displayForecast(forecast);
    showNearbyCities(["Lucknow", "Kanpur", "New Delhi", "Agra", "Noida"]);
  } catch (err) {
    loader.style.display = "none";
    forecastBox.style.display = "none";
    resultBox.innerHTML = `<p style="color:red;">❌ Failed to fetch weather data.</p>`;
  }
};

button.addEventListener("click", () => showWeather(input.value.trim()));
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") showWeather(input.value.trim());
});

refreshBtn.addEventListener("click", () => {
  resultBox.innerHTML = `<p>📍 Fetching location...</p>`;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        showWeather(`${lat},${lon}`);
      },
      (err) => {
        resultBox.innerHTML = `<p style="color:red;">⚠️ Location error: ${err.message}</p>`;
      }
    );
  } else {
    resultBox.innerHTML = `<p style="color:red;">❌ Geolocation not supported.</p>`;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  resultBox.innerHTML = `<p>📍 Fetching location...</p>`;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        showWeather(`${lat},${lon}`);
      },
      (err) => {
        resultBox.innerHTML = `<p style="color:red;">⚠️ Location permission denied. You can still search by city name.</p>`;
      }
    );
  } else {
    resultBox.innerHTML = `<p style="color:red;">❌ Geolocation not supported by your browser.</p>`;
  }
});


