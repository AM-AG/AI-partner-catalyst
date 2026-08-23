
import { useState } from 'react';
import { db } from '../store/db';
import { ApiKey } from '../types/types';
import { generateApiKey, hashApiKey } from '../utils/apikey';


export function useApiKeys(userId: string) {
  const [keys, setKeys] = useState<ApiKey[]>(() =>
    db.getUserApiKeys(userId)
  );

  const createKey = async (name: string) => {
    const rawKey = generateApiKey();
    const hash = await hashApiKey(rawKey);

    const apiKey: ApiKey = {
      id: crypto.randomUUID(),
      userId,
      name,
      keyHash: hash,
      lastFour: rawKey.slice(-4),
      createdAt: Date.now(),
      revoked: false
    };

    db.saveApiKey(apiKey);
    setKeys(prev => [...prev, apiKey]);

    return rawKey; // ? shown once
  };

  return { keys, setKeys, createKey };
}
