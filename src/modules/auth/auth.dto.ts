import { z } from "zod";
import { userResponseSchema } from "../user/user.dto";

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerResponseSchema = z.object({
  user: userResponseSchema,
});

export const loginResponseSchema = z.object({
  loggedIn: z.literal(true),
});

export const logoutResponseSchema = z.object({
  loggedOut: z.literal(true),
});

export const meResponseSchema = z.object({
  user: userResponseSchema,
});

export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;
export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
export type RegisterResponseDto = z.infer<typeof registerResponseSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
export type LogoutResponseDto = z.infer<typeof logoutResponseSchema>;
export type MeResponseDto = z.infer<typeof meResponseSchema>;
