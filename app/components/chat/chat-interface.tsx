'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChat, Message } from '@/app/hooks/useChat';
import { getMessages } from '@/app/lib/firebase/message-service';
// import ProjectHeader from '../project/project-header';
// import ProjectSidebar from '../project/project-sidebar';
import ProjectInput from '../project/project-input';
import { db, auth } from '@/app/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { getChat } from '@/app/lib/firebase/chat-service';
import { Bot, User, ChevronRight, LayoutDashboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import rehypeRaw from "rehype-raw";

export default function ChatInterface({
  projectId,
  chatId,
}: {
  projectId: string;
  chatId: string;
}) {
  const searchParams = useSearchParams();
  const autoTrigger = searchParams.get('auto') === 'true';
  const [project, setProject] = useState<any>(null);
  const [chatData, setChatData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, generateResponse, loading: isGenerating } = useChat({
    projectId,
    chatId,
    userId: auth.currentUser?.uid,
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Load project
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        }

        // Load chat data
        const chatInfo = await getChat(chatId);
        if (chatInfo) {
          setChatData(chatInfo);
        }

        // Load messages
        const history = await getMessages(chatId);
        setMessages(history as Message[]);

        // Auto-trigger if brand new chat with one mission
        if (autoTrigger && history.length === 1 && history[0].role === 'user') {
          generateResponse(history as Message[]);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadData();
  }, [projectId, chatId]); // Only run once on mount

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (prompt: string) => {
    await sendMessage(prompt);
  };

  if (initialLoading) {
    return (
      <div className="flex-1 bg-[#11111b] p-8 flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#89b4fa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 bg-[#11111b] p-8 text-center text-white h-screen flex flex-col items-center justify-center">
        Project not found.
      </div>
    );
  }

  // function formatMarkdown(content: string) {
  //   return content
  //     .replace(/<br\s*\/?>/gi, "\n")   // HTML → newline
  //     .replace(/\n{3,}/g, "\n\n")      // clean extra spacing
  //     .trim();
  // }

  function fixBrokenTables(text: string) {
    // Detect continuous table row pattern and break it
    return text
      // Add newline before every | that starts a new row
      .replace(/\|\s*\|/g, "|\n|")

      // Fix header separator row
      .replace(/\|\s*-{2,}\s*\|/g, (match) => "\n" + match + "\n")

      // Clean extra spaces
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  function formatMarkdown(content: string) {
    return fixBrokenTables(
      content
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    );
  }

  return (
    <div className="flex-1 bg-[#0b0b10] h-full flex flex-col overflow-hidden">
      {/* Breadcrumbs Header */}
      <div className="bg-[#11111b]/50 backdrop-blur-md border-b border-[#1e1e2e] px-6 py-3 flex items-center gap-3 text-sm">
        <Link
          href="/dashboard"
          className="text-[#9399b2] hover:text-[#89b4fa] transition-colors flex items-center gap-1.5"
        >
          <LayoutDashboard size={14} />
          Projects
        </Link>
        <ChevronRight size={14} className="text-[#45475a]" />
        <Link
          href={`/dashboard/${projectId}`}
          className="text-[#9399b2] hover:text-[#89b4fa] transition-colors"
        >
          {project?.name || 'Project'}
        </Link>
        <ChevronRight size={14} className="text-[#45475a]" />
        <span className="text-[#cdd6f4] font-medium truncate max-w-[200px]">
          {chatData?.title || 'Chat'}
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#585b70] py-20">
                <div className="w-16 h-16 bg-[#1e1e2e] rounded-2xl flex items-center justify-center mb-4 border border-[#313244]">
                  <MessageSquare size={32} className="text-[#89b4fa]/50" />
                </div>
                <h3 className="text-lg font-medium text-[#cdd6f4] mb-1">New Conversation</h3>
                <p className="text-sm">Start a conversation with the Thinking Stack.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex items-center gap-2 mb-2 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${msg.role === 'assistant'
                      ? 'bg-[#89b4fa]/10 text-[#89b4fa] border border-[#89b4fa]/20'
                      : 'bg-[#f5e0dc]/10 text-[#f5e0dc] border border-[#f5e0dc]/20'
                      }`}>
                      {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#585b70]">
                      {msg.role === 'assistant' ? 'Thinking Stack' : 'You'}
                    </span>
                  </div>

                  <div className={`relative p-5 rounded-2xl text-[15px] leading-relaxed transition-all ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#89b4fa] to-[#74c7ec] text-[#11111b] font-medium rounded-tr-sm shadow-lg shadow-[#89b4fa]/10 max-w-[85%]'
                    : 'bg-[#1e1e2e] border border-[#313244] text-[#cdd6f4] rounded-tl-sm prose prose-invert prose-sm max-w-none w-full shadow-sm'
                    }`}>
                    {msg.role === 'assistant' ? (
                      <div className="space-y-4">
                        {/* Logic Transcript Parsing */}
                        {(() => {
                          const thoughtMatches = Array.from(msg.content.matchAll(/\[THOUGHT:([\s\S]*?)\]/g));
                          const cleanContent = msg.content.replace(/\[THOUGHT:[\s\S]*?\]/g, '').trim();
                          const thoughts = thoughtMatches.map(m => m[1]).join('');

                          return (
                            <>
                              {thoughts && (
                                <div className="bg-[#181825] border border-[#313244] rounded-xl overflow-hidden">
                                  <div className="bg-[#313244]/30 px-3 py-1.5 flex items-center justify-between border-b border-[#313244]">
                                    <span className="text-[10px] uppercase tracking-widest text-[#89b4fa] font-black">Logic Transcript</span>
                                    <div className="flex gap-1">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#f38ba8]/40" />
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#fab387]/40" />
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]/40" />
                                    </div>
                                  </div>
                                  <div className="p-3 text-xs text-[#9399b2] italic leading-relaxed whitespace-pre-wrap font-mono">
                                    {thoughts}
                                    {isGenerating && i === messages.length - 1 && <span className="inline-block w-1 h-3 bg-[#89b4fa] ml-1 animate-pulse" />}
                                  </div>
                                </div>
                              )}
                              {cleanContent ? (
                                <div className="markdown-content">
                                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {formatMarkdown(cleanContent)}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                i === messages.length - 1 && isGenerating && !thoughts && (
                                  <div className="flex gap-1.5 py-2">
                                    <div className="w-2 h-2 bg-[#89b4fa]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-[#89b4fa]/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-[#89b4fa]/40 rounded-full animate-bounce" />
                                  </div>
                                )
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}

            {isGenerating && (
              <div className="flex items-center gap-3 text-[#585b70] text-sm py-2 ml-1 animate-in fade-in duration-500">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-[#89b4fa] rounded-full animate-bounce" />
                </div>
                <span className="font-medium tracking-tight">Thinking Stack is processing...</span>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        <div className="bg-gradient-to-t from-[#0b0b10] via-[#0b0b10] to-transparent pt-2 pb-2 px-6">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-[#0b0b10] to-transparent pointer-events-none" />
            <ProjectInput onSend={handleSend} />
            <p className="text-[10px] text-center text-[#45475a] mt-4 uppercase tracking-widest font-medium">
              Thinking Stack AI • Powered by Qwen 2.5 Coder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
