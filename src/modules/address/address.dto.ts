import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const countryResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  nameEn: z.string().nullable(),
  isoCode: z.string(),
  createdAt: z.string().datetime(),
});

export const adminLevelDefinitionResponseSchema = z.object({
  id: z.string().uuid(),
  countryId: z.string().uuid(),
  level: z.number().int().nonnegative(),
  type: z.string(),
  nameLocal: z.string(),
  nameEn: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const administrativeUnitResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  nameEn: z.string().nullable(),
  type: z.string(),
  level: z.number().int().nonnegative(),
  countryId: z.string().uuid(),
  adminLevelDefinitionId: z.string().uuid(),
  parentId: z.string().uuid().nullable(),
  code: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const unitsRootQuerySchema = z.object({
  countryId: z.string().uuid(),
});

export const unitSearchQuerySchema = paginationSchema.extend({
  q: z.string().trim().min(1),
  countryId: z.string().uuid().optional(),
  level: z.coerce.number().int().nonnegative().optional(),
  type: z.string().trim().optional(),
});

export const userLocationsQuerySchema = paginationSchema;

export const createUserLocationBodySchema = z.object({
  adminUnitId: z.string().uuid(),
  route: z.string().trim().optional(),
  streetNumber: z.string().trim().optional(),
  formattedAddress: z.string().trim().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateUserLocationBodySchema = z
  .object({
    adminUnitId: z.string().uuid().optional(),
    route: z.string().trim().optional(),
    streetNumber: z.string().trim().optional(),
    formattedAddress: z.string().trim().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const geoNearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive(),
  type: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const reverseGeocodingQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  countryId: z.string().uuid().optional(),
});

export const spatialClustersQuerySchema = z.object({
  bbox: z.string().min(3),
  zoom: z.coerce.number().int().min(1).max(22),
  type: z.string().optional(),
});

export const userLocationResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  adminUnitId: z.string().uuid(),
  route: z.string().nullable(),
  streetNumber: z.string().nullable(),
  formattedAddress: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  createdAt: z.string().datetime(),
});

export const listCountriesResponseSchema = z.object({
  countries: z.array(countryResponseSchema),
});

export const getCountryResponseSchema = z.object({
  country: countryResponseSchema,
});

export const listAdminLevelsResponseSchema = z.object({
  levels: z.array(adminLevelDefinitionResponseSchema),
});

export const listAdministrativeUnitsResponseSchema = z.object({
  units: z.array(administrativeUnitResponseSchema),
});

export const getAdministrativeUnitPathResponseSchema = z.object({
  path: z.array(administrativeUnitResponseSchema),
  breadcrumb: z.string(),
});

export const listUserLocationsResponseSchema = z.object({
  locations: z.array(userLocationResponseSchema),
});

export const createUserLocationResponseSchema = z.object({
  location: userLocationResponseSchema,
});

export const updateUserLocationResponseSchema = z.object({
  location: userLocationResponseSchema,
});

export const deleteUserLocationResponseSchema = z.object({
  id: z.string().uuid(),
  deleted: z.literal(true),
});

export type UnitsRootQueryDto = z.infer<typeof unitsRootQuerySchema>;
export type UnitSearchQueryDto = z.infer<typeof unitSearchQuerySchema>;
export type UserLocationsQueryDto = z.infer<typeof userLocationsQuerySchema>;
export type CreateUserLocationBodyDto = z.infer<typeof createUserLocationBodySchema>;
export type UpdateUserLocationBodyDto = z.infer<typeof updateUserLocationBodySchema>;
export type GeoNearbyQueryDto = z.infer<typeof geoNearbyQuerySchema>;
export type ReverseGeocodingQueryDto = z.infer<typeof reverseGeocodingQuerySchema>;
export type SpatialClustersQueryDto = z.infer<typeof spatialClustersQuerySchema>;

export type ListCountriesResponseDto = z.infer<typeof listCountriesResponseSchema>;
export type GetCountryResponseDto = z.infer<typeof getCountryResponseSchema>;
export type ListAdminLevelsResponseDto = z.infer<typeof listAdminLevelsResponseSchema>;
export type ListAdministrativeUnitsResponseDto = z.infer<typeof listAdministrativeUnitsResponseSchema>;
export type GetAdministrativeUnitPathResponseDto = z.infer<
  typeof getAdministrativeUnitPathResponseSchema
>;
export type ListUserLocationsResponseDto = z.infer<typeof listUserLocationsResponseSchema>;
export type CreateUserLocationResponseDto = z.infer<typeof createUserLocationResponseSchema>;
export type UpdateUserLocationResponseDto = z.infer<typeof updateUserLocationResponseSchema>;
export type DeleteUserLocationResponseDto = z.infer<typeof deleteUserLocationResponseSchema>;
