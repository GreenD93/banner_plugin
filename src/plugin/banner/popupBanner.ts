// src/plugin/banner/popupBanner.ts

import { POPUP_TEMPLATE as popup } from '../templates/popup';
import { hex } from '../utils';
import type { PopupAIResult } from '../types';

export const POPUP_CONTENTS: PopupAIResult[] = [
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

export async function generatePopup(
  data: PopupAIResult,
  offsetY: number
): Promise<void> {
  const root = figma.createFrame();
  root.name = popup.root.name;
  root.layoutMode = 'VERTICAL';
  root.resize(popup.root.width, popup.root.height);
  root.y = offsetY;
  root.primaryAxisSizingMode = 'FIXED';
  root.counterAxisSizingMode = 'FIXED';
  root.fills = [];
  figma.currentPage.appendChild(root);

  /* TOP IMAGE */
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

  /* TEXT */
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

  /* BOTTOM */
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
  bottom.fills = [{ type: 'SOLID', color: hex(popup.bottom.background) }];
  root.appendChild(bottom);

  await figma.loadFontAsync({
    family: 'Inter',
    style: 'Regular',
  });

  const BUTTON_WIDTH = 108;
  const BUTTON_HEIGHT = 20;

  const leftBtn = figma.createText();
  leftBtn.characters = popup.buttons[0].text;
  leftBtn.fontSize = 14;
  leftBtn.lineHeight = { value: 20, unit: 'PIXELS' };
  leftBtn.fontName = { family: 'Pretendard K Edition', style: 'Regular' };
  leftBtn.fills = [{ type: 'SOLID', color: hex('#020616') }];
  leftBtn.resize(BUTTON_WIDTH, BUTTON_HEIGHT);
  leftBtn.textAutoResize = 'NONE';
  leftBtn.textAlignHorizontal = 'LEFT';
  leftBtn.textAlignVertical = 'CENTER';
  bottom.appendChild(leftBtn);

  const rightBtn = figma.createText();
  rightBtn.characters = popup.buttons[1].text;
  rightBtn.fontSize = 14;
  rightBtn.lineHeight = { value: 20, unit: 'PIXELS' };
  rightBtn.fontName = { family: 'Pretendard K Edition', style: 'Regular' };
  rightBtn.fills = [{ type: 'SOLID', color: hex('#020616') }];
  rightBtn.resize(BUTTON_WIDTH, BUTTON_HEIGHT);
  rightBtn.textAutoResize = 'NONE';
  rightBtn.textAlignHorizontal = 'RIGHT';
  rightBtn.textAlignVertical = 'CENTER';
  bottom.appendChild(rightBtn);
}
