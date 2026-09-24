import { writeFileSync, existsSync } from 'node:fs';

const [type, ...words] = process.argv.slice(2);
const title = words.join(' ');
const today = new Date().toISOString().slice(0, 10);
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const templates = {
  journal: `---
title: ${JSON.stringify(title)}
summary: ''
date: ${today}
status: hypothesis
setup: ''
draft: true
topics: []
tags: []
research: []
---

`,
  lecture: `---
title: ${JSON.stringify(title)}
summary: ''
format: for-the-room
forTheRoom: |
  
published: ${today}
draft: true
topics: []
tags: []
research: []
---

`,
  lab: `---
title: ${JSON.stringify(title)}
summary: ''
kind: project
status: active
role: ''
period: ''
draft: true
topics: []
tags: []
research: []
---

## The problem

## What it is

## Status
`,
  research: `---
title: ${JSON.stringify(title)}
summary: ''
status: exploratory
version: '0.1'
started: ${today}
questions: []
draft: true
topics: []
tags: []
---

`,
  paper: `---
title: ${JSON.stringify(title)}
summary: ''
published: ${today}
draft: true
topics: []
tags: []
research: []
---

`,
};

const folders = { journal: 'journal', lecture: 'lectures', lab: 'labs', research: 'research', paper: 'papers' };

if (!templates[type] || !title) {
  console.log('Usage: npm run new <journal|lecture|lab|research|paper> Title of the piece');
  process.exit(1);
}

const path = `src/content/${folders[type]}/${slug}.md`;
if (existsSync(path)) {
  console.log(`${path} already exists`);
  process.exit(1);
}
writeFileSync(path, templates[type]);
console.log(`Created ${path}`);
