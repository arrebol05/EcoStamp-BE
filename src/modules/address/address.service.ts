import { HttpError } from "../../middlewares/error.middleware";
import type { AdministrativeUnit, UserLocation } from "../../db/schema";
import {
  type CreateUserLocationBodyDto,
  type GeoNearbyQueryDto,
  type ReverseGeocodingQueryDto,
  type SpatialClustersQueryDto,
  type UnitSearchQueryDto,
  type UpdateUserLocationBodyDto,
  type UserLocationsQueryDto,
  type UnitsRootQueryDto,
} from "./address.dto";
import { AddressRepository } from "./address.repository";

export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async listCountries() {
    return this.addressRepository.listCountries();
  }

  async getCountryById(countryId: string) {
    const country = await this.addressRepository.getCountryById(countryId);

    if (!country) {
      throw new HttpError(404, "Country not found");
    }

    return country;
  }

  async listAdminLevelDefinitions(countryId: string) {
    const country = await this.addressRepository.getCountryById(countryId);

    if (!country) {
      throw new HttpError(404, "Country not found");
    }

    return this.addressRepository.listAdminLevelDefinitions(countryId);
  }

  async listRootAdministrativeUnits(query: UnitsRootQueryDto) {
    const country = await this.addressRepository.getCountryById(query.countryId);

    if (!country) {
      throw new HttpError(404, "Country not found");
    }

    return this.addressRepository.listRootAdminUnits(query.countryId);
  }

  async listAdministrativeUnitChildren(unitId: string) {
    const parent = await this.addressRepository.getAdministrativeUnitById(unitId);

    if (!parent) {
      throw new HttpError(404, "Administrative unit not found");
    }

    return this.addressRepository.listAdminUnitChildren(parent.id);
  }

  async getAdministrativeUnitPath(unitId: string) {
    const currentUnit = await this.addressRepository.getAdministrativeUnitById(unitId);

    if (!currentUnit) {
      throw new HttpError(404, "Administrative unit not found");
    }

    const path: AdministrativeUnit[] = [];
    const visited = new Set<string>();
    let pointer: AdministrativeUnit | null = currentUnit;

    while (pointer) {
      if (visited.has(pointer.id)) {
        throw new HttpError(500, "Invalid administrative hierarchy");
      }

      visited.add(pointer.id);
      path.push(pointer);

      if (!pointer.parentId) {
        break;
      }

      pointer = await this.addressRepository.getAdministrativeUnitById(pointer.parentId);
    }

    const ordered = path.reverse();

    return {
      path: ordered,
      breadcrumb: ordered.map((item) => item.name).join(" > "),
    };
  }

  async searchAdministrativeUnits(query: UnitSearchQueryDto) {
    const params: {
      q: string;
      countryId?: string;
      level?: number;
      type?: string;
      page: number;
      limit: number;
    } = {
      q: query.q,
      page: query.page,
      limit: query.limit,
    };

    if (query.countryId) {
      params.countryId = query.countryId;
    }

    if (typeof query.level === "number") {
      params.level = query.level;
    }

    if (query.type) {
      params.type = query.type;
    }

    return this.addressRepository.searchAdministrativeUnits(params);
  }

  async listMyLocations(userId: string, query: UserLocationsQueryDto) {
    return this.addressRepository.listUserLocationsByUserId(userId, query.page, query.limit);
  }

  async createMyLocation(userId: string, payload: CreateUserLocationBodyDto): Promise<UserLocation> {
    const unit = await this.addressRepository.getAdministrativeUnitById(payload.adminUnitId);

    if (!unit) {
      throw new HttpError(400, "Invalid adminUnitId");
    }

    return this.addressRepository.createUserLocation({
      userId,
      adminUnitId: payload.adminUnitId,
      route: payload.route,
      streetNumber: payload.streetNumber,
      formattedAddress: payload.formattedAddress,
      latitude: payload.latitude,
      longitude: payload.longitude,
    });
  }

  async updateMyLocation(
    userId: string,
    locationId: string,
    payload: UpdateUserLocationBodyDto,
  ): Promise<UserLocation> {
    const location = await this.addressRepository.getUserLocationById(userId, locationId);

    if (!location) {
      throw new HttpError(404, "User location not found");
    }

    if (payload.adminUnitId) {
      const unit = await this.addressRepository.getAdministrativeUnitById(payload.adminUnitId);

      if (!unit) {
        throw new HttpError(400, "Invalid adminUnitId");
      }
    }

    const updateData: {
      adminUnitId?: string;
      route?: string;
      streetNumber?: string;
      formattedAddress?: string;
      latitude?: number;
      longitude?: number;
    } = {};

    if (payload.adminUnitId !== undefined) {
      updateData.adminUnitId = payload.adminUnitId;
    }
    if (payload.route !== undefined) {
      updateData.route = payload.route;
    }
    if (payload.streetNumber !== undefined) {
      updateData.streetNumber = payload.streetNumber;
    }
    if (payload.formattedAddress !== undefined) {
      updateData.formattedAddress = payload.formattedAddress;
    }
    if (payload.latitude !== undefined) {
      updateData.latitude = payload.latitude;
    }
    if (payload.longitude !== undefined) {
      updateData.longitude = payload.longitude;
    }

    const updated = await this.addressRepository.updateUserLocationById(
      userId,
      locationId,
      updateData,
    );

    if (!updated) {
      throw new HttpError(500, "Failed to update user location");
    }

    return updated;
  }

  async deleteMyLocation(userId: string, locationId: string): Promise<void> {
    const deleted = await this.addressRepository.deleteUserLocationById(userId, locationId);

    if (!deleted) {
      throw new HttpError(404, "User location not found");
    }
  }

  async findNearestPlaces(_query: GeoNearbyQueryDto) {
    // TODO:
    // - calculate candidate points with Haversine formula or GIS index
    // - filter entities in requested radius
    // - sort by distance and return top nearest items
    return [];
  }

  async findNearbyStations(_query: GeoNearbyQueryDto) {
    // TODO:
    // - query nearby stations using spatial index
    // - fallback to distance formula when GIS is not available
    // - apply station business filters before returning
    return [];
  }

  async resolveLocation(_query: ReverseGeocodingQueryDto) {
    // TODO:
    // - map lat/lng to administrative unit via point-in-polygon or nearest centroid
    // - walk through parentId chain to build hierarchy path
    // - return matched unit with confidence score
    return {
      matchedAdminUnit: null,
      path: [],
      confidence: 0,
    };
  }

  async spatialSearchAndClustering(_query: SpatialClustersQueryDto) {
    // TODO:
    // - parse bbox and fetch spatial points inside viewport
    // - group points by zoom level using grid/geohash clustering
    // - return clusters and unclustered points for map rendering
    return {
      clusters: [],
      points: [],
    };
  }

}
