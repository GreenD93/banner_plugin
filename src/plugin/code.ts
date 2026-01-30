// src/plugin/code.ts

import { CARD_TEMPLATE as card } from './templates/card';
import { POPUP_TEMPLATE as popup } from './templates/popup';

figma.showUI(__html__, { width: 400, height: 1000 });

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
 * Generate single HomeBanner (uses card template)
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

  /* img */
  const img = figma.createFrame();
  img.name = card.img.name;
  img.layoutMode = 'VERTICAL';
  img.resize(card.img.width, card.img.height);
  img.primaryAxisAlignItems = 'CENTER'; // justify-content: center
  img.counterAxisAlignItems = 'MIN';    // align-items: flex-start
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
  imageRect.name = card.imgIcon.name;
  imageRect.resize(card.imgIcon.width, card.imgIcon.height);
  imageRect.cornerRadius = card.imgIcon.radius;
  imageRect.fills = [{ type: 'SOLID', color: hex(data.image.color) }];
  img.appendChild(imageRect);

  /* text */
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
  inner.name = card.textInner.name;
  inner.layoutMode = 'HORIZONTAL';
  inner.resize(card.textInner.width, card.textInner.height);
  inner.itemSpacing = card.textInner.gap;
  inner.paddingLeft = card.textInner.paddingLeft;
  inner.primaryAxisAlignItems = 'MIN';
  inner.counterAxisAlignItems = 'MIN';
  inner.fills = [];
  text.appendChild(inner);

  const col = figma.createFrame();
  col.name = card.textColumn.name;
  col.layoutMode = 'VERTICAL';
  col.resize(card.textColumn.width, card.textColumn.height);
  col.itemSpacing = card.textColumn.gap;
  col.primaryAxisAlignItems = 'CENTER';
  col.counterAxisAlignItems = 'MIN';
  col.fills = [];
  inner.appendChild(col);

  for (const item of card.texts) {
    // Figma-safe fallback
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
    txt.name = item.slot;
    txt.characters = content;
    txt.fontSize = item.fontSize;
    txt.lineHeight = { value: item.lineHeight, unit: 'PIXELS' };
    txt.fontName = {
      family: 'Inter',
      style: item.weight === 700 ? 'Bold' : 'Regular',
    };
    txt.fills = [{ type: 'SOLID', color: hex(item.color) }];
    txt.textAutoResize = 'HEIGHT';
    if (item.opacity != null) txt.opacity = item.opacity;

    col.appendChild(txt);
  }
}

/* =========================================================
 * Generate single Popup (uses popup template)
 * ========================================================= */
async function generatePopup(
  data: PopupAIResult,
  offsetY: number
) {
  const root = figma.createFrame();
  root.name = popup.root.name;
  root.layoutMode = 'VERTICAL';
  root.resize(popup.root.width, popup.root.height);
  root.y = offsetY;
  root.primaryAxisSizingMode = 'FIXED';
  root.counterAxisSizingMode = 'FIXED';
  root.fills = [];
  figma.currentPage.appendChild(root);

  /* ================= TOP IMAGE ================= */
  const top = figma.createFrame();
  top.name = popup.topImage.name;
  top.layoutMode = 'VERTICAL';
  top.resize(popup.topImage.width, popup.topImage.height);
  top.paddingTop = popup.topImage.paddingTop;
  top.primaryAxisAlignItems = 'CENTER';
  top.counterAxisAlignItems = 'CENTER';
  top.fills = [{ type: 'SOLID', color: hex(popup.topImage.background) }];
  top.topLeftRadius = popup.topImage.radius.topLeft;
  top.topRightRadius = popup.topImage.radius.topRight;
  root.appendChild(top);

  const frame12 = figma.createFrame();
  frame12.name = popup.imageFrame.name;
  frame12.layoutMode = 'VERTICAL';
  frame12.resize(popup.imageFrame.width, popup.imageFrame.height);
  frame12.primaryAxisAlignItems = 'CENTER';
  frame12.counterAxisAlignItems = 'CENTER';
  frame12.fills = [];
  top.appendChild(frame12);

  const img = figma.createRectangle();
  img.name = popup.image.name;
  img.resize(popup.image.width, popup.image.height);
  img.fills = [{ type: 'SOLID', color: hex(data.imageColor) }];
  frame12.appendChild(img);

  /* ================= TEXT ================= */
  const textSection = figma.createFrame();
  textSection.name = popup.textSection.name;
  textSection.layoutMode = 'VERTICAL';
  textSection.resize(popup.textSection.width, popup.textSection.height);
  textSection.paddingTop = popup.textSection.padding.top;
  textSection.paddingBottom = popup.textSection.padding.bottom;
  textSection.paddingLeft = popup.textSection.padding.left;
  textSection.paddingRight = popup.textSection.padding.right;
  textSection.primaryAxisAlignItems = 'CENTER';
  textSection.counterAxisAlignItems = 'CENTER';
  textSection.itemSpacing = popup.textSection.gap;
  textSection.fills = [{ type: 'SOLID', color: hex(popup.textSection.background) }];
  root.appendChild(textSection);

  const textWrap = figma.createFrame();
  textWrap.name = popup.textWrapper.name;
  textWrap.layoutMode = 'VERTICAL';
  textWrap.resize(popup.textWrapper.width, popup.textWrapper.height);
  textWrap.primaryAxisAlignItems = 'CENTER';
  textWrap.counterAxisAlignItems = 'CENTER';
  textWrap.itemSpacing = popup.textWrapper.gap;
  textWrap.fills = [];
  textSection.appendChild(textWrap);

  for (const item of popup.texts) {
    let content = '';
    if (item.slot === 'sub') content = data.sub;
    if (item.slot === 'title1') content = data.title1;
    if (item.slot === 'title2') content = data.title2;

    await figma.loadFontAsync({
      family: 'Inter',
      style: item.weight === 700 ? 'Bold' : 'Regular',
    });

    const txt = figma.createText();
    txt.characters = content;
    txt.fontSize = item.fontSize;
    txt.lineHeight = { value: item.lineHeight, unit: 'PIXELS' };
    txt.fontName = { family: 'Inter', style: item.weight === 700 ? 'Bold' : 'Regular' };
    txt.textAlignHorizontal = 'CENTER';
    txt.textAutoResize = 'HEIGHT';
    txt.fills = [{ type: 'SOLID', color: hex(item.color) }];
    textWrap.appendChild(txt);
  }

  /* ================= BOTTOM (w bg) ================= */
  const bottom = figma.createFrame();
  bottom.name = popup.bottom.name;
  bottom.layoutMode = 'HORIZONTAL';
  bottom.resize(popup.bottom.width, popup.bottom.height);

  bottom.paddingTop = popup.bottom.padding.top;
  bottom.paddingBottom = popup.bottom.padding.bottom;
  bottom.paddingLeft = popup.bottom.padding.left;
  bottom.paddingRight = popup.bottom.padding.right;

  bottom.itemSpacing = popup.bottom.gap;
  bottom.primaryAxisAlignItems = 'CENTER';
  bottom.counterAxisAlignItems = 'CENTER';

  bottom.fills = [
    { type: 'SOLID', color: hex(popup.bottom.background) },
  ];

  root.appendChild(bottom);

  /* --- 버튼 텍스트 --- */
  await figma.loadFontAsync({
    family: 'Inter',
    style: 'Regular',
  });

  const BUTTON_WIDTH = 108;
  const BUTTON_HEIGHT = 20;
  
  // 왼쪽 버튼
  const leftBtn = figma.createText();
  leftBtn.characters = popup.buttons[0].text;
  leftBtn.fontSize = 14;
  leftBtn.lineHeight = { value: 20, unit: 'PIXELS' };
  leftBtn.fontName = {
    family: 'Pretendard K Edition',
    style: 'Regular',
  };
  leftBtn.fills = [{ type: 'SOLID', color: hex('#020616') }];
  leftBtn.resize(BUTTON_WIDTH, BUTTON_HEIGHT);
  leftBtn.textAutoResize = 'NONE';
  leftBtn.textAlignHorizontal = 'LEFT';
  leftBtn.textAlignVertical = 'CENTER';
  bottom.appendChild(leftBtn);
  
  // 오른쪽 버튼
  const rightBtn = figma.createText();
  rightBtn.characters = popup.buttons[1].text;
  rightBtn.fontSize = 14;
  rightBtn.lineHeight = { value: 20, unit: 'PIXELS' };
  rightBtn.fontName = {
    family: 'Pretendard K Edition',
    style: 'Regular',
  };
  rightBtn.fills = [{ type: 'SOLID', color: hex('#020616') }];
  rightBtn.resize(BUTTON_WIDTH, BUTTON_HEIGHT);
  rightBtn.textAutoResize = 'NONE';
  rightBtn.textAlignHorizontal = 'RIGHT';
  rightBtn.textAlignVertical = 'CENTER';
  bottom.appendChild(rightBtn);
  
}

/* =========================================================
 * UI handler
 * ========================================================= */
figma.ui.onmessage = async (msg) => {

  if (msg.type !== 'generate-template') return;
  await loadPretendard();

  const cardType: CardType = msg.cardType === 'popup' ? 'popup' : 'home';
  const count = Number.isFinite(Number(msg.count)) && Number(msg.count) > 0
  ? Number(msg.count)
  : 1;

  /* =========================
   * 미리 정의된 콘텐츠
   * ========================= */
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

  /* =========================
   * 카드 타입별 간격
   * ========================= */
  const GAP = cardType === 'popup' ? 320 : 140;
  const startY = figma.viewport.center.y;

  /* =========================
   * 🔥 핵심: 타입과 무관하게 동일한 반복 🔥
   * ========================= */
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