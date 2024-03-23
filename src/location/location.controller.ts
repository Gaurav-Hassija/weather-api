import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { LocationService } from './location.service';
import { IAddLocation, IUpdateLocation } from 'src/core/interface/request_body';
import { addLocationValidator } from 'src/core/validator/request-body-validator';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async addLocation(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IAddLocation,
  ) {
    await addLocationValidator(body);
    const response = await this.locationService.addLocation(body);

    return res.status(StatusCodes.OK).send(response);
  }

  @Get()
  async getAllLocations(@Req() req: Request, @Res() res: Response) {
    const response = await this.locationService.getAllLocations();
    return res.status(StatusCodes.OK).send(response);
  }

  @Get(':id')
  async getLocationById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const response = await this.locationService.getLocationById(id);
    return res.status(StatusCodes.OK).send(response);
  }

  @Delete(':id')
  async deleteLocation(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const response = await this.locationService.deleteLocation(id);
    return res.status(StatusCodes.OK).send(response);
  }

  @Patch(':id')
  async updateLocation(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IUpdateLocation,
    @Param('id') id: string,
  ) {
    const response = await this.locationService.updateLocation(id, body);
    return res.status(StatusCodes.OK).send(response);
  }
}
