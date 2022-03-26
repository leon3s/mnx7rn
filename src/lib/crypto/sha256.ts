import { createHmac } from 'crypto';

export function hmac_sha256(s: string, key: string) {
  const hmac = createHmac('sha256', key);
  return hmac.update(s)
    .digest('base64');
}
