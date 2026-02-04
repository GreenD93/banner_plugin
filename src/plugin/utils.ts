// src/plugin/utils.ts

export function hex(hexStr: string) {
  const c = hexStr.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255,
  };
}

export async function loadPretendard() {
  await figma.loadFontAsync({ family: 'Pretendard K Edition', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Pretendard K Edition', style: 'Bold' });
}
