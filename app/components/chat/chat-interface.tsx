'use client';

import { useEffect, useState } from 'react';

import { addMessage, getMessages } from '@/app/lib/firebase/message-service';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatInterface({
  projectId,
  chatId,
}: {
  projectId: string;
  chatId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // 🔥 Load chat history
  useEffect(() => {
    const loadMessages = async () => {
      const history = await getMessages(chatId);
      setMessages(history as Message[]);
    };

    loadMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    // ✅ Update UI instantly
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // ✅ Store user message
    await addMessage({
      chatId,
      projectId,
      role: 'user',
      content: input,
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          query: input,
          projectId,
          chatId,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: 'assistant',
        content: data.answer,
      };

      // ✅ Update UI
      setMessages((prev) => [...prev, aiMessage]);

      // ✅ Store AI response
      await addMessage({
        chatId,
        projectId,
        role: 'assistant',
        content: data.answer,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto space-y-3 p-4'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded text-sm max-w-[70%] ${
              msg.role === 'user'
                ? 'bg-black text-white ml-auto'
                : 'bg-gray-200'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className='flex gap-2 p-4 border-t'>
        <textarea
          className='flex-1 border rounded p-2 text-sm'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSend}
          className='bg-black text-white px-4 rounded'
        >
          Send
        </button>
      </div>
    </div>
  );
}
