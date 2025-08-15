import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const content = await redis.get('homepage');
    return res.status(200).json(content ? JSON.parse(content) : {});
  }

  if (req.method === 'POST') {
    const { text, image } = req.body;
    await redis.set('homepage', JSON.stringify({ text, image }));
    return res.status(200).json({ success: true });
  }

  res.status(405).end(); // Méthode non autorisée
}
