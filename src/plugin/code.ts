// src/plugin/code.ts

import { CARD_TEMPLATE as t } from './templates/card';

figma.showUI(__html__, { width: 400, height: 1000 });

/* =========================================================
 * Utils
 * ========================================================= */
function hex(hex: string) {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255,
  };
}

/* =========================================================
 * Generate variation / home_banner
 * ========================================================= */
async function generateHomeBanner(marketingCopy: { [key: string]: string }) {
  /* ---------- Root ---------- */
  const root = figma.createFrame();
  root.name = t.root.name;
  root.layoutMode = 'HORIZONTAL';
  root.resize(t.root.width, t.root.height);
  root.primaryAxisSizingMode = 'FIXED';
  root.counterAxisSizingMode = 'FIXED';
  root.fills = [];

  figma.currentPage.appendChild(root);

  /* ======================================================
   * img
   * ====================================================== */
  const img = figma.createFrame();
  img.name = t.img.name;
  img.layoutMode = 'VERTICAL';
  img.resize(t.img.width, t.img.height);
  img.primaryAxisAlignItems = 'CENTER';
  img.counterAxisAlignItems = 'MIN';
  img.itemSpacing = t.img.gap;

  img.paddingTop = t.img.padding.top;
  img.paddingBottom = t.img.padding.bottom;
  img.paddingLeft = t.img.padding.left;
  img.paddingRight = t.img.padding.right;

  img.fills = [{ type: 'SOLID', color: hex(t.img.background) }];
  img.topLeftRadius = t.img.radius.topLeft;
  img.bottomLeftRadius = t.img.radius.bottomLeft;

  root.appendChild(img);

  const imgIcon = figma.createRectangle();
  imgIcon.name = t.imgIcon.name;
  imgIcon.resize(t.imgIcon.width, t.imgIcon.height);
  imgIcon.fills = [{ type: 'SOLID', color: hex(t.imgIcon.background) }];
  img.appendChild(imgIcon);

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
  inner.fills = [];

  text.appendChild(inner);

  /* ======================================================
   * text wrapper
   * ====================================================== */
  const wrapper = figma.createFrame();
  wrapper.name = t.textWrapper.name;
  wrapper.layoutMode = 'HORIZONTAL';
  wrapper.resize(t.textWrapper.width, t.textWrapper.height);
  wrapper.primaryAxisAlignItems = 'CENTER';
  wrapper.fills = [];

  inner.appendChild(wrapper);

  /* ======================================================
   * text column
   * ====================================================== */
  const col = figma.createFrame();
  col.name = t.textColumn.name;
  col.layoutMode = 'VERTICAL';
  col.resize(t.textColumn.width, t.textColumn.height);
  col.itemSpacing = t.textColumn.gap;
  col.fills = [];

  wrapper.appendChild(col);

  /* ======================================================
   * texts (Figma-safe)
   * ====================================================== */
  for (const item of t.texts) {
    let content = '';
    if (marketingCopy && marketingCopy[item.slot]) {
      content = marketingCopy[item.slot];
    }

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

    if (item.opacity != null) {
      txt.opacity = item.opacity;
    }

    col.appendChild(txt);
  }

  /* ======================================================
   * close icon (placeholder)
   * ====================================================== */
  const close = figma.createFrame();
  close.name = t.closeIcon.name;
  close.resize(t.closeIcon.width, t.closeIcon.height);
  close.fills = [];
  inner.appendChild(close);

  figma.viewport.scrollAndZoomIntoView([root]);
}

/* =========================================================
 * UI handler
 * ========================================================= */
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-template') {
    const marketingCopy = {
      eyebrow: 'D-3',
      titleLine1: '지금 안 사면',
      titleLine2: '후회할 혜택',
      caption: '단 3일간 진행됩니다',
    };

    await generateHomeBanner(marketingCopy);
    figma.notify('variation / home_banner 생성 완료');
  }
};
