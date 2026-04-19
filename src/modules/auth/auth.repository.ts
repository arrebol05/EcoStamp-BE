import { and, eq, gt } from "drizzle-orm";
import { db } from "../../db";
import { sessions, users, type NewSession, type Session, type User } from "../../db/schema/index";

export type SessionWithUser = {
  session: Session;
  user: User;
};

export class AuthRepository {
  async createSession(data: NewSession): Promise<Session> {
    const [session] = await db.insert(sessions).values(data).returning();

    if (!session) {
      throw new Error("Failed to create session");
    }

    return session;
  }

  async findActiveSessionByToken(token: string): Promise<SessionWithUser | null> {
    const now = new Date();

    const [result] = await db
      .select({
        session: sessions,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
      .limit(1);

    return result ?? null;
  }

  async deleteSessionByToken(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
}
