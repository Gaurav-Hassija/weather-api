import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { LocationModel } from 'src/db_migrations/models/location.model';
import { DbModule } from 'src/core/database/db.module';
import { WeatherApiService } from 'src/external_service/weather.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([LocationModel]),
    CacheModule.register(),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherApiService, Logger],
})
export class WeatherModule {}
