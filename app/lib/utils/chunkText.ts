export function chunkText(text: string, chunkSize = 500, overlap = 100) {
  const chunks: string[] = [];

  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }

  return chunks;
}
