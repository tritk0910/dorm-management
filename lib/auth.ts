import crypto from "node:crypto";
import { cookies } from "next/headers";

export type Role = "student" | "admin" | "staff" | "security";

export interface Session {
  userId: number;
  role: Role;
  name: string;
  studentId?: number;
  staffId?: number;
}

const COOKIE = "hs_session";
const SECRET =
  process.env.SESSION_SECRET ?? "hearthstead-dev-secret-please-change-in-production";

export const SESSION_COOKIE = COOKIE;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha256")
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const attempt = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha256")
    .toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(attempt), Buffer.from(hash));
  } catch {
    return false;
  }
}

export function encodeSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function decodeSession(token: string): Session | null {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");
    if (
      sig.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    )
      return null;
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export function requireRole(...allowed: Role[]) {
  return async function (): Promise<Session> {
    const session = await getSession();
    if (!session) throw new Error("Unauthenticated");
    if (!allowed.includes(session.role)) throw new Error("Forbidden");
    return session;
  };
}
