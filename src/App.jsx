import { useEffect, useState } from "react";
import "./App.css";

import Search from "./assets/search.png";
import Clear from "./assets/sun.webp";
import Cloud from "./assets/suncloud.jpg";
import Drizzle from "./assets/drizzle.png";
import Humitity from "./assets/humitity.png";
import Rain from "./assets/rain.jpg";
import Snow from "./assets/snow.jpg";
import Wind from "./assets/wind.jpg";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humitity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>

      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>

        <div>
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={Humitity} alt="Humitity" className="icon" />
          <div className="data">
            <div className="humitity-percent">{humitity}%</div>
            <div className="text">Humitity</div>
          </div>
        </div>

        <div className="element">
          <img src={Wind} alt="Wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind}Km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const [text, setText] = useState("Chennai");

  const [icon, setIcon] = useState(Snow);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("0");
  const [log, setLog] = useState("0");
  const [humitity, setHumitity] = useState("0");
  const [wind, setWind] = useState("0");

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": Clear,
    "01n": Clear,
    "02d": Cloud,
    "02n": Cloud,
    "03d": Drizzle,
    "03n": Drizzle,
    "04d": Drizzle,
    "04n": Drizzle,
    "09d": Rain,
    "09n": Rain,
    "10d": Rain,
    "10n": Rain,
    "13d": Snow,
    "13n": Snow,
    
  };

  

  const search = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);

      if (data.cod === "404") {
        console.error("City not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumitity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || Clear);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred : ", error.message);
      setError("An error occurred while fetching weather data.");

    } finally {
      setLoading(false)
    }
  };

  const handleCity = (e) => { 
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  // useEffect(function () {
  //   search();
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={() => search()}>
            <img src={Search} alt="Search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading.....</div>}
        {error && <div className="error-message">{error}</div>}

        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        {!loading && !cityNotFound && <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          log={log}
          humitity={humitity}
          wind={wind}
        />}

        <p className="copyright">
          Designed by <span>Keerthi</span>
        </p>
      </div>
    </>
  );
}

export default App;
