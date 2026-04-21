export function buildPrompt({
  query,
  chatHistory,
  chatMemory,
  projectMemory,
}: {
  query: string;
  chatHistory: string;
  chatMemory: string[];
  projectMemory: string[];
}) {
  const isLearningPlan = query.toLowerCase().includes('learning plan') || 
                         query.toLowerCase().includes('resume') || 
                         query.toLowerCase().includes('cv');

  const markdownRules = `
RESPONSE FORMAT RULES (MUST FOLLOW):
- Always respond in valid Markdown format.
- Use ## for main sections, ### for sub-sections.
- Use **bold** for key terms and important values.
- Use bullet lists (- item) or numbered lists (1. item) for multiple items.
- Use tables (| col | col |) for structured comparisons or data.
- Use \`inline code\` for technical terms, file names, or values.
- Use \`\`\`language blocks for any code snippets.
- Never respond in plain paragraph text only — always use appropriate structure.
- Keep responses concise but complete.`;

  const systemInstructions = isLearningPlan 
    ? `You are an expert Career Coach and Technical Architect.
Your goal is to analyze the user's background (CV/Resume) and requirements to create a personalized, highly actionable Learning Plan.

CORE DIRECTIVE:
1. ALWAYS prioritize information from the "User Question/Request" block.
2. Utilize "Project Knowledge" which contains persistent documents (PDFs, docs) uploaded to this project.
3. Utilize "Relevant Past Conversations" and "Recent Chat History" for context.
4. Identify skill gaps based on the user's goals.
5. Provide a structured plan with specific technologies and resources.
${markdownRules}`
    : `You are a highly accurate AI assistant.

CORE DIRECTIVE:
You have several sources of information:
- "Project Knowledge": Persistent documents (PDFs, docs) uploaded to this project.
- "Relevant Past Conversations": Long-term memory from this project.
- "Recent Chat History": The immediate conversation flow.
- "User Question/Request": The current prompt.

ALWAYS check "Project Knowledge" first for specific project documents. If the user asks about a file they uploaded to the project, the answer is likely in that section.

Rules:
- Answer primarily from the provided context.
- If information is missing, say "I don't know".
- Maintain a professional and helpful tone.
${markdownRules}`;

  return `
${systemInstructions}

---

Recent Chat History:
${chatHistory}

---

Relevant Past Conversations:
${chatMemory.join("\n")}

---

Project Knowledge:
${projectMemory.join("\n")}

---

User Question/Request:
${query}
`;
}