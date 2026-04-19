import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
	"PENDING_VERIFICATION",
	"ACTIVE",
	"SUSPENDED",
	"BANNED",
	"DELETED",
]);

export const userGenderEnum = pgEnum("user_gender", ["MALE", "FEMALE", "OTHER"]);

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	phone: varchar("phone", { length: 20 }).unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	status: userStatusEnum("status").notNull().default("PENDING_VERIFICATION"),
	gender: userGenderEnum("gender"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
