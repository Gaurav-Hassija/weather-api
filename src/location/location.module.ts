import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { LocationModel } from 'src/db_migrations/models/location.model';
import { DbModule } from 'src/core/database/db.module';

@Module({
  imports: [DbModule, TypeOrmModule.forFeature([LocationModel])],
  controllers: [LocationController],
  providers: [LocationService, Logger],
})
export class LocationModule {}
