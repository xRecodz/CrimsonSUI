import { promises as fs } from 'fs';
import path from 'path';
import { getAppDataDir, getRedisRestConfig, hasVercelKv } from './data-dir';

async function kvCommand(command: string[]): Promise<unknown> {
  const cfg = getRedisRestConfig();
  if (!cfg) throw new Error('Redis REST not configured');
  const base = cfg.url.replace(/\/$/, '');
  const token = cfg.token;

  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KV request failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

async function kvGetJson<T>(key: string): Promise<T | null> {
  const raw = await kvCommand(['GET', key]);
  if (raw == null) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  return raw as T;
}

async function kvSetJson(key: string, value: unknown): Promise<void> {
  await kvCommand(['SET', key, JSON.stringify(value)]);
}

function filePathForKey(key: string): string {
  const safe = key.replace(/[^a-z0-9_-]/gi, '_');
  return path.join(getAppDataDir(), `${safe}.json`);
}

export async function readJsonStore<T>(key: string, fallback: T): Promise<T> {
  if (hasVercelKv()) {
    try {
      const data = await kvGetJson<T>(key);
      return data ?? fallback;
    } catch {
      return fallback;
    }
  }

  try {
    const raw = await fs.readFile(filePathForKey(key), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonStore<T>(key: string, value: T): Promise<void> {
  if (hasVercelKv()) {
    await kvSetJson(key, value);
    return;
  }

  const file = filePathForKey(key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), 'utf8');
}
