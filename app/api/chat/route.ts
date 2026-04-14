import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ENV } from '@/config/env';
import { retrieveDocs } from '@/app/lib/rag';
import { buildPrompt } from '@/app/lib/prompt';
import { getRecentMessages, saveMessage } from '@/app/services/chat.service';

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query, projectId, chatId } = await req.json();

    // 1. Retrieve docs
    const docs = await retrieveDocs(projectId, query);

    // 2. Get chat history
    const chatHistory = await getRecentMessages(chatId);

    // 3. Build prompt
    const prompt = buildPrompt({
      query,
      chatHistory,
      docs,
    });

    // 4. LLM call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const response = completion.choices[0].message.content || 'No response';

    // 5. Save messages
    await saveMessage(chatId, query, response);

    return NextResponse.json({ response });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
