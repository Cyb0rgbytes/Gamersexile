import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { AUTH_ENABLED } from "./enabled";

/* ═══════════════════════════════════════════════════════════════════════════
 *  AUTH HELPERS (server only)
 *  Every mutation (Server Action / Route Handler) must call requireUser()
 *  and do its own permission check. Hiding a button is never the check.
 * ═══════════════════════════════════════════════════════════════════════════ */

export { AUTH_ENABLED };

export class AuthError extends Error {
  constructor(public code: "unauthenticated" | "forbidden" | "auth-disabled") {
    super(code);
  }
}

/** Clerk user id of the signed-in user, or null (also null when auth is off). */
export async function getUserId(): Promise<string | null> {
  if (!AUTH_ENABLED) return null;
  const { userId } = await auth();
  return userId ?? null;
}

/** Signed-in user's id or throw AuthError("unauthenticated"). */
export async function requireUserId(): Promise<string> {
  if (!AUTH_ENABLED) throw new AuthError("auth-disabled");
  const id = await getUserId();
  if (!id) throw new AuthError("unauthenticated");
  return id;
}

/** Admins are flagged in Clerk: publicMetadata.role = "admin". */
export async function isAdmin(): Promise<boolean> {
  if (!AUTH_ENABLED) return false;
  const { sessionClaims, userId } = await auth();
  if (!userId) return false;
  const fromClaims = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (fromClaims) return fromClaims === "admin";
  const user = await currentUser();
  return (user?.publicMetadata as { role?: string } | undefined)?.role === "admin";
}

export async function requireAdmin(): Promise<string> {
  const id = await requireUserId();
  if (!(await isAdmin())) throw new AuthError("forbidden");
  return id;
}

export type Profile = typeof schema.profiles.$inferSelect;

/**
 * The signed-in user's profile row, created or refreshed from Clerk.
 * Display name and avatar follow Clerk; a Discord username linked through
 * Clerk's Discord sign-in fills `discordUsername` if the user has not set
 * one by hand. Call from mutations that need to show the user to others.
 */
export async function syncProfile(): Promise<Profile> {
  const userId = await requireUserId();
  const user = await currentUser();
  if (!user) throw new AuthError("unauthenticated");

  const discord = user.externalAccounts.find((a) => a.provider === "oauth_discord" || a.provider === "discord");
  const displayName =
    user.username ?? ([user.firstName, user.lastName].filter(Boolean).join(" ") || discord?.username || "Exile");

  const db = await getDb();
  const existing = await db.query.profiles.findFirst({ where: eq(schema.profiles.userId, userId) });
  const values = {
    userId,
    displayName,
    avatarUrl: user.imageUrl ?? null,
    discordUsername: existing?.discordUsername ?? discord?.username ?? null,
    updatedAt: Math.floor(Date.now() / 1000),
  };

  await db
    .insert(schema.profiles)
    .values(values)
    .onConflictDoUpdate({
      target: schema.profiles.userId,
      set: { displayName: values.displayName, avatarUrl: values.avatarUrl, discordUsername: values.discordUsername, updatedAt: values.updatedAt },
    });

  return { ...values, createdAt: existing?.createdAt ?? values.updatedAt };
}

/** Set the Discord username shown to teammates (validated by the caller's UI too). */
export async function setDiscordUsername(name: string): Promise<void> {
  const userId = await requireUserId();
  const clean = name.trim().replace(/^@/, "");
  if (!/^[a-z0-9_.]{2,32}$/i.test(clean)) throw new Error("invalid-discord-username");
  await syncProfile();
  const db = await getDb();
  await db
    .update(schema.profiles)
    .set({ discordUsername: clean, updatedAt: Math.floor(Date.now() / 1000) })
    .where(eq(schema.profiles.userId, userId));
}
