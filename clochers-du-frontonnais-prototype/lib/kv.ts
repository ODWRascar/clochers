import { createClient } from 'redis';

const redis = createClient({
  url: process.env.KV_REST_API_URL, // URL fournie par Vercel KV
  password: process.env.KV_REST_API_TOKEN // Token fourni par Vercel KV
});

redis.on('error', (err) => console.error('Redis Client Error', err));

await redis.connect();

export default redis;
