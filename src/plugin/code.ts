// src/plugin/code.ts

import { CARD_TEMPLATE as t } from './templates/card';

figma.showUI(__html__, { width: 400, height: 1000 });

function hex(hex: string) {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255,
  };
}

/* =========================================================
 * Generate single banner
 * ========================================================= */
async function generateHomeBanner(
  data: {
    image: { color: string };
    [key: string]: any;
  },
  offsetY: number
) {
  /* ---------- Root ---------- */
  const root = figma.createFrame();
  root.name = t.root.name;
  root.layoutMode = 'HORIZONTAL';
  root.resize(t.root.width, t.root.height);
  root.y = offsetY;
  root.primaryAxisSizingMode = 'FIXED';
  root.counterAxisSizingMode = 'FIXED';
  root.fills = [];
  figma.currentPage.appendChild(root);

  /* ======================================================
   * img (FIXED)
   * ====================================================== */
  const img = figma.createFrame();
  img.name = t.img.name;
  img.layoutMode = 'VERTICAL';
  img.resize(t.img.width, t.img.height);

  // ⭐️ 핵심 수정
  img.primaryAxisAlignItems = 'CENTER'; // justify-content: center
  img.counterAxisAlignItems = 'MIN';    // align-items: flex-start

  img.itemSpacing = t.img.gap;
  img.paddingTop = t.img.padding.top;
  img.paddingBottom = t.img.padding.bottom;
  img.paddingLeft = t.img.padding.left;
  img.paddingRight = t.img.padding.right;

  img.fills = [{ type: 'SOLID', color: hex(t.img.background) }];
  img.topLeftRadius = t.img.radius.topLeft;
  img.bottomLeftRadius = t.img.radius.bottomLeft;

  root.appendChild(img);

  // AI image placeholder
  const imageRect = figma.createRectangle();
  imageRect.name = t.imgIcon.name;
  imageRect.resize(t.imgIcon.width, t.imgIcon.height);
  imageRect.cornerRadius = t.imgIcon.radius;
  imageRect.fills = [{ type: 'SOLID', color: hex(data.image.color) }];
  img.appendChild(imageRect);

  /* ======================================================
   * text
   * ====================================================== */
  const text = figma.createFrame();
  text.name = t.text.name;
  text.layoutMode = 'HORIZONTAL';
  text.resize(t.text.width, t.text.height);
  text.primaryAxisAlignItems = 'CENTER';
  text.counterAxisAlignItems = 'CENTER';

  text.paddingTop = t.text.padding.top;
  text.paddingBottom = t.text.padding.bottom;
  text.paddingLeft = t.text.padding.left;
  text.paddingRight = t.text.padding.right;

  text.fills = [{ type: 'SOLID', color: hex(t.text.background) }];
  text.topRightRadius = t.text.radius.topRight;
  text.bottomRightRadius = t.text.radius.bottomRight;

  root.appendChild(text);

  /* ======================================================
   * Frame 427321433
   * ====================================================== */
  const inner = figma.createFrame();
  inner.name = t.textInner.name;
  inner.layoutMode = 'HORIZONTAL';
  inner.resize(t.textInner.width, t.textInner.height);
  inner.itemSpacing = t.textInner.gap;
  inner.paddingLeft = t.textInner.paddingLeft;
  inner.primaryAxisAlignItems = 'MIN';
  inner.counterAxisAlignItems = 'MIN';
  inner.fills = [];

  text.appendChild(inner);

  /* ======================================================
   * text column
   * ====================================================== */
  const col = figma.createFrame();
  col.name = t.textColumn.name;
  col.layoutMode = 'VERTICAL';
  col.resize(t.textColumn.width, t.textColumn.height);
  col.itemSpacing = t.textColumn.gap;
  col.primaryAxisAlignItems = 'CENTER';
  col.counterAxisAlignItems = 'MIN';
  col.fills = [];

  inner.appendChild(col);

  /* ======================================================
   * texts
   * ====================================================== */
  for (const item of t.texts) {
    let content = '';
    if (data && data[item.slot]) {
      content = data[item.slot];
    }

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

    if (item.opacity != null) txt.opacity = item.opacity;

    col.appendChild(txt);
  }
}

/* =========================================================
 * UI handler
 * ========================================================= */
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-template') {
    const response = [
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

    const startY = figma.viewport.center.y;

    for (let i = 0; i < response.length; i++) {
      await generateHomeBanner(response[i], startY + i * 140);
    }

    figma.notify('home_banner 2개 생성 완료');
  }
};
