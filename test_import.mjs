import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const assetsDir = path.join(process.cwd(), 'dist/assets');
const files = fs.readdirSync(assetsDir);
const mainJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="root"></div></body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.MutationObserver = dom.window.MutationObserver;

try {
  await import(path.join('file://', assetsDir, mainJs));
  console.log("Bundle loaded successfully!");
} catch (e) {
  console.log("Error:", e);
}
