export function buildPrompt({
  query,
  chatHistory,
  docs,
}: {
  query: string;
  chatHistory: string;
  docs: string[];
}) {
  return `
You are an AI assistant. Answer ONLY from provided context.

---

Chat History:
${chatHistory}

---

Project Knowledge:
${docs.join('\n')}

---

User Question:
${query}
`;
}
