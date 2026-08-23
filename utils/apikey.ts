


export function generateApiKey() {
  const raw = `vxpk_${crypto.randomUUID().replace(/-/g, '')}`;
  return raw;
}

export async function hashApiKey(key: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
