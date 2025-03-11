const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("📦 Installing Puppeteer...");
        await puppeteer.createBrowserFetcher().download(puppeteer.defaultRevision);
        console.log("✅ Puppeteer installed successfully!");
    } catch (error) {
        console.error("❌ Error installing Puppeteer:", error.message);
        process.exit(1); // Stop build if Puppeteer fails
    }
})();
