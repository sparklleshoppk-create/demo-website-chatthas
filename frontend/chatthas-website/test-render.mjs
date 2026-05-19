import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

const rootText = await page.locator('#root').innerText();
const rootHtml = await page.locator('#root').innerHTML();
const title = await page.title();

console.log('TITLE:', title);
console.log('ROOT_TEXT_LENGTH:', rootText.trim().length);
console.log('ROOT_HTML_LENGTH:', rootHtml.length);
console.log('ROOT_TEXT_PREVIEW:', rootText.slice(0, 200));
console.log('ERRORS:', errors);

await browser.close();
