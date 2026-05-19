import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  // Grant geolocation permission and mock geolocation coordinate (Islamabad)
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 33.6844, longitude: 73.0479 });

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

    // Simulate clicking on the Leaflet map (center click)
    console.log('Clicking the map to drop a pin...');
    const mapBoundingBox = await page.locator('.leaflet-container').boundingBox();
    if (mapBoundingBox) {
      const clickX = mapBoundingBox.x + mapBoundingBox.width / 2;
      const clickY = mapBoundingBox.y + mapBoundingBox.height / 2;
      await page.mouse.click(clickX, clickY);
      console.log(`Clicked map at coordinates x=${clickX}, y=${clickY}`);
    } else {
      throw new Error('Failed to find Leaflet container bounding box');
    }

    // Wait for the reverse geocoded address to resolve in the footer
    console.log('Waiting for geocoded address in footer...');
    await page.waitForSelector('text=Selected Location', { timeout: 10000 });
    const selectedAddressText = await page.locator('text=Selected Location >> xpath=..').innerText();
    console.log('Geocoded Address returned:', selectedAddressText.replace(/\n/g, ' '));

    console.log('Clicking "Confirm Location" button...');
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
