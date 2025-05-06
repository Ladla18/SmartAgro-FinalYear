import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  CloudLightning,
  CloudDrizzle,
  MapPin,
} from "lucide-react";
import { BackButton } from "../components/BackButton";
import { Button } from "../components/ui/Button";
import { toast } from "react-hot-toast";

const WeatherForecasting = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState("26.6865");
  const [longitude, setLongitude] = useState("84.1778");
  const [locationLoading, setLocationLoading] = useState(false);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          toast.success("Location updated successfully!");
          setLocationLoading(false);
          // Trigger weather data fetch with new coordinates
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to get your location. Please try again.");
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLocationLoading(false);
    }
  };

  const fetchWeatherData = async (lat = latitude, lon = longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5e0c0cc41111ae0df99b863d841cfba6`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Failed to load weather data");
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Convert Kelvin to Celsius
  const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  // Get weather icon based on weather code
  const getWeatherIcon = (weatherCode) => {
    switch (true) {
      case weatherCode >= 200 && weatherCode < 300:
        return <CloudLightning className="w-12 h-12 text-yellow-500" />;
      case weatherCode >= 300 && weatherCode < 400:
        return <CloudDrizzle className="w-12 h-12 text-blue-400" />;
      case weatherCode >= 500 && weatherCode < 600:
        return <CloudRain className="w-12 h-12 text-blue-500" />;
      case weatherCode >= 600 && weatherCode < 700:
        return <Cloud className="w-12 h-12 text-gray-400" />;
      case weatherCode === 800:
        return <Sun className="w-12 h-12 text-yellow-500" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-500" />;
    }
  };

  // Get farming tips based on weather
  const getFarmingTips = (weather) => {
    const code = weather[0].id;
    const temp = weather.temp;

    if (code >= 200 && code < 300) {
      return [
        "• Take shelter and avoid open fields",
        "• Protect livestock from thunderstorms",
        "• Check for any damage after storm",
      ];
    } else if (code >= 500 && code < 600) {
      return [
        "• Avoid spraying pesticides",
        "• Check drainage systems",
        "• Protect harvested crops from moisture",
      ];
    } else if (code === 800 && temp > 30) {
      return [
        "• Water crops early morning or evening",
        "• Use mulching to retain moisture",
        "• Monitor for heat stress in plants",
      ];
    } else {
      return [
        "• Good conditions for general farming",
        "• Monitor soil moisture",
        "• Regular crop inspection advised",
      ];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  const currentWeather = weatherData.list[0];
  const next5Days = weatherData.list
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-center text-green-800">
          Weather Forecast for {weatherData?.city?.name || "Loading..."}
        </h1>
        <Button
          onClick={getCurrentLocation}
          disabled={locationLoading}
          className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          {locationLoading ? (
            <>
              <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              Updating Location...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Use Current Location
            </>
          )}
        </Button>
      </div>

      {/* Today's Weather */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-green-50">
        <h2 className="text-xl font-semibold mb-4">Today's Weather</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
            <Thermometer className="w-10 h-10 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold">
                {kelvinToCelsius(currentWeather.main.temp)}°C
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
            <Droplets className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-2xl font-bold">
                {currentWeather.main.humidity}%
              </p>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
            <Wind className="w-10 h-10 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="text-2xl font-bold">
                {Math.round(currentWeather.wind.speed * 3.6)} km/h
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Farming Tips */}
      <Card className="p-6 mb-8 bg-green-50">
        <h2 className="text-xl font-semibold mb-4">Today's Farming Tips</h2>
        <div className="space-y-3">
          {getFarmingTips(currentWeather.weather).map((tip, index) => (
            <p key={index}>{tip}</p>
          ))}
        </div>
      </Card>

      {/* 5-Day Forecast */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {next5Days.map((day, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              <p className="font-semibold mb-2">
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
              {getWeatherIcon(day.weather[0].id)}
              <p className="text-lg font-bold mt-2">
                {kelvinToCelsius(day.main.temp)}°C
              </p>
              <div className="mt-2 flex items-center justify-center space-x-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{day.main.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Support both named and default exports
export { WeatherForecasting };
export default WeatherForecasting;
