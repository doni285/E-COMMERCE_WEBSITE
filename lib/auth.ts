// Admin authentication with bcrypt and cookie-based sessions
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { compare } from "bcryptjs"

const SESSION_COOKIE = "admin_session"
const SESSION_SECRET = process.env.SESSION_SECRET || "david-mollanni-admin-secret-key-2026"

function generateToken(username: string): string {
  const payload = JSON.stringify({ username, ts: Date.now() })
  return Buffer.from(payload).toString("base64")
}

function verifyToken(token: string): { username: string; ts: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
    if (!payload.username || !payload.ts) return null
    // Sessions expire after 24 hours
    if (Date.now() - payload.ts > 24 * 60 * 60 * 1000) return null
    return payload
  } catch {
    return null
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  const rows = await sql`SELECT * FROM admin_users WHERE username = ${username}`
  if (rows.length === 0) return false

  const valid = await compare(password, rows[0].password_hash as string)
  if (!valid) return false

  const token = generateToken(username)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })

  return true
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return { username: payload.username }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}
