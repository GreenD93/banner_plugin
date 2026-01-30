// src/plugin/templates/popup.ts

export const POPUP_TEMPLATE = {
    /* Root */
    root: {
      name: 'variation / main_pop',
      width: 280,
      height: 291,
      layout: 'VERTICAL',
    },
  
    /* Top image area */
    topImage: {
      name: 'mainPOP_ex',
      width: 280,
      height: 120,
      layout: 'VERTICAL',
      paddingTop: 30,
      background: '#E7EBF4',
      radius: {
        topLeft: 16,
        topRight: 16,
      },
      align: 'CENTER',
    },
  
    imageFrame: {
      name: 'Frame 12',
      width: 90,
      height: 90,
      layout: 'VERTICAL',
      align: 'CENTER',
    },
  
    image: {
      name: '0215_Eventname_mainPOP_A',
      width: 90,
      height: 90,
      background: 'rgba(255, 173, 173, 0.4)',
    },
  
    /* Text area */
    textSection: {
      name: 'TOP_text',
      width: 280,
      height: 111,
      layout: 'VERTICAL',
      padding: {
        top: 10,
        bottom: 26,
        left: 30,
        right: 30,
      },
      background: '#E7EBF4',
      align: 'CENTER',
      gap: 5,
    },
  
    textWrapper: {
      name: 'text',
      width: 220,
      height: 75,
      layout: 'VERTICAL',
      align: 'CENTER',
      gap: 5,
    },
  
    texts: [
      {
        slot: 'sub',
        fontSize: 11,
        lineHeight: 15,
        weight: 400,
        color: '#5B5B5B',
      },
      {
        slot: 'title1',
        fontSize: 21,
        lineHeight: 24,
        weight: 700,
        color: '#020616',
      },
      {
        slot: 'title2',
        fontSize: 21,
        lineHeight: 24,
        weight: 700,
        color: '#020616',
      },
    ],
  
    /* Bottom buttons */
    bottom: {
      name: 'w bg',
      width: 280,
      height: 60,
      layout: 'HORIZONTAL',
      padding: {
        top: 8,
        bottom: 8,  
        left: 16,
        right: 16,
      },
      gap: 23,
      background: '#FFFFFF',
    },
  
    buttons: [
      { text: '이 혜택 오늘 안보기' },
      { text: '닫기' },
    ],
  };
  