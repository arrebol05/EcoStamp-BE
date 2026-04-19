import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { apiErrorSchema, apiSuccessSchema } from "../../common/dto/api-response.dto";
import { login, logout, me, register } from "./auth.controller";
import {
	loginRequestSchema,
	loginResponseSchema,
	logoutResponseSchema,
	meResponseSchema,
	registerRequestSchema,
	registerResponseSchema,
} from "./auth.dto";
import { authMiddleware } from "./auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/me", authMiddleware, me);

export const registerAuthOpenApi = (registry: OpenAPIRegistry): void => {
	registry.registerPath({
		method: "post",
		path: "/auth/register",
		tags: ["Auth"],
		summary: "Register a new account",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: registerRequestSchema,
					},
				},
			},
		},
		responses: {
			201: {
				description: "User created",
				content: {
					"application/json": {
						schema: apiSuccessSchema(registerResponseSchema),
					},
				},
			},
			400: {
				description: "Invalid input",
				content: {
					"application/json": {
						schema: apiErrorSchema,
					},
				},
			},
			409: {
				description: "Email already exists",
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
		path: "/auth/login",
		tags: ["Auth"],
		summary: "Login and create a session",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: loginRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Login success and cookie is set",
				content: {
					"application/json": {
						schema: apiSuccessSchema(loginResponseSchema),
					},
				},
			},
			401: {
				description: "Invalid credentials",
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
		path: "/auth/logout",
		tags: ["Auth"],
		summary: "Logout and clear current session",
		security: [{ cookieAuth: [] }],
		responses: {
			200: {
				description: "Logout success",
				content: {
					"application/json": {
						schema: apiSuccessSchema(logoutResponseSchema),
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
		method: "get",
		path: "/auth/me",
		tags: ["Auth"],
		summary: "Get current authenticated user",
		security: [{ cookieAuth: [] }],
		responses: {
			200: {
				description: "Current user profile",
				content: {
					"application/json": {
						schema: apiSuccessSchema(meResponseSchema),
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
};

export { authRouter };
