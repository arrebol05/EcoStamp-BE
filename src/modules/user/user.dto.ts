import type { User } from "../../db/schema/index";
import { z } from "zod";

export const userStatusSchema = z.enum([
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "BANNED",
  "DELETED",
]);

export const userGenderSchema = z.enum(["MALE", "FEMALE", "OTHER"]).nullable();

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().nullable(),
  status: userStatusSchema,
  gender: userGenderSchema,
  createdAt: z.string().datetime(),
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;

export const toUserResponseDto = (user: User): UserResponseDto => {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    status: user.status,
    gender: user.gender,
    createdAt: user.createdAt.toISOString(),
  };
};
