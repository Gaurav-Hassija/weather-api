/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        is_active: true,
      };

      await this.locationRepository.save(addLocationPayload);

      return {
        message: 'Location inserted successfully',
        code: StatusCodes.CREATED,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response);
    }
  }

  async getAllLocations() {
    try {
      // Get all locations where is_deleted is false
      const allLocations: LocationModel[] = await this.locationRepository.find({
        where: { is_deleted: false },
      });

      // transform payload
      const locationDetails = await transformLocationData(allLocations);

      return {
        code: StatusCodes.OK,
        message: 'All Locations',
        data: locationDetails,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response);
    }
  }

  async getLocationById(id: number) {
    try {
      const existingLocation = await this.locationRepository.findOne({
        where: { id: id.toString() },
      });

      if (!existingLocation) {
        throw new BadRequestException(`Invalid location id : ${id} `);
      }

      // transform payload
      const locationDetail = await transformLocationData(existingLocation);

      return {
        code: StatusCodes.OK,
        message: 'Location Details',
        data: locationDetail,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response);
    }
  }

  async deleteLocation(id: number) {
    try {
      // check if location exists
      const existingLocation = await this.locationRepository.findOne({
        where: { id: id.toString() },
      });

      if (!existingLocation) {
        throw new BadRequestException(`Invalid id to delete : ${id}`);
      }

      // delete the location
      await this.locationRepository.update(
        {
          id: id.toString(),
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
      throw new InternalServerErrorException(error.response);
    }
  }

  async updateLocation(id: number, body: IUpdateLocation) {
    try {
      const existingLocation = await this.locationRepository.findOne({
        where: { id: id.toString() },
      });
      if (!existingLocation) {
        throw new BadRequestException(`Invalid location id : ${id} `);
      }

      const { name, latitude, longitude } = body;

      const locationPayloadToUpdate: Partial<LocationModel> = {};
      if (name) {
        locationPayloadToUpdate.name = name;
      }
      if (latitude) {
        locationPayloadToUpdate.latitude = latitude.toString();
      }
      if (longitude) {
        locationPayloadToUpdate.longitude = longitude.toString();
      }

      await this.locationRepository.update(
        {
          id: id.toString(),
        },
        locationPayloadToUpdate,
      );

      return {
        message: 'Location updated successfully',
        code: StatusCodes.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.response);
    }
  }
}
