const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const clickRoutes = require('./routes/clickRoutes');
const ClickCount = require('./models/ClickCount');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/captcha', express.static(path.join(__dirname, 'captcha')));


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/clicks', clickRoutes);

let page; // Puppeteer page instance
let browser; // Puppeteer browser instance

// Puppeteer route to open the page
app.get('/api/open-url', async (req, res) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined, // Use auto-detected Chromium
      });
    }

    // Close the default blank tab if it exists
    const pages = await browser.pages();
     
    // Open the required page
    page = await browser.newPage();
    await page.goto('https://coe1.annauniv.edu/home/index.php', { waitUntil: 'domcontentloaded' });
    if (pages.length > 0) {
      await pages[0].close();
    }
    res.json({ message: 'Page opened successfully' });
  } catch (error) {
    console.error('Error opening the page:', error.message);
    res.status(500).json({ message: 'Failed to open page', error: error.message });
  }
});

app.post('/submit-login', async (req, res) => {
  console.log('Received login request!');
  try {
    const { username, password, captcha } = req.body;
    console.log('Typing into login form...');

    await page.type('#register_no', username);
    await page.type('#dob', password);
    await page.type('#security_code_student', captcha);
    const buttons = await page.$$('input#gos'); // Get ALL with ID 'gos'
if (buttons.length >= 2) {
  await buttons[1].click(); // Index 1 = second button
  console.log('🚀 Clicked the second #gos button!');
} else {
  console.error('💥 Not enough #gos buttons found!');
}
// Wait for possible failure alert popup (inside page)
const failPopup = await page.$('#popup_message_id'); // change to actual popup selector
if (failPopup) {
  const msg = await page.evaluate(el => el.textContent, failPopup);
  throw new Error(`Login failed: ${msg}`);
}
  // Step 3: Wait for result page link to load
  await page.waitForSelector('#tab4', { visible: true, timeout: 10000 });
  console.log('📄 Exam Results tab loaded');

  // Step 4: Click the "Exam Results" tab
  await page.click('#tab4');
  console.log('📊 Navigated to Exam Results page');

    res.json({ status: 'success', message: 'Login submitted!' });
  } catch (err) {
    console.error('🔥 Error in automation:', err.message);
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Puppeteer route to scrape data after reaching the result page
app.get('/api/scrape-data', async (req, res) => {
  try {
    if (!page) {
      return res.status(400).json({ message: 'Page not initialized. Please open the URL first.' });
    }

    await page.waitForSelector('table');
    const tableData = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      return tables.map((table) => {
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map((row) => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          return cells.map((cell) => cell.innerText.trim())
        .filter(text => text !== '');
        });
      });
    });
    function extractStudentDetails(rawData) {
      const flat = rawData.flat(2).join(' '); // Flatten and clean the text
      const registerNumber = flat.match(/Register Number[:\s]*([\w\d]+)/i)?.[1] || '';
      const name = flat.match(/Name[:\s]*([A-Za-z]+)/i)?.[1] || '';
      const institution = flat.match(/Institution[:\s]*([\w\d]+)/i)?.[1] || '';
      const branch = flat.match(/Branch[:\s]*([A-Za-z0-9]+)/i)?.[1] || '';
      return { registerNumber, name, institution, branch };
    }
    const studentDetails = extractStudentDetails(tableData);

    const semesters = {};
    tableData.forEach(arr => {
      arr.forEach(item => {
        const semester = item[0];
        if (/^(0[1-8])$/.test(semester)) {
          if (!semesters[semester]) {
            semesters[semester] = [];
          }
          semesters[semester].push({ subjectCode: item[1], grade: item[2] });
        }
      });
    });

    const availableSemesters = Object.keys(semesters).map(s => parseInt(s, 10));

    res.json({
      message: 'Scraped data successfully',
      availableSemesters,
      semesterData: semesters
    });

  } catch (error) {
    console.error('Error during scraping:', error.message);
    res.status(500).json({ message: 'Failed to scrape data', error: error.message });
  }
});

// Route to close the browser tab
app.get('/api/close-tab', async (req, res) => {
  try {
    if (browser) {
      await browser.close();
      browser = null; // Reset browser reference
      page = null; // Reset page reference
      res.json({ status: 'Tab Closed' });
    } else {
      res.status(500).json({ status: 'No active tab to close' });
    }
  } catch (error) {
    console.error('Error closing the tab:', error.message);
    res.status(500).json({ status: 'Failed to close tab', error: error.message });
  }
});
// Increment Click Count
app.post('/api/clicks/:type', async (req, res) => {
  const { type } = req.params; // 'GPA' or 'CGPA'
  
  if (!['GPA', 'CGPA', 'Auto_GPA'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
  }

  try {
      const click = await ClickCount.findOneAndUpdate(
          { type },
          { $inc: { count: 1 } },
          { new: true, upsert: true }
      );
      res.json({ message: `${type} button clicked`, totalClicks: click.count });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// Get Click Counts
app.get('/api/clicks', async (req, res) => {
  try {
      const clicks = await ClickCount.find();
      res.json(clicks);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});
// Serve static files from the Angular build
// Serve Angular frontend
app.use(express.static(path.join(__dirname, '../dist/browser')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/browser/index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
