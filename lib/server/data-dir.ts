import path from 'path';

/**
 * Writable app data directory.
 * Vercel/serverless cwd (/var/task) is read-only — use /tmp there.
 */
export function getAppDataDir(): string {
  if (process.env.CRIMSON_DATA_DIR) {
    return process.env.CRIMSON_DATA_DIR;
  }
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'crimson-data');
  }
  return path.join(process.cwd(), '.data');
}

/** Upstash Redis REST (Vercel Marketplace) or legacy Vercel KV env names. */
export function getRedisRestConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim() ||
    process.env.STORAGE_URL?.trim() ||
    process.env.STORAGE_REDIS_REST_URL?.trim() ||
    '';
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.STORAGE_TOKEN?.trim() ||
    process.env.STORAGE_REDIS_REST_TOKEN?.trim() ||
    '';

  if (!url || !token) return null;
  return { url, token };
}

export function hasVercelKv(): boolean {
  return getRedisRestConfig() != null;
}
