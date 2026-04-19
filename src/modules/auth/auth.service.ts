import { randomUUID } from "node:crypto";
import { HttpError } from "../../middlewares/error.middleware";
import { comparePassword, hashPassword } from "../../utils/hash";
import { UserRepository } from "../user/user.repository";
import { toUserResponseDto, type UserResponseDto } from "../user/user.dto";
import { AuthRepository } from "./auth.repository";

const SESSION_DURATION_IN_DAYS = 7;

export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly authRepository: AuthRepository,
	) {}

	async register(email: string, password: string): Promise<UserResponseDto> {
		const existingUser = await this.userRepository.findByEmail(email);

		if (existingUser) {
			throw new HttpError(409, "Email already exists");
		}

		const hashedPassword = await hashPassword(password);
		const user = await this.userRepository.create({
			email,
			passwordHash: hashedPassword,
		});

		return toUserResponseDto(user);
	}

	async login(email: string, password: string): Promise<{ token: string; expiresAt: Date }> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new HttpError(401, "Invalid email or password");
		}

		const isPasswordValid = await comparePassword(password, user.passwordHash);

		if (!isPasswordValid) {
			throw new HttpError(401, "Invalid email or password");
		}

		const token = randomUUID();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_IN_DAYS);

		await this.authRepository.createSession({
			userId: user.id,
			token,
			expiresAt,
		});

		return { token, expiresAt };
	}

	async logout(token?: string): Promise<void> {
		if (!token) {
			return;
		}

		await this.authRepository.deleteSessionByToken(token);
	}

	async getCurrentUser(token: string): Promise<UserResponseDto> {
		const result = await this.authRepository.findActiveSessionByToken(token);

		if (!result) {
			throw new HttpError(401, "Unauthorized");
		}

		return toUserResponseDto(result.user);
	}
}
