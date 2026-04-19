import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";
import { apiErrorSchema, apiSuccessSchema } from "../../common/dto/api-response.dto";
import { authMiddleware } from "../auth/auth.middleware";
import {
  createUserLocationBodySchema,
  createUserLocationResponseSchema,
  deleteUserLocationResponseSchema,
  getAdministrativeUnitPathResponseSchema,
  getCountryResponseSchema,
  listAdminLevelsResponseSchema,
  listAdministrativeUnitsResponseSchema,
  listCountriesResponseSchema,
  listUserLocationsResponseSchema,
  unitSearchQuerySchema,
  unitsRootQuerySchema,
  updateUserLocationBodySchema,
  updateUserLocationResponseSchema,
  userLocationsQuerySchema,
} from "./address.dto";
import {
  createMyLocation,
  deleteMyLocation,
  getCountry,
  getNearbyPlaces,
  getNearbyStations,
  getSpatialClusters,
  getUnitPath,
  listAdminLevels,
  listCountries,
  listMyLocations,
  listRootUnits,
  listUnitChildren,
  reverseGeocoding,
  searchUnits,
  updateMyLocation,
} from "./address.controller";

const addressRouter = Router();

addressRouter.get("/locations/countries", listCountries);
addressRouter.get("/locations/countries/:id", getCountry);
addressRouter.get("/locations/countries/:countryId/levels", listAdminLevels);

addressRouter.get("/locations/units/root", listRootUnits);
addressRouter.get("/locations/units/search", searchUnits);
addressRouter.get("/locations/units/:id/children", listUnitChildren);
addressRouter.get("/locations/units/:id/path", getUnitPath);

addressRouter.get("/users/me/locations", authMiddleware, listMyLocations);
addressRouter.post("/users/me/locations", authMiddleware, createMyLocation);
addressRouter.put("/users/me/locations/:id", authMiddleware, updateMyLocation);
addressRouter.delete("/users/me/locations/:id", authMiddleware, deleteMyLocation);

addressRouter.get("/locations/geo/nearby", getNearbyPlaces);
addressRouter.get("/locations/stations/nearby", getNearbyStations);
addressRouter.get("/locations/geo/reverse", reverseGeocoding);
addressRouter.get("/locations/geo/clusters", getSpatialClusters);

export const registerAddressOpenApi = (registry: OpenAPIRegistry): void => {
  registry.registerPath({
    method: "get",
    path: "/locations/countries",
    tags: ["Location"],
    summary: "List countries",
    responses: {
      200: {
        description: "Countries fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(listCountriesResponseSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/countries/{id}",
    tags: ["Location"],
    summary: "Get country detail",
    responses: {
      200: {
        description: "Country fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(getCountryResponseSchema),
          },
        },
      },
      404: {
        description: "Country not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/countries/{countryId}/levels",
    tags: ["Location"],
    summary: "List admin level definitions by country",
    responses: {
      200: {
        description: "Admin levels fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(listAdminLevelsResponseSchema),
          },
        },
      },
      404: {
        description: "Country not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/units/root",
    tags: ["Location"],
    summary: "List root administrative units",
    request: {
      query: unitsRootQuerySchema,
    },
    responses: {
      200: {
        description: "Root units fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(listAdministrativeUnitsResponseSchema),
          },
        },
      },
      400: {
        description: "Invalid query",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
      404: {
        description: "Country not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/units/{id}/children",
    tags: ["Location"],
    summary: "List child administrative units",
    responses: {
      200: {
        description: "Children fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(listAdministrativeUnitsResponseSchema),
          },
        },
      },
      404: {
        description: "Administrative unit not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/units/{id}/path",
    tags: ["Location"],
    summary: "Get administrative unit breadcrumb path",
    responses: {
      200: {
        description: "Path fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(getAdministrativeUnitPathResponseSchema),
          },
        },
      },
      404: {
        description: "Administrative unit not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/units/search",
    tags: ["Location"],
    summary: "Search administrative units",
    request: {
      query: unitSearchQuerySchema,
    },
    responses: {
      200: {
        description: "Search completed",
        content: {
          "application/json": {
            schema: apiSuccessSchema(listAdministrativeUnitsResponseSchema),
          },
        },
      },
      400: {
        description: "Invalid query",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/users/me/locations",
    tags: ["Location"],
    summary: "List current user locations",
    security: [{ cookieAuth: [] }],
    request: {
      query: userLocationsQuerySchema,
    },
    responses: {
      200: {
        description: "User locations fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(listUserLocationsResponseSchema),
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/users/me/locations",
    tags: ["Location"],
    summary: "Create current user location",
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: createUserLocationBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "User location created",
        content: {
          "application/json": {
            schema: apiSuccessSchema(createUserLocationResponseSchema),
          },
        },
      },
      400: {
        description: "Invalid payload",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/users/me/locations/{id}",
    tags: ["Location"],
    summary: "Update current user location",
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: updateUserLocationBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User location updated",
        content: {
          "application/json": {
            schema: apiSuccessSchema(updateUserLocationResponseSchema),
          },
        },
      },
      400: {
        description: "Invalid payload",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
      404: {
        description: "User location not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/users/me/locations/{id}",
    tags: ["Location"],
    summary: "Delete current user location",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "User location deleted",
        content: {
          "application/json": {
            schema: apiSuccessSchema(deleteUserLocationResponseSchema),
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
      404: {
        description: "User location not found",
        content: {
          "application/json": {
            schema: apiErrorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/geo/nearby",
    tags: ["Location"],
    summary: "Stub nearby places lookup",
    responses: {
      200: {
        description: "Nearby places fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(
              z.object({
                items: z.array(z.unknown()),
              }),
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/stations/nearby",
    tags: ["Location"],
    summary: "Stub nearby stations lookup",
    responses: {
      200: {
        description: "Nearby stations fetched",
        content: {
          "application/json": {
            schema: apiSuccessSchema(
              z.object({
                stations: z.array(z.unknown()),
              }),
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/geo/reverse",
    tags: ["Location"],
    summary: "Stub reverse geocoding",
    responses: {
      200: {
        description: "Reverse geocoding completed",
        content: {
          "application/json": {
            schema: apiSuccessSchema(
              z.object({
                matchedAdminUnit: z.unknown().nullable(),
                path: z.array(z.unknown()),
                confidence: z.number(),
              }),
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/locations/geo/clusters",
    tags: ["Location"],
    summary: "Stub spatial clustering",
    responses: {
      200: {
        description: "Spatial clusters generated",
        content: {
          "application/json": {
            schema: apiSuccessSchema(
              z.object({
                clusters: z.array(z.unknown()),
                points: z.array(z.unknown()),
              }),
            ),
          },
        },
      },
    },
  });
};

export { addressRouter };
