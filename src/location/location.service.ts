/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';
import { IAddLocation, IUpdateLocation } from 'src/core/interface/request_body';
import { LocationModel } from 'src/db_migrations/models/location.model';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationModel)
    private locationRepository: Repository<LocationModel>,
  ) {}
  async addLocation(body: IAddLocation) {
    try {
      return {
        data: body,
        status: StatusCodes.OK,
      };
      // Todo: Add Exceptions Available by nest
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async getAllLocations() {
    try {
      return {
        status: StatusCodes.OK,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async getLocationById(id: string) {
    try {
      return {
        id,
        status: StatusCodes.OK,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async deleteLocation(id: string) {
    try {
      return {
        id,
        status: StatusCodes.OK,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async updateLocation(id: string, body: IUpdateLocation) {
    try {
      return {
        id,
        body,
        status: StatusCodes.OK,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
