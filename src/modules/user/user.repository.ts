import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, type NewUser, type User } from "../../db/schema/index";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user ?? null;
  }

  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }
}
