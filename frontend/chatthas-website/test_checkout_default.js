import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const page = await context.newPage();

  // Log all console errors/messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER EXCEPTION]:`, err);
  });

  try {
    console.log('Navigating to website homepage...');
    await page.goto('http://localhost:5173');

    console.log('Setting mock cart in localStorage...');
    await page.evaluate(() => {
      localStorage.setItem('chatthas_cart', JSON.stringify([
        { id: 'item-1', name: 'Chicken Karahi', price: '1200', quantity: 1 }
      ]));
    });

    console.log('Navigating to checkout page...');
    await page.goto('http://localhost:5173/checkout');

    console.log('Waiting for checkout page and Leaflet map to load...');
    await page.waitForSelector('.leaflet-container', { timeout: 10000 });
    console.log('Leaflet Map container loaded successfully!');

    // Wait for the default geocoded address to resolve in the footer automatically on mount
    console.log('Waiting for default geocoded address to load...');
    await page.waitForSelector('text=Selected Location', { timeout: 10000 });
    const selectedAddressText = await page.locator('text=Selected Location >> xpath=..').innerText();
    console.log('Default Geocoded Address returned:', selectedAddressText.replace(/\n/g, ' '));

    console.log('Clicking "Confirm Location" button to confirm default location...');
    await page.click('button:has-text("Confirm Location")');
    
    await page.waitForTimeout(2000);
    console.log('Checking if map modal is closed...');
    const isModalVisible = await page.isVisible('text=Select Delivery Location');
    if (isModalVisible) {
      console.log('Map modal is STILL OPEN! Confirm Location did not close it.');
    } else {
      console.log('Map modal successfully CLOSED!');
      
      // Let's verify that the address field in Checkout page is updated
      const addressVal = await page.inputValue('textarea[name="address"]');
      console.log('Address value in main checkout form:', addressVal);
    }
  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
