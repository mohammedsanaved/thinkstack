import { useState, useCallback, useRef } from "react";
import { addMessage } from "@/app/lib/firebase/message-service";
import { AttachedFile } from "@/app/components/prompt/prompt-helpers";

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface UseChatProps {
  projectId: string;
  chatId: string;
  userId?: string;
  initialMessages?: Message[];
}

export function useChat({ projectId, chatId, userId, initialMessages = [] }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (input: string, files?: AttachedFile[]) => {
    if (!input && (!files || files.length === 0)) return;

    setLoading(true);
    let finalContent = input;

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // 1. Parse files if attached
      if (files && files.length > 0) {
        const parsedTexts = await Promise.all(
          files.map(async (f) => {
            try {
              const formData = new FormData();
              formData.append("file", f.file);
              const res = await fetch("/api/parse-file", {
                method: "POST",
                body: formData,
                signal: controller.signal,
              });
              const data = await res.json();
              return `--- File: ${f.name} ---\n${data.text}\n`;
            } catch (err) {
              if (err instanceof Error && err.name === 'AbortError') throw err;
              console.error(`Failed to parse file ${f.name}:`, err);
              return `--- File: ${f.name} (Error parsing file) ---`;
            }
          })
        );
        finalContent += `\n\nAttached Knowledge:\n${parsedTexts.join("\n")}`;
      }

      const userMsg: Message = { 
        role: "user", 
        content: finalContent 
      };
      
      setMessages((prev) => [...prev, userMsg]);

      // Save user message to DB
      await addMessage({
        chatId,
        projectId,
        role: 'user',
        content: userMsg.content,
      });

      // 2. Send to Chat API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMsg.content, // FULL content with parsed files
          projectId,
          chatId,
          userId,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch chat response");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let aiContent = "";
      
      const aiMessage: Message = { role: "assistant", content: "" };
      console.log(aiMessage, "ai message from usechat");
      setMessages((prev) => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiContent };
          return updated;
        });
      }

      // Save AI response to DB
      await addMessage({
        chatId,
        projectId,
        role: 'assistant',
        content: aiContent,
      });

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log("Chat generation aborted");
      } else {
        console.error("Chat Error:", err);
        setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [projectId, chatId, userId]);

  const generateResponse = useCallback(async (customMessages?: Message[]) => {
    const msgsToUse = customMessages || messages;
    if (msgsToUse.length === 0) return;

    const lastMessage = msgsToUse[msgsToUse.length - 1];
    if (lastMessage.role !== 'user') return;

    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: lastMessage.content,
          projectId,
          chatId,
          userId,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch chat response");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let aiContent = "";
      
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiContent };
          return updated;
        });
      }

      // Save AI response to DB
      await addMessage({
        chatId,
        projectId,
        role: 'assistant',
        content: aiContent,
      });

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log("Chat generation aborted");
      } else {
        console.error("Chat Error:", err);
        setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [projectId, chatId, userId, messages]);

  return { messages, setMessages, sendMessage, generateResponse, loading, stopGenerating };
}