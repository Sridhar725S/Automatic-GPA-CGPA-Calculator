const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
  path1: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable"
};

