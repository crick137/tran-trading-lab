import { runOnce } from './bot.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const list = await runOnce();
await fs.mkdir(path.join(__dirname, '../../public'), { recursive: true });
await fs.writeFile(path.join(__dirname, '../../public/news.json'), JSON.stringify(list, null, 2));
console.log('saved public/news.json with', list.length, 'items');
