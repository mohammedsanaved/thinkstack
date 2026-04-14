import OpenAI from 'openai';
import { ENV } from '@/config/env';

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export async function embed(text: string) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return res.data[0].embedding;
}

export async function embedBatch(texts: string[]) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });

  return res.data.map((d) => d.embedding);
}
