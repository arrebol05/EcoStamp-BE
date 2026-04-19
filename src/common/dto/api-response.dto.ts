import { z } from "zod";

export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z
    .object({
      code: z.string().optional(),
      details: z.unknown().optional(),
    })
    .optional(),
});

export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    message: z.string().optional(),
    data: dataSchema,
    meta: z.record(z.string(), z.unknown()).optional(),
  });

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([apiSuccessSchema(dataSchema), apiErrorSchema]);

export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
