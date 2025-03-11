const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("📦 Checking Puppeteer installation...");
        const browserFetcher = puppeteer.createBrowserFetcher();
        const revisionInfo = await browserFetcher.download(puppeteer.defaultRevision);

        console.log("✅ Puppeteer installed successfully at:", revisionInfo.executablePath);
    } catch (error) {
        console.error("❌ Error installing Puppeteer:", error.message);
        process.exit(1); // Prevent build if Puppeteer fails
    }
})();
