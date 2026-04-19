import { doublePrecision, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { administrativeUnits } from "./administrative-unit.schema";
import { users } from "./user.schema";

export const userLocations = pgTable("user_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  adminUnitId: uuid("admin_unit_id")
    .notNull()
    .references(() => administrativeUnits.id, { onDelete: "restrict" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  route: text("route"),
  streetNumber: text("street_number"),
  formattedAddress: text("formatted_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type UserLocation = typeof userLocations.$inferSelect;
export type NewUserLocation = typeof userLocations.$inferInsert;
