figma.showUI(__html__, {
  width: 400,
  height: 1000,
});

/* =========================================================
 * Extract : Figma Node → JSON (절대좌표 기반)
 * ========================================================= */

async function extractNode(node: SceneNode): Promise<any> {
  var base: any = {
    type: node.type,
    name: node.name,
    x: 'x' in node ? (node as any).x : 0,
    y: 'y' in node ? (node as any).y : 0,
    width: 'width' in node ? (node as any).width : 0,
    height: 'height' in node ? (node as any).height : 0,
  };

  /* ---------- ASSET (icon frame → image) ---------- */
  if (
    node.type === 'FRAME' &&
    node.name.indexOf('asset') === 0
  ) {
    var bytes = await node.exportAsync({ format: 'PNG' });
    var image = figma.createImage(bytes);

    return {
      type: 'ASSET',
      name: node.name,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      imageHash: image.hash,
    };
  }

  /* ---------- TEXT ---------- */
  if (node.type === 'TEXT') {
    var t = node as TextNode;
    base.characters = t.characters;
    base.fontSize = t.fontSize;

    if (t.fontName && typeof t.fontName === 'object') {
      base.fontName = {
        family: t.fontName.family,
        style: t.fontName.style,
      };
    }

    base.fills = Array.isArray(t.fills)
      ? JSON.parse(JSON.stringify(t.fills))
      : [];
  }

  /* ---------- RECTANGLE ---------- */
  if (node.type === 'RECTANGLE') {
    var r = node as RectangleNode;
    base.fills = Array.isArray(r.fills)
      ? JSON.parse(JSON.stringify(r.fills))
      : [];
    base.cornerRadius =
      typeof r.cornerRadius === 'number'
        ? r.cornerRadius
        : 0;
  }

  /* ---------- CHILDREN ---------- */
  if ('children' in node) {
    base.children = [];
    for (var i = 0; i < (node as any).children.length; i++) {
      base.children.push(
        await extractNode((node as any).children[i])
      );
    }
  }

  return base;
}

/* =========================================================
 * Render : JSON → Figma Node (절대좌표 기반)
 * ========================================================= */

async function renderNode(
  data: any,
  parent: BaseNode & ChildrenMixin
) {
  var node: SceneNode | null = null;

  if (data.type === 'FRAME') {
    var f = figma.createFrame();
    f.resize(data.width, data.height);
    f.x = data.x;
    f.y = data.y;
    node = f;
  }

  if (data.type === 'TEXT') {
    var text = figma.createText();
    var font = data.fontName
      ? data.fontName
      : { family: 'Inter', style: 'Regular' };

    await figma.loadFontAsync(font);

    text.fontName = font;
    text.characters = data.characters || '';
    text.fontSize = data.fontSize || 12;
    text.fills = Array.isArray(data.fills)
      ? data.fills
      : [];

    text.x = data.x;
    text.y = data.y;
    node = text;
  }

  if (data.type === 'ASSET') {
    var rect = figma.createRectangle();
    rect.resize(data.width, data.height);
    rect.x = data.x;
    rect.y = data.y;
    rect.fills = [
      {
        type: 'IMAGE',
        imageHash: data.imageHash,
        scaleMode: 'FILL',
      },
    ];
    node = rect;
  }

  if (data.type === 'RECTANGLE') {
    var rr = figma.createRectangle();
    rr.resize(data.width, data.height);
    rr.x = data.x;
    rr.y = data.y;
    rr.fills = Array.isArray(data.fills)
      ? data.fills
      : [];
    rr.cornerRadius = data.cornerRadius || 0;
    node = rr;
  }

  if (!node) return;

  node.name = data.name;
  parent.appendChild(node);

  if (data.children) {
    for (var j = 0; j < data.children.length; j++) {
      await renderNode(data.children[j], node as any);
    }
  }
}

/* =========================================================
 * UI Message Handler
 * ========================================================= */

figma.ui.onmessage = async function (msg) {
  switch (msg.type) {
    case 'extract-template': {
      var selection = figma.currentPage.selection;
      if (selection.length !== 1) {
        figma.notify('Frame 하나만 선택하세요');
        return;
      }

      var json = await extractNode(selection[0]);
      await figma.clientStorage.setAsync(
        'default-template',
        json
      );

      console.log('📦 TEMPLATE JSON', json);
      figma.notify('템플릿 추출 완료');
      break;
    }

    case 'generate-template': {
      var stored = await figma.clientStorage.getAsync(
        'default-template'
      );
      if (!stored) {
        figma.notify('저장된 템플릿이 없습니다');
        return;
      }

      var frame = figma.createFrame();
      frame.name = stored.name + '_generated';
      frame.resize(stored.width, stored.height);
      frame.x = stored.x;
      frame.y = stored.y;
      figma.currentPage.appendChild(frame);

      for (var i = 0; i < stored.children.length; i++) {
        await renderNode(stored.children[i], frame);
      }

      figma.notify('🎉 템플릿 생성 완료');
      break;
    }
  }
};
