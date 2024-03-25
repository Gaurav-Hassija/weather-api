/* eslint-disable @typescript-eslint/no-unused-vars */
import { TEMPRATURE_UNIT, WIND_UNIT } from 'src/constants/weather_constant';
import {
  IDay,
  IForecast,
  IForecastday,
  IHour,
  IWeather,
  IWeatherHistory,
} from 'src/core/interface/weather_api';

export const transformWeatherData = (weatherData: IWeather) => {
  return {
    location: {
      name: weatherData.location.name,
      region: weatherData.location.region,
      country: weatherData.location.country,
      lat: weatherData.location.lat,
      lon: weatherData.location.lon,
    },
    current: {
      date_time_epoch: weatherData.current.last_updated_epoch,
      date_time_string: weatherData.current.last_updated,
      temprature: weatherData.current.temp_c,
      temprature_unit: TEMPRATURE_UNIT,
      wind_speed: weatherData.current.wind_kph,
      wind_unit: WIND_UNIT,
      wind_direction: weatherData.current.wind_dir,
      humidity: weatherData.current.humidity,
    },
    forecast: transformForecastData(weatherData.forecast),
  };
};

export const transformWeatherHistoryData = (weatherData: IWeatherHistory) => {
  return {
    location: {
      name: weatherData.location.name,
      region: weatherData.location.region,
      country: weatherData.location.country,
      lat: weatherData.location.lat,
      lon: weatherData.location.lon,
    },
    summary: summarizeData(
      weatherData.forecast.forecastday,
      weatherData.forecast.forecastday.length,
    ),
    history_forecast: transformForecastData(weatherData.forecast),
  };
};

const transformForecastData = (forecastData: IForecast) => {
  const forecast = forecastData.forecastday.map((forecastDay) => {
    return {
      day: {
        max_temprature: forecastDay.day.maxtemp_c,
        min_temprature: forecastDay.day.mintemp_c,
        avg_temprature: forecastDay.day.avgtemp_c,
        temprature_unit: TEMPRATURE_UNIT,
        max_wind: forecastDay.day.maxwind_kph,
        wind_unit: WIND_UNIT,
        avg_humidity: forecastDay.day.avghumidity,
      },
      astro: {
        sunrise: forecastDay.astro.sunrise,
        sunset: forecastDay.astro.sunset,
        moonrise: forecastDay.astro.moonrise,
        moonset: forecastDay.astro.moonset,
        moon_phase: forecastDay.astro.moon_phase,
      },
      hourly_data: transformForecastHourlyData(forecastDay.hour),
    };
  });
  return forecast;
};

const transformForecastHourlyData = (forecastHour: Array<IHour>) => {
  const hourlyData = forecastHour.map((hour) => {
    return {
      date_time_epoch: hour.time_epoch,
      date_time_string: hour.time,
      temprature: hour.temp_c,
      temprature_unit: TEMPRATURE_UNIT,
      wind_speed: hour.wind_kph,
      wind_unit: WIND_UNIT,
      wind_direction: hour.wind_dir,
      humidity: hour.humidity,
    };
  });

  return hourlyData;
};

const summarizeData = (forecastDay: Array<IForecastday>, length: number) => {
  let maxTempAvg = 0;
  let minTempAvg = 0;
  let aggTempAvg = 0;
  let windSpeedAvg = 0;
  let humidityAvg = 0;

  for (const day of forecastDay) {
    maxTempAvg += day.day.maxtemp_c;
    minTempAvg += day.day.mintemp_c;
    aggTempAvg += day.day.avgtemp_c;
    windSpeedAvg += day.day.maxwind_kph;
    humidityAvg += day.day.avghumidity;
  }
  return {
    average_max_temprature: (maxTempAvg / length).toFixed(2),
    average_min_temprature: (minTempAvg / length).toFixed(2),
    average_aggregated_temparture: (aggTempAvg / length).toFixed(2),
    avergae_max_wind_speed: (windSpeedAvg / length).toFixed(2),
    average_humidity: (humidityAvg / length).toFixed(2),
  };
};

export const getForecastExpiry = (epoch: number) => {
  const expiryDate = new Date(epoch * 1000);
  console.log(expiryDate);
  expiryDate.setMinutes(expiryDate.getMinutes() + 15);
  console.log(expiryDate);
  return expiryDate.getTime() - new Date().getTime();
};

export const getHistoryExpiry = () => {
  const expiryDate = new Date();
  expiryDate.setHours(23);
  expiryDate.setMinutes(59);
  expiryDate.setSeconds(59);
  expiryDate.setMilliseconds(999);

  return expiryDate.getTime() - new Date().getTime();
};
