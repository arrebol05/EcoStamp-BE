import type { NextFunction, Request, Response } from "express";
import { AuthRepository } from "./auth.repository";
import { toUserResponseDto, type UserResponseDto } from "../user/user.dto";

const authRepository = new AuthRepository();

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDto;
      sessionToken?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.session_token as string | undefined;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await authRepository.findActiveSessionByToken(token);

    if (!result) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = toUserResponseDto(result.user);
    req.sessionToken = token;

    next();
  } catch (error) {
    next(error);
  }
};
