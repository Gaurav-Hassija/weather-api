import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LocationService } from './location.service';
import { IAddLocation, IUpdateLocation } from 'src/core/interface/request_body';
import {
  addLocationValidator,
  updateLocationValidator,
} from 'src/core/validator/request-body-validator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async addLocation(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IAddLocation,
  ) {
    this.logger.log(`Api requested : ${req.originalUrl}`);
    this.logger.log(`Request Body : ${body}`);
    await addLocationValidator(body);
    const response = await this.locationService.addLocation(body);
    this.logger.log(`Response Data : ${JSON.stringify(response)}`);
    return res.send(response);
  }

  @Get()
  async getAllLocations(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`Api requested : ${req.originalUrl}`);
    const response = await this.locationService.getAllLocations();
    this.logger.log(`Response Data : ${JSON.stringify(response)}`);
    return res.send(response);
  }

  @Get(':id')
  async getLocationById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    this.logger.log(`Api requested : ${req.originalUrl}`);
    this.logger.log(`Request Params : ${id}`);
    const response = await this.locationService.getLocationById(id);
    this.logger.log(`Response Data : ${JSON.stringify(response)}`);
    return res.send(response);
  }

  @Delete(':id')
  async deleteLocation(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    this.logger.log(`Api requested : ${req.originalUrl}`);
    this.logger.log(`Request Params : ${id}`);
    const response = await this.locationService.deleteLocation(id);
    this.logger.log(`Response Data : ${JSON.stringify(response)}`);
    return res.send(response);
  }

  @Patch(':id')
  async updateLocation(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IUpdateLocation,
    @Param('id') id: number,
  ) {
    this.logger.log(`Api requested : ${req.originalUrl}`);
    this.logger.log(`Request Body : ${body}`);
    this.logger.log(`Request Params : ${id}`);
    await updateLocationValidator(body);
    const response = await this.locationService.updateLocation(id, body);
    this.logger.log(`Response Data : ${JSON.stringify(response)}`);
    return res.send(response);
  }
}
