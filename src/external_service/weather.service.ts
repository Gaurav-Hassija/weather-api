import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import {
  FORECAST_API_NAME,
  FORECAST_DAY,
  HISTORY_API_NAME,
} from 'src/constants/weather_constant';
import { IWeather, IWeatherHistory } from 'src/core/interface/weather_api';
import {
  transformWeatherData,
  transformWeatherHistoryData,
} from 'src/helper/weather-service';

@Injectable()
export class WeatherApiService {
  constructor(private readonly logger: Logger) {}
  async forecastData(latitude: number, longitude: number) {
    try {
      const url = `${process.env.WEATHER_API_BASE_URL}/${process.env.WEATHER_API_VERSION}/${FORECAST_API_NAME}`;

      const requestParams = {
        q: `${latitude},${longitude}`,
        days: FORECAST_DAY,
      };
      this.logger.log(`Weather Forecast Url - ${url}`);
      this.logger.log(`Query Params - ${JSON.stringify(requestParams)} `);

      const response = await axios.get(url, {
        params: requestParams,
      });
      const weatherData: IWeather = response.data;
      this.logger.log(`Response Forecast Api - ${JSON.stringify(weatherData)}`);

      const transformedWeatherData = transformWeatherData(weatherData);
      return transformedWeatherData;
    } catch (error) {
      this.logger.error(
        `Message - ${error.response.data.error.message} Status - ${error.response.status}`,
      );
      throw new InternalServerErrorException({
        message: `We're sorry, but we're currently unable to fulfill your request. Please try again later.`,
      });
    }
  }


  async historyData(latitude: number, longitude: number, days: number) {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      let startDate;
      if (days > 1) {
        startDate = new Date(
          new Date().getTime() - (days - 1) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0];
      } else {
        startDate = endDate;
      }

      const url = `${process.env.WEATHER_API_BASE_URL}/${process.env.WEATHER_API_VERSION}/${HISTORY_API_NAME}`;

      const requestParams = {
        q: `${latitude},${longitude}`,
        dt: startDate,
        end_dt: endDate,
        key: `${process.env.WEATHER_API_KEY}`,
      };
      this.logger.log(`Weather History Url - ${url}`);
      this.logger.log(`Query Params - ${JSON.stringify(requestParams)}`);

      const response = await axios.get(url, {
        params: requestParams,
      });
      const weatherHistoryDatadata: IWeatherHistory = response.data;
      this.logger.log(
        `Response History Api - ${JSON.stringify(weatherHistoryDatadata)}`,
      );

      const transformedHistoryData = transformWeatherHistoryData(
        weatherHistoryDatadata,
      );
      return transformedHistoryData;
    } catch (error) {
      this.logger.error(
        `Message - ${error.response.data.error.message} Status - ${error.response.status}`,
      );
      throw new InternalServerErrorException({
        message: `We're sorry, but we're currently unable to fulfill your request. Please try again later.`,
      });
    }
  }
}
