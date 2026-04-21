import { NextRequest } from "next/server";
import { buildContext } from "@/app/lib/rag";
import { buildPrompt } from "@/app/lib/prompt";
import { getRecentMessages } from "@/app/services/chat.service";
import { storeChatMemory } from "@/app/services/chat.service";

export async function POST(req: NextRequest) {
  const { query, projectId, chatId, userId } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 1. Build memory context
        const { chatMemory, projectMemory } = await buildContext({
          projectId,
          chatId,
          query,
        });

        const chatHistory = await getRecentMessages(chatId);

        const prompt = buildPrompt({
          query,
          chatHistory,
          chatMemory,
          projectMemory,
        });
        
        console.log("--- GENERATED PROMPT ---");
        console.log(prompt);
        console.log("------------------------");

        // 2. Call Ollama (STREAM MODE)
        const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
const res = await fetch("http://127.0.0.1:11434/api/generate", {
          method: "POST",
          body: JSON.stringify({
  model: "gpt-oss:120b-cloud",  // ✅ was qwen2.5-coder:7b
  prompt,
  // stream: true,
}),


        });
        console.log("Ollama status:", res.status);
console.log("Ollama ok:", res.ok);
if (!res.ok) {
  const body = await res.text();
  console.error("Ollama error body:", body); // 👈 see the real error
  controller.enqueue(encoder.encode(`[ERROR: ${body}]`));
  controller.close();
  return;
}

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";
        let buffer = ""; // Store partial chunks

        let tokenCount = 0;
        let isClosed = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          let lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              
              if (parsed.error) {
                console.error("Ollama Error:", parsed.error);
                controller.enqueue(encoder.encode(`[ERROR: ${parsed.error}]`));
                continue;
              }

              // Handle regular response AND thinking tokens
              const responseToken = parsed.response || "";
              const thinkingToken = parsed.thinking || "";
              
              if (thinkingToken) {
                controller.enqueue(encoder.encode(`[THOUGHT:${thinkingToken}]`));
              }

              if (responseToken) {
                fullResponse += responseToken;
                controller.enqueue(encoder.encode(responseToken));
              }
            } catch (e) {
              // Silently ignore partial/invalid JSON
            }
          }
        }

        if (!isClosed) {
          controller.close();
          isClosed = true;
        }

        // 3. Store memory in the background
        try {
          await storeChatMemory({
            userId,
            projectId,
            chatId,
            userMessage: query,
            aiResponse: fullResponse,
          });
        } catch (memErr) {
          console.error("Memory Storage Error:", memErr);
        }
      } catch (err: any) {
        console.error("🔥 CHAT API ERROR:", err);
        // Safety check before erroring
        try {
          controller.error(err);
        } catch (e) {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}