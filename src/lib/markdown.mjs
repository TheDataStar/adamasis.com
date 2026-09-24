// Turns footnotes and <Note> tags into margin notes, lone images into numbered figures,
// and wraps tables so they scroll on small screens.

const isEl = (n, tag) => n?.type === 'element' && (!tag || n.tagName === tag);
const blank = (n) => n.type === 'text' && !n.value.trim();

function each(node, fn) {
  if (!node.children) return;
  node.children.forEach((child, i) => fn(child, i, node));
  node.children.forEach((child) => each(child, fn));
}

function withoutBackrefs(nodes) {
  return nodes
    .filter((n) => !(isEl(n) && n.properties?.dataFootnoteBackref !== undefined))
    .map((n) => (n.children ? { ...n, children: withoutBackrefs(n.children) } : n));
}

export function notebookMarkdown() {
  return (tree) => {
    const notes = new Map();
    each(tree, (n) => {
      const id = n.properties?.id;
      if (isEl(n, 'li') && typeof id === 'string' && id.includes('fn-')) {
        const inline = n.children.flatMap((c) => (isEl(c, 'p') ? c.children : isEl(c) ? [c] : []));
        notes.set(id, withoutBackrefs(inline));
      }
    });

    const extra = [];
    each(tree, (n, i, parent) => {
      if (n.type === 'raw' && /^<note>$/i.test(n.value.trim())) {
        const end = parent.children.findIndex((c, j) => j > i && c.type === 'raw' && /^<\/note>$/i.test(c.value.trim()));
        if (end === -1) return;
        const content = parent.children.slice(i + 1, end);
        const number = String(notes.size + extra.length + 1);
        extra.push({ number, children: content });
        parent.children.splice(i, end - i + 1,
          { type: 'element', tagName: 'sup', properties: {}, children: [
            { type: 'element', tagName: 'a', properties: { href: `#note-${number}`, id: `note-ref-${number}` }, children: [{ type: 'text', value: number }] }] },
          { type: 'element', tagName: 'span', properties: { className: ['sidenote'], dataN: number, role: 'note' }, children: content },
        );
        return;
      }

      if (isEl(n, 'sup')) {
        const ref = n.children.find((c) => isEl(c, 'a') && c.properties?.dataFootnoteRef !== undefined);
        const target = ref && String(ref.properties.href).slice(1);
        if (!target || !notes.has(target)) return;
        const number = ref.children.map((c) => c.value ?? '').join('');
        parent.children.splice(i + 1, 0, {
          type: 'element',
          tagName: 'span',
          properties: { className: ['sidenote'], dataN: number, role: 'note' },
          children: notes.get(target),
        });
      }

      if (isEl(n, 'p')) {
        const content = n.children.filter((c) => !blank(c));
        if (content.length === 1 && isEl(content[0], 'img')) {
          const img = content[0];
          const caption = img.properties.title || img.properties.alt || '';
          delete img.properties.title;
          img.properties.loading = 'lazy';
          parent.children[i] = {
            type: 'element',
            tagName: 'figure',
            properties: {},
            children: [img, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] }],
          };
        }
      }

      if (isEl(n, 'table') && !(isEl(parent, 'div') && parent.properties?.className?.includes('table-wrap'))) {
        parent.children[i] = { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [n] };
      }
    });

    if (extra.length) {
      tree.children.push({
        type: 'element', tagName: 'section', properties: { className: ['footnotes'] }, children: [
          { type: 'element', tagName: 'h2', properties: {}, children: [{ type: 'text', value: 'Notes' }] },
          { type: 'element', tagName: 'ol', properties: { start: Number(extra[0].number) }, children: extra.map((e) => (
            { type: 'element', tagName: 'li', properties: { id: `note-${e.number}` }, children: e.children }
          )) },
        ],
      });
    }
  };
}
