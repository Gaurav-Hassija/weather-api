import { LocationModel } from 'src/db_migrations/models/location.model';

export const transformLocationData = (
  location: LocationModel | LocationModel[],
) => {
  if (Array.isArray(location)) {
    const locationDetails = location.map((location) => {
      return {
        id: location.id,
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        active: location.is_active,
      };
    });
    return locationDetails;
  } else {
    return {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      active: location.is_active,
    };
  }
};
