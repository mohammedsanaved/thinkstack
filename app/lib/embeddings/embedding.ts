// import OpenAI from 'openai';
// import { ENV } from '@/config/env';

//  const openai = new OpenAI({
//   baseURL: process.env.OLLAMA_URL ? `${process.env.OLLAMA_URL}/v1` : 'http://localhost:11434/v1',
//   apiKey: 'ollama',
// });


// export async function embed(text: string) {
//   const res = await openai.embeddings.create({
//     model: 'nomic-embed-text',
//     input: text,
//   });

//   return res.data[0].embedding;
// }

// export async function embedBatch(texts: string[]) {
//   const res = await openai.embeddings.create({
//     model: 'nomic-embed-text',
//     input: texts,
//   });

//   return res.data.map((d) => d.embedding);
// }
export async function embed(text: string): Promise<number[]> {
  const res = await fetch('http://127.0.0.1:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'nomic-embed-text', prompt: text }),
  });
  const data = await res.json();
  return data.embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const embeddings = await Promise.all(texts.map(embed));
  return embeddings;
}