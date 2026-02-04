// src/plugin/code.ts — UI Handler: 메시지 수신/전송 및 플로우 오케스트레이션

import type { CardType, ChatHistoryItem } from './types';
import { SYSTEM_PROMPT, askOpenAI } from './openai';
import { loadPretendard } from './utils';
import {
  generateHomeBanner,
  generatePopup,
  HOME_CONTENTS,
  POPUP_CONTENTS,
} from './banner';

figma.showUI(__html__, { width: 400, height: 750 });

/* =========================================================
 * 채팅 히스토리 (UI 상태)
 * ========================================================= */

let chatHistory: ChatHistoryItem[] = [
  { role: 'system', content: SYSTEM_PROMPT },
];

/* =========================================================
 * UI Message Handler
 * ========================================================= */

figma.ui.onmessage = async (msg) => {
  // 채팅 초기화
  if (msg.type === 'reset-chat') {
    chatHistory = [{ role: 'system', content: SYSTEM_PROMPT }];
    return;
  }

  // 사용자 메시지 → OpenAI → 어시스턴트 응답
  if (msg.type === 'user-message') {
    try {
      chatHistory.push({ role: 'user', content: msg.text });
      const assistantText = await askOpenAI(chatHistory);
      chatHistory.push({ role: 'assistant', content: assistantText });
      figma.ui.postMessage({
        type: 'assistant-message',
        text: assistantText,
      });
    } catch (e) {
      figma.ui.postMessage({
        type: 'assistant-message',
        text: '잠시 문제가 생겼어요. 다시 한 번 말해 주실래요?',
      });
    }
    return;
  }

  // 템플릿 생성 요청 → 배너 모듈 위임
  if (msg.type !== 'generate-template') return;

  await loadPretendard();

  const cardType: CardType = msg.cardType === 'popup' ? 'popup' : 'home';
  const count = Number(msg.count) > 0 ? Number(msg.count) : 1;
  const GAP = cardType === 'popup' ? 320 : 140;
  const startY = figma.viewport.center.y;

  for (let i = 0; i < count; i++) {
    const y = startY + i * GAP;
    if (cardType === 'popup') {
      const data = POPUP_CONTENTS[i % POPUP_CONTENTS.length];
      await generatePopup(data, y);
    } else {
      const data = HOME_CONTENTS[i % HOME_CONTENTS.length];
      await generateHomeBanner(data, y);
    }
  }

  figma.notify(
    `${cardType === 'popup' ? 'Popup' : 'HomeBanner'} ${count}개 생성 완료`
  );
};
