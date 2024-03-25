/* eslint-disable @typescript-eslint/no-unused-vars */
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';
import { LocationModel } from 'src/db_migrations/models/location.model';
import { WeatherApiService } from 'src/external_service/weather.service';
import {
  getForecastExpiry,
  getHistoryExpiry,
  transformWeatherData,
  transformWeatherHistoryData,
} from 'src/helper/weather-service';

import { Repository } from 'typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(LocationModel)
    private locationRepository: Repository<LocationModel>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly weatherApiService: WeatherApiService,
    private readonly logger: Logger,
  ) {}

  async getHistory(id: number, days: number) {
    try {
      // check if location exists
      const existingLocation = await this.locationRepository.findOne({
        where: { id },
      });
      if (!existingLocation) {
        throw new BadRequestException('Location does not exists');
      }

      // check if data is already cached
      const cachedHistoryData = await this.cacheManager.get<
        ReturnType<typeof transformWeatherHistoryData>
      >(`${id}_${days}`);

      // if cached data is not present make an api call
      const weatherHistoryData: ReturnType<typeof transformWeatherHistoryData> =
        cachedHistoryData ??
        (await this.weatherApiService.historyData(
          existingLocation.latitude,
          existingLocation.longitude,
          days,
        ));

      // Set the new api response to cache
      if (!cachedHistoryData) {
        await this.cacheManager.set(
          `${id}_${days}`,
          weatherHistoryData,
          getHistoryExpiry(),
        );
      }

      return {
        code: StatusCodes.OK,
        message: 'History forecast along with summary',
        data: weatherHistoryData,
      };
    } catch (error) {
      this.logger.error(`Error - ${JSON.stringify(error.response)}`);
      throw new InternalServerErrorException(error.response);
    }
  }

  async getForecast(id: number) {
    try {
      // check if location exists
      const existingLocation = await this.locationRepository.findOne({
        where: { id },
      });
      if (!existingLocation) {
        throw new BadRequestException('Location does not exists');
      }

      // check if data is already cached
      const cachedWeatherData = await this.cacheManager.get<
        ReturnType<typeof transformWeatherData>
      >(`${id}`);

      // if cached data is not present make an api call
      const weatherData: ReturnType<typeof transformWeatherData> =
        cachedWeatherData ??
        (await this.weatherApiService.forecastData(
          existingLocation.latitude,
          existingLocation.longitude,
        ));

      // Set the new api response to cache
      if (!cachedWeatherData) {
        await this.cacheManager.set(
          `${id}`,
          weatherData,
          getForecastExpiry(weatherData.current.date_time_epoch),
        );
      }
      return {
        code: StatusCodes.OK,
        message: 'Weather forcast details',
        data: weatherData,
      };
    } catch (error) {
      this.logger.error(`Error - ${JSON.stringify(error.response)}`);
      throw new InternalServerErrorException(error.response);
    }
  }
}
