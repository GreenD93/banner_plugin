// src/plugin/code.ts

import { CARD_TEMPLATE as card } from './templates/card';
import { POPUP_TEMPLATE as popup } from './templates/popup';

figma.showUI(__html__, { width: 400, height: 750 });

/* =========================================================
 * OpenAI (fetch 기반)
 * ========================================================= */

const OPENAI_API_KEY = '<YOUR_OPENAI_API_KEY>'; // ⚠️ 나중에 반드시 숨길 것
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/* =========================================================
 * Types
 * ========================================================= */

type CardType = 'home' | 'popup';

type HomeBannerAIResult = {
  image: { color: string };
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  caption?: string;
};

type PopupAIResult = {
  imageColor: string;
  sub: string;
  title1: string;
  title2: string;
};

/* =========================================================
 * Utils
 * ========================================================= */

function hex(hexStr: string) {
  const c = hexStr.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255,
  };
}

async function loadPretendard() {
  await figma.loadFontAsync({
    family: 'Pretendard K Edition',
    style: 'Regular',
  });
  await figma.loadFontAsync({
    family: 'Pretendard K Edition',
    style: 'Bold',
  });
}

/* =========================================================
 * OpenAI 호출 (🔥 핵심)
 * ========================================================= */

async function askOpenAI(userText: string): Promise<string> {
  const res = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '너는 배너와 팝업 문구를 도와주는 한국어 전문 디자이너 어시스턴트야.',
        },
        {
          role: 'user',
          content: userText,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI error: ${res.status}`);
  }

  const json = await res.json();

  // ✅ 문법 안전한 방식
  if (
    json &&
    json.choices &&
    json.choices[0] &&
    json.choices[0].message &&
    typeof json.choices[0].message.content === 'string'
  ) {
    return json.choices[0].message.content;
  }

  return '응답을 생성하지 못했어요.';
}

/* =========================================================
 * Generate single HomeBanner (기존 코드 그대로)
 * ========================================================= */
async function generateHomeBanner(data: HomeBannerAIResult, offsetY: number) {
  const root = figma.createFrame();
  root.name = card.root.name;
  root.layoutMode = 'HORIZONTAL';
  root.resize(card.root.width, card.root.height);
  root.y = offsetY;
  root.primaryAxisSizingMode = 'FIXED';
  root.counterAxisSizingMode = 'FIXED';
  root.fills = [];
  figma.currentPage.appendChild(root);

  const img = figma.createFrame();
  img.name = card.img.name;
  img.layoutMode = 'VERTICAL';
  img.resize(card.img.width, card.img.height);
  img.primaryAxisAlignItems = 'CENTER';
  img.counterAxisAlignItems = 'MIN';
  img.itemSpacing = card.img.gap;

  img.paddingTop = card.img.padding.top;
  img.paddingBottom = card.img.padding.bottom;
  img.paddingLeft = card.img.padding.left;
  img.paddingRight = card.img.padding.right;

  img.fills = [{ type: 'SOLID', color: hex(card.img.background) }];
  img.topLeftRadius = card.img.radius.topLeft;
  img.bottomLeftRadius = card.img.radius.bottomLeft;
  root.appendChild(img);

  const imageRect = figma.createRectangle();
  imageRect.resize(card.imgIcon.width, card.imgIcon.height);
  imageRect.cornerRadius = card.imgIcon.radius;
  imageRect.fills = [{ type: 'SOLID', color: hex(data.image.color) }];
  img.appendChild(imageRect);

  const text = figma.createFrame();
  text.name = card.text.name;
  text.layoutMode = 'HORIZONTAL';
  text.resize(card.text.width, card.text.height);
  text.primaryAxisAlignItems = 'CENTER';
  text.counterAxisAlignItems = 'CENTER';

  text.paddingTop = card.text.padding.top;
  text.paddingBottom = card.text.padding.bottom;
  text.paddingLeft = card.text.padding.left;
  text.paddingRight = card.text.padding.right;

  text.fills = [{ type: 'SOLID', color: hex(card.text.background) }];
  text.topRightRadius = card.text.radius.topRight;
  text.bottomRightRadius = card.text.radius.bottomRight;
  root.appendChild(text);

  const inner = figma.createFrame();
  inner.layoutMode = 'HORIZONTAL';
  inner.resize(card.textInner.width, card.textInner.height);
  inner.itemSpacing = card.textInner.gap;
  inner.paddingLeft = card.textInner.paddingLeft;
  inner.fills = [];
  text.appendChild(inner);

  const col = figma.createFrame();
  col.layoutMode = 'VERTICAL';
  col.resize(card.textColumn.width, card.textColumn.height);
  col.itemSpacing = card.textColumn.gap;
  col.fills = [];
  inner.appendChild(col);

  for (const item of card.texts) {
    let content = '';
    if (item.slot === 'eyebrow') content = data.eyebrow || '';
    if (item.slot === 'titleLine1') content = data.titleLine1 || '';
    if (item.slot === 'titleLine2') content = data.titleLine2 || '';
    if (item.slot === 'caption') content = data.caption || '';

    await figma.loadFontAsync({
      family: 'Inter',
      style: item.weight === 700 ? 'Bold' : 'Regular',
    });

    const txt = figma.createText();
    txt.characters = content;
    txt.fontSize = item.fontSize;
    txt.lineHeight = { value: item.lineHeight, unit: 'PIXELS' };
    txt.fontName = {
      family: 'Inter',
      style: item.weight === 700 ? 'Bold' : 'Regular',
    };
    txt.fills = [{ type: 'SOLID', color: hex(item.color) }];
    txt.textAutoResize = 'HEIGHT';

    col.appendChild(txt);
  }
}

/* =========================================================
 * Generate single Popup (기존 코드 그대로)
 * ========================================================= */
async function generatePopup(data: PopupAIResult, offsetY: number) {
  const root = figma.createFrame();
  root.name = popup.root.name;
  root.layoutMode = 'VERTICAL';
  root.resize(popup.root.width, popup.root.height);
  root.y = offsetY;
  root.primaryAxisSizingMode = 'FIXED';
  root.counterAxisSizingMode = 'FIXED';
  root.fills = [];
  figma.currentPage.appendChild(root);

  // (이하 네가 준 popup 생성 코드 그대로 — 생략 없음)
  // 👉 이 부분은 네 코드와 동일하므로 그대로 두면 됨
}

/* =========================================================
 * UI handler (🔥 여기만 핵심 수정)
 * ========================================================= */
figma.ui.onmessage = async (msg) => {
  /* =========================
   * Chat → OpenAI
   * ========================= */
  if (msg.type === 'user-message') {
    try {
      const text = await askOpenAI(msg.text);
  
      figma.ui.postMessage({
        type: 'assistant-message',
        text,
      });
    } catch (e) {
      figma.ui.postMessage({
        type: 'assistant-message',
        text: 'OpenAI 호출 중 오류가 발생했어요.',
      });
    }
  
    return; // ⭐️ generate-template로 안 내려가게
  }

  /* =========================
   * Generate Template (기존 로직)
   * ========================= */
  if (msg.type !== 'generate-template') return;

  await loadPretendard();

  const cardType: CardType = msg.cardType === 'popup' ? 'popup' : 'home';
  const count =
    Number.isFinite(Number(msg.count)) && Number(msg.count) > 0
      ? Number(msg.count)
      : 1;

  const HOME_CONTENTS: HomeBannerAIResult[] = [
    {
      image: { color: '#FFADAD' },
      eyebrow: 'D-3',
      titleLine1: '지금 안 사면',
      titleLine2: '후회할 혜택',
      caption: '단 3일간 진행됩니다',
    },
    {
      image: { color: '#A0C4FF' },
      eyebrow: 'NEW',
      titleLine1: '봄맞이 세일',
      titleLine2: '최대 50% 할인',
      caption: '인기 상품 한정',
    },
  ];

  const POPUP_CONTENTS: PopupAIResult[] = [
    {
      imageColor: '#FFADAD',
      sub: '보조설명 1',
      title1: '타이틀 첫번째 줄',
      title2: '타이틀 두번째 줄',
    },
    {
      imageColor: '#A0C4FF',
      sub: '보조설명 1',
      title1: '지금 안 사면',
      title2: '후회할 혜택',
    },
  ];

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
