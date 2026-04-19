import type { NextFunction, Request, Response } from "express";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { UserRepository } from "../user/user.repository";
import { HttpError } from "../../middlewares/error.middleware";
import { sendSuccess } from "../../common/http/response";
import type {
	LoginRequestDto,
	LoginResponseDto,
	LogoutResponseDto,
	MeResponseDto,
	RegisterRequestDto,
	RegisterResponseDto,
} from "./auth.dto";

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const authService = new AuthService(userRepository, authRepository);

const COOKIE_NAME = "session_token";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => ({
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	maxAge: SESSION_MAX_AGE_MS,
	path: "/",
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { email, password } = req.body as Partial<RegisterRequestDto>;

		if (!email || !password) {
			throw new HttpError(400, "email and password are required");
		}

		const user = await authService.register(email, password);
		sendSuccess<RegisterResponseDto>(res, 201, { user }, "Register successfully");
	} catch (error) {
		next(error);
	}
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { email, password } = req.body as Partial<LoginRequestDto>;

		if (!email || !password) {
			throw new HttpError(400, "email and password are required");
		}

		const { token } = await authService.login(email, password);

		res.cookie(COOKIE_NAME, token, getCookieOptions());
		sendSuccess<LoginResponseDto>(res, 200, { loggedIn: true }, "Login successfully");
	} catch (error) {
		next(error);
	}
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.cookies.session_token as string | undefined;
		await authService.logout(token);

		res.clearCookie(COOKIE_NAME, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});

		sendSuccess<LogoutResponseDto>(res, 200, { loggedOut: true }, "Logout successfully");
	} catch (error) {
		next(error);
	}
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.cookies.session_token as string | undefined;

		if (!token) {
			throw new HttpError(401, "Unauthorized");
		}

		const user = await authService.getCurrentUser(token);
		sendSuccess<MeResponseDto>(res, 200, { user }, "Current user fetched");
	} catch (error) {
		next(error);
	}
};
