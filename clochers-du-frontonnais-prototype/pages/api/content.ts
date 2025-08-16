// pages/api/content.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import kv from '../../lib/kv';

const KEY = 'homepage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const content = await kv.get(KEY);
      // kv peut stocker un objet directement : on renvoie tel quel
      return res.status(200).json(content || {});
    }

    if (req.method === 'POST') {
      const { text, image } = req.body || {};
      // On enregistre un objet simple
      await kv.set(KEY, {
        text: typeof text === 'string' ? text : '',
        image: typeof image === 'string' ? image : ''
      });
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
  } catch (err: any) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
