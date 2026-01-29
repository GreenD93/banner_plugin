// src/plugin/templates/card.ts

export const CARD_TEMPLATE = {
  /* ======================================================
   * Root : variation / home_banner (최상위)
   * ====================================================== */
  root: {
    name: 'variation / home_banner',
    width: 335,
    height: 122,
    layout: 'HORIZONTAL',
  },

  /* ======================================================
   * img
   * ====================================================== */
  img: {
    name: 'img',
    width: 60,
    height: 122,
    layout: 'VERTICAL',
    gap: 10,
    padding: {
      top: 18,
      bottom: 18,
      left: 20,
      right: 0,
    },
    background: '#F7F9FD',
    radius: {
      topLeft: 18,
      bottomLeft: 18,
    },
  },

  imgIcon: {
    name: 'adm_날짜_이벤트명_Home',
    width: 40,
    height: 40,
    background: '#FFADAD',
  },

  /* ======================================================
   * text
   * ====================================================== */
  text: {
    name: 'text',
    width: 275,
    height: 122,
    layout: 'HORIZONTAL',
    padding: {
      top: 18,
      bottom: 18,
      left: 0,
      right: 20,
    },
    background: '#F7F9FD',
    radius: {
      topRight: 18,
      bottomRight: 18,
    },
  },

  /* ======================================================
   * Frame 427321433
   * ====================================================== */
  textInner: {
    name: 'Frame 427321433',
    width: 255,
    height: 86,
    layout: 'HORIZONTAL',
    gap: 8,
    paddingLeft: 16,
  },

  /* ======================================================
   * text wrapper
   * ====================================================== */
  textWrapper: {
    name: 'text',
    width: 217,
    height: 86,
    layout: 'HORIZONTAL',
  },

  /* ======================================================
   * text column
   * ====================================================== */
  textColumn: {
    name: 'text',
    width: 217,
    height: 86,
    layout: 'VERTICAL',
    gap: 2,
  },

  /* ======================================================
   * text items (OpenAI 슬롯)
   * ====================================================== */
  texts: [
    {
      slot: 'eyebrow',
      fontSize: 14,
      lineHeight: 20,
      weight: 400,
      color: '#67748E',
      opacity: 0.8,
    },
    {
      slot: 'titleLine1',
      fontSize: 15,
      lineHeight: 20,
      weight: 700,
      color: '#3B4659',
    },
    {
      slot: 'titleLine2',
      fontSize: 15,
      lineHeight: 20,
      weight: 700,
      color: '#3B4659',
    },
    {
      slot: 'caption',
      fontSize: 14,
      lineHeight: 20,
      weight: 400,
      color: '#67748E',
      opacity: 0.8,
    },
  ],

  /* ======================================================
   * close icon
   * ====================================================== */
  closeIcon: {
    name: 'asset / ico / line / close',
    width: 14,
    height: 14,
    stroke: '#4D596F',
    strokeWidth: 1.2,
  },
};
