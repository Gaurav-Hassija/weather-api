import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { WeatherService } from './weather.service';
import {
  forecastHistory,
  forecastWeather,
} from 'src/core/validator/request-body-validator';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly logger: Logger,
  ) {}

  @Get(':id')
  async getForcast(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    this.logger.log(`Api requested : ${req.originalUrl}`);
    this.logger.log(`Request Params : ${id}`);
    await forecastWeather(req.params);
    const response = await this.weatherService.getForecast(id);
    this.logger.log(`Response Data : ${JSON.stringify(response)}`);
    return res.send(response);
  }
  @Get(':id/history')
  async getHistory(
    @Req() req: Request,
    @Res() res: Response,
    @Query('days') days: number,
    @Param('id') id: number,
  ) {
    this.logger.log(`Api requested : ${req.originalUrl}`);
    this.logger.log(`Request Params : ${id}`);
    this.logger.log(`Request Query Params : ${days}`);
    await forecastWeather(req.params);
    await forecastHistory(req.query);
    const response = await this.weatherService.getHistory(id, days);
    this.logger.log(`Response Data : ${JSON.stringify(response)}`);
    return res.send(response);
  }
}
