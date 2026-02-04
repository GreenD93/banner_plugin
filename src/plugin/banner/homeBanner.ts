// src/plugin/banner/homeBanner.ts

import { CARD_TEMPLATE as card } from '../templates/card';
import { hex } from '../utils';
import type { HomeBannerAIResult } from '../types';

export const HOME_CONTENTS: HomeBannerAIResult[] = [
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

export async function generateHomeBanner(
  data: HomeBannerAIResult,
  offsetY: number
): Promise<void> {
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
