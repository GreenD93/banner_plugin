// src/plugin/openai.ts

import type { ChatHistoryItem } from './types';

const OPENAI_API_KEY = '<YOUR_OPENAI_API_KEY>';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export const SYSTEM_PROMPT =
  '너는 배너와 팝업 문구를 도와주는 한국어 전문 디자이너 어시스턴트야.';

export async function askOpenAI(messages: ChatHistoryItem[]): Promise<string> {
  const res = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
    }),
  });

  if (!res.ok) {
    throw new Error('OpenAI request failed');
  }

  const json = await res.json();

  if (
    json &&
    json.choices &&
    json.choices.length > 0 &&
    json.choices[0] &&
    json.choices[0].message &&
    typeof json.choices[0].message.content === 'string'
  ) {
    return json.choices[0].message.content;
  }

  return '응답을 생성하지 못했어요.';
}
