const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
  
  // Rename executablePath to path1
  path1: "/opt/render/.cache/puppeteer/chrome/linux-134.0.6998.35/chrome-linux64/chrome"
};
