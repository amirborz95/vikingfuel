import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');
const logsFile = path.join(dataDir, 'authLogs.json');
const sessionsFile = path.join(dataDir, 'sessions.json');

export const SESSION_COOKIE_NAME = 'sessionToken';
export const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const ADMIN_EMAILS = ['info@vikingfuel.com'];

export interface UserRecord {
  name: string;
  email: string;
  password: string;
}

export interface AuthLog {
  action: 'login' | 'register' | 'logout';
  email: string;
  timestamp: string;
}

export interface SessionRecord {
  token: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return [] as unknown as T;
  }
}

async function writeJson(filePath: string, data: any) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readUsers(): Promise<UserRecord[]> {
  return await readJson<UserRecord[]>(usersFile);
}

export async function writeUsers(users: UserRecord[]) {
  await writeJson(usersFile, users);
}

export async function appendAuthLog(logEntry: AuthLog) {
  const logs = await readJson<AuthLog[]>(logsFile);
  logs.push(logEntry);
  await writeJson(logsFile, logs);
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const users = await readUsers();
  return users.find((user) => user.email === email);
}

export async function createUser(name: string, email: string, password: string) {
  const users = await readUsers();
  users.push({ name, email, password });
  await writeUsers(users);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export async function readSessions(): Promise<SessionRecord[]> {
  return await readJson<SessionRecord[]>(sessionsFile);
}

export async function writeSessions(sessions: SessionRecord[]) {
  await writeJson(sessionsFile, sessions);
}

export async function createSession(email: string): Promise<SessionRecord> {
  const sessions = await readSessions();
  const token = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_SECONDS * 1000).toISOString();
  const session = { token, email, createdAt, expiresAt };
  sessions.push(session);
  await writeSessions(sessions);
  return session;
}

export async function getSession(token: string): Promise<SessionRecord | null> {
  const sessions = await readSessions();
  const session = sessions.find((entry) => entry.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) {
    await removeSession(token);
    return null;
  }
  return session;
}

export async function removeSession(token: string) {
  const sessions = await readSessions();
  const updated = sessions.filter((entry) => entry.token !== token);
  if (updated.length !== sessions.length) {
    await writeSessions(updated);
  }
}

export function getSessionToken(req: NextRequest) {
  return req.cookies.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function getAuthenticatedUser(req: NextRequest): Promise<UserRecord | null> {
  const token = getSessionToken(req);
  if (!token) return null;
  const session = await getSession(token);
  if (!session) return null;
  const user = await findUserByEmail(session.email);
  return user || null;
}

export function isAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email);
}
