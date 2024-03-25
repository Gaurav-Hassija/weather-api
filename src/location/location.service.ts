/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';
import { IAddLocation, IUpdateLocation } from 'src/core/interface/request_body';
import { LocationModel } from 'src/db_migrations/models/location.model';
import { transformLocationData } from 'src/helper/location-service';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationModel)
    private locationRepository: Repository<LocationModel>,
    private readonly logger: Logger,
  ) {}
  async addLocation(body: IAddLocation) {
    try {
      const { name, latitude, longitude } = body;

      // Check if name, latitude or longitude already exists in DB
      const existingLocation = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.name = :name', { name })
        .orWhere('location.latitude = :latitude', { latitude })
        .orWhere('location.longitude = :longitude', { longitude })
        .getMany();

      if (existingLocation.length > 0) {
        throw new BadRequestException(
          'Location with provided name, latitude or longitude already exists',
        );
      }

      // Insert new location in DB
      const addLocationPayload: Partial<LocationModel> = {
        name,
        latitude: latitude,
        longitude: longitude,
        is_active: true,
      };

      const newLocation =
        await this.locationRepository.save(addLocationPayload);

      return {
        message: 'Location inserted successfully',
        code: StatusCodes.CREATED,
        data: transformLocationData(newLocation),
      };
    } catch (error) {
      this.logger.error(`Error - ${JSON.stringify(error.response)}`);
      throw new InternalServerErrorException(error.response);
    }
  }

  async getAllLocations() {
    try {
      // Get all locations where is_deleted is false
      const allLocations: LocationModel[] = await this.locationRepository.find({
        where: { is_deleted: false, is_active: true },
      });

      return {
        code: StatusCodes.OK,
        message: 'All Locations',
        data: transformLocationData(allLocations),
      };
    } catch (error) {
      this.logger.error(`Error - ${JSON.stringify(error.response)}`);
      throw new InternalServerErrorException(error.response);
    }
  }

  async getLocationById(id: number) {
    try {
      const existingLocation = await this.locationRepository.findOne({
        where: { id },
      });

      if (!existingLocation) {
        throw new BadRequestException(`Invalid location id : ${id} `);
      }

      return {
        code: StatusCodes.OK,
        message: 'Location Details',
        data: transformLocationData(existingLocation),
      };
    } catch (error) {
      this.logger.error(`Error - ${JSON.stringify(error.response)}`);
      throw new InternalServerErrorException(error.response);
    }
  }

  async deleteLocation(id: number) {
    try {
      // check if location exists
      const existingLocation = await this.locationRepository.findOne({
        where: { id },
      });

      if (!existingLocation) {
        throw new BadRequestException(`Invalid id to delete : ${id}`);
      }

      // delete the location
      await this.locationRepository.update(
        {
          id,
        },
        {
          is_deleted: true,
        },
      );

      return {
        message: 'Location deleted successfully',
        code: StatusCodes.OK,
      };
    } catch (error) {
      this.logger.error(`Error - ${JSON.stringify(error.response)}`);
      throw new InternalServerErrorException(error.response);
    }
  }

  async updateLocation(id: number, body: IUpdateLocation) {
    try {
      // check if location already exists
      const existingLocation = await this.locationRepository.findOne({
        where: { id },
      });
      if (!existingLocation) {
        throw new BadRequestException(`Invalid location id : ${id} `);
      }

      const { name, latitude, longitude } = body;

      // create updated payload for the data to be updated
      const locationPayloadToUpdate: Partial<LocationModel> = {};
      if (name) {
        locationPayloadToUpdate.name = name;
      }
      if (latitude) {
        locationPayloadToUpdate.latitude = latitude;
      }
      if (longitude) {
        locationPayloadToUpdate.longitude = longitude;
      }

      // update new data in DB
      await this.locationRepository.update(
        {
          id,
        },
        locationPayloadToUpdate,
      );

      const updatedLocation = await this.locationRepository.findOne({
        where: { id },
      });

      return {
        message: 'Location updated successfully',
        code: StatusCodes.OK,
        data: transformLocationData(updatedLocation),
      };
    } catch (error) {
      this.logger.error(`Error - ${JSON.stringify(error.response)}`);
      throw new InternalServerErrorException(error.response);
    }
  }
}
