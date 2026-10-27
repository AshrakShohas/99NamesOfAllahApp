import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Paths
const GDRIVE_SCANS_PATH = 'E:\\My Drive\\99NamesOfAllah';
const CROPPED_PAGES_PATH = path.join(__dirname, '..', 'frontend', 'public', 'book_pages');
const DB_PATH = path.join(__dirname, 'data', 'names_database.json');
const REMINDERS_CONFIG_PATH = path.join(__dirname, 'data', 'reminders_config.json');
const EMAILS_OUTPUT_DIR = path.join(__dirname, 'sent_emails');

if (!fs.existsSync(EMAILS_OUTPUT_DIR)) {
  fs.mkdirSync(EMAILS_OUTPUT_DIR, { recursive: true });
}

// Load 99 Names Database
let namesData = [];
try {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  namesData = JSON.parse(raw);
  console.log(`[Database] Loaded ${namesData.length} Divine Names.`);
} catch (err) {
  console.error('[Database] Failed to load database:', err.message);
}

// Reminders Configuration
const defaultRemindersConfig = {
  userEmail: 'ashraks97@gmail.com',
  wifeEmail: '',
  userName: 'Ashrak & Family',
  smtp: {
    service: 'gmail', // or custom
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: 'ashraks97@gmail.com',
    pass: '' // Gmail 16-character App Password
  },
  schedules: {
    fridayReminder: {
      enabled: true,
      time: '09:00', // 9:00 AM on Friday
      nameId: 27, // Al-Basir (or 73 Al-Awwal)
      title: 'Friday Jumu\'ah Wazifa Reminder',
      description: 'Special wazaif prescribed for Friday: Al-Basir (100x between Farz & Sunnah for esteem) & Al-Awwal (1,000x for 40 Fridays).'
    },
    fajrReminder: {
      enabled: true,
      time: '05:30', // Morning Fajr time
      nameId: 2, // Ar-Rahim
      title: 'Daily Post-Fajr Wazifa Reminder',
      description: 'Recite Ya-Rahim 100 times after Fajr prayer for peace, ease, and friendly relations with all.'
    },
    thursdayZuhrReminder: {
      enabled: true,
      time: '13:00',
      nameId: 26, // As-Sami'
      title: 'Thursday Post-Zuhr Wazifa Reminder',
      description: 'Recite Ya-Sami 100 times in silence after Zuhr on Thursdays for fulfillment of your desires.'
    }
  }
};

let remindersConfig = { ...defaultRemindersConfig };
if (fs.existsSync(REMINDERS_CONFIG_PATH)) {
  try {
    const raw = fs.readFileSync(REMINDERS_CONFIG_PATH, 'utf-8');
    remindersConfig = { ...defaultRemindersConfig, ...JSON.parse(raw) };
  } catch (e) {
    console.error('[Config] Error reading reminders config:', e.message);
  }
} else {
  fs.writeFileSync(REMINDERS_CONFIG_PATH, JSON.stringify(remindersConfig, null, 2));
}

function saveRemindersConfig() {
  fs.writeFileSync(REMINDERS_CONFIG_PATH, JSON.stringify(remindersConfig, null, 2));
}

// Nodemailer Transporter Helper
function createTransporter() {
  const { user, pass, host, port, secure, service } = remindersConfig.smtp;
  if (!user || !pass) {
    return null; // Mock / Local preview mode
  }
  if (service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port: port || 465,
    secure: secure !== undefined ? secure : true,
    auth: { user, pass }
  });
}

// Generate Beautiful HTML Email Template for Reminders
function buildReminderEmailHtml({ title, name, scheduleInfo, userNote }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e2e8f0; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #161e2e; border: 2px solid #d4af37; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      .header { background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #d4af37; }
      .arabic { font-size: 42px; color: #f59e0b; margin: 10px 0; font-family: 'Amiri', 'Traditional Arabic', serif; font-weight: bold; }
      .transliteration { font-size: 20px; font-weight: bold; color: #f8fafc; letter-spacing: 2px; }
      .meaning { color: #94a3b8; font-size: 15px; margin-top: 4px; font-style: italic; }
      .content { padding: 30px 25px; line-height: 1.6; }
      .wazifa-box { background: #0f172a; border-left: 4px solid #10b981; padding: 18px; border-radius: 6px; margin: 20px 0; }
      .wazifa-formula { font-size: 20px; color: #34d399; font-weight: bold; }
      .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: #3b82f6; color: white; margin-bottom: 8px; }
      .count-badge { display: inline-block; background: #f59e0b; color: #1e1b4b; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 13px; margin-left: 8px; }
      .benefit-box { background: rgba(212, 175, 55, 0.1); border: 1px dashed #d4af37; padding: 16px; border-radius: 6px; margin: 20px 0; }
      .authenticity { font-size: 13px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 15px; margin-top: 20px; }
      .footer { background: #0f172a; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <span class="badge">✨ 99 Names of Allah • Reminder</span>
        <div class="arabic">${name.arabic}</div>
        <div class="transliteration">${name.transliteration}</div>
        <div class="meaning">"${name.name_en}" — ${name.meaning}</div>
      </div>
      <div class="content">
        <h2 style="color: #fbbf24; margin-top: 0;">${title}</h2>
        <p>Assalamu Alaikum <strong>${remindersConfig.userName || 'Brother/Sister'}</strong>,</p>
        <p>This is your personal dhikr reminder from your *Ninety-Nine Names of Allah* book (p. ${name.book_page}):</p>
        
        <div class="wazifa-box">
          <div style="font-size: 13px; color: #94a3b8; margin-bottom: 5px;">PRESCRIBED INVOCATION & TIMING:</div>
          <div class="wazifa-formula">${name.wazifa} <span class="count-badge">${name.count}× Repetitions</span></div>
          <div style="color: #cbd5e1; margin-top: 8px; font-size: 14px;"><strong>Timing:</strong> ${name.prayer_time}</div>
        </div>

        <div class="benefit-box">
          <strong style="color: #f59e0b;">📖 Stated Benefit from the Book:</strong>
          <p style="margin: 8px 0 0 0; color: #f8fafc; font-size: 15px;">"${name.benefit}"</p>
        </div>

        ${userNote ? `<div style="background: #1e293b; padding: 12px; border-radius: 6px; margin: 15px 0;"><strong>Your Personal Note:</strong> ${userNote}</div>` : ''}

        <div class="authenticity">
          <strong>Scholarly Validity Note:</strong><br>
          • <em>Divine Name:</em> ${name.authenticity.name_status} (${name.authenticity.reference})<br>
          • <em>Wazifa Practice:</em> ${name.authenticity.wazifa_status}. ${name.authenticity.scholarly_note}
        </div>
      </div>
      <div class="footer">
        Ninety-Nine Names of Allah • Shems Friedlander (1978) • Personal Digital Book<br>
        May Allah accept your dhikr and bestow peace upon your heart.
      </div>
    </div>
  </body>
  </html>
  `;
}

// Email Dispatch Handler
async function dispatchEmail({ to, subject, htmlContent }) {
  const transporter = createTransporter();
  const recipients = to || [remindersConfig.userEmail, remindersConfig.wifeEmail].filter(Boolean).join(', ');
  
  if (!transporter) {
    // Mock save to disk for preview
    const previewFile = path.join(EMAILS_OUTPUT_DIR, `reminder_${Date.now()}.html`);
    const latestFile = path.join(EMAILS_OUTPUT_DIR, 'latest_email.html');
    fs.writeFileSync(previewFile, htmlContent, 'utf-8');
    fs.writeFileSync(latestFile, htmlContent, 'utf-8');
    console.log(`[Email Preview] No SMTP configured yet. Saved preview to: ${latestFile}`);
    return {
      success: true,
      mode: 'preview',
      previewPath: '/api/reminders/preview-latest',
      recipients: recipients,
      message: `Email preview saved locally for [${recipients}]! Enter your Gmail App Password in Settings to send directly to your inbox.`
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"99 Names of Allah Dhikr" <${remindersConfig.smtp.user}>`,
      to: recipients,
      subject: subject,
      html: htmlContent
    });
    console.log(`[Email Sent] Message sent to ${recipients}: ${info.messageId}`);
    return { success: true, mode: 'sent', messageId: info.messageId, message: `Email delivered successfully to ${recipients}!` };
  } catch (err) {
    console.error('[Email Error] Failed to send email:', err);
    return { success: false, mode: 'error', error: err.message };
  }
}

// Setup Automated Cron Schedules
// 1. Friday 09:00 AM Jumu'ah reminder
cron.schedule('0 9 * * 5', async () => {
  if (remindersConfig.schedules.fridayReminder?.enabled && remindersConfig.userEmail) {
    console.log('[Cron] Running scheduled Friday reminder...');
    const name = namesData.find(n => n.id === (remindersConfig.schedules.fridayReminder.nameId || 27)) || namesData[26];
    const html = buildReminderEmailHtml({
      title: '🌟 Blessed Friday: Continuous Wazifa Reminder',
      name,
      scheduleInfo: remindersConfig.schedules.fridayReminder
    });
    await dispatchEmail({
      to: remindersConfig.userEmail,
      subject: `🌟 Friday Dhikr Reminder: Recite ${name.transliteration} today!`,
      htmlContent: html
    });
  }
});

// 2. Daily Post-Fajr reminder at 05:30 AM
cron.schedule('30 5 * * *', async () => {
  if (remindersConfig.schedules.fajrReminder?.enabled && remindersConfig.userEmail) {
    console.log('[Cron] Running scheduled Fajr reminder...');
    const name = namesData.find(n => n.id === (remindersConfig.schedules.fajrReminder.nameId || 2)) || namesData[1];
    const html = buildReminderEmailHtml({
      title: '🌅 Morning Post-Fajr Wazifa Reminder',
      name,
      scheduleInfo: remindersConfig.schedules.fajrReminder
    });
    await dispatchEmail({
      to: remindersConfig.userEmail,
      subject: `🌅 Morning Dhikr: Recite ${name.transliteration} after Fajr`,
      htmlContent: html
    });
  }
});

// --- API ENDPOINTS ---

// 1. Get All Names
app.get('/api/names', (req, res) => {
  res.json(namesData);
});

// 2. Get Single Name by ID
app.get('/api/names/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = namesData.find(n => n.id === id);
  if (!item) return res.status(404).json({ error: 'Name not found' });
  res.json(item);
});

// 3. Situational and Prayer Search
app.post('/api/query', (req, res) => {
  const { query, prayerCategory, tag } = req.body;
  let results = [...namesData];

  if (prayerCategory && prayerCategory !== 'all') {
    results = results.filter(n => 
      n.prayer_category === prayerCategory || 
      n.prayer_time.toLowerCase().includes(prayerCategory.toLowerCase()) ||
      n.situation_tags.includes(prayerCategory.toLowerCase())
    );
  }

  if (tag) {
    results = results.filter(n => n.situation_tags.includes(tag.toLowerCase()));
  }

  if (query && query.trim() !== '') {
    const q = query.toLowerCase();
    results = results.filter(n => 
      n.transliteration.toLowerCase().includes(q) ||
      n.name_en.toLowerCase().includes(q) ||
      n.meaning.toLowerCase().includes(q) ||
      n.wazifa.toLowerCase().includes(q) ||
      n.benefit.toLowerCase().includes(q) ||
      n.prayer_time.toLowerCase().includes(q) ||
      n.situation_tags.some(t => t.includes(q))
    );
  }

  res.json({ count: results.length, results });
});

// 4. Reminders Config
app.get('/api/reminders/config', (req, res) => {
  // Hide sensitive SMTP password in GET
  const safeConfig = {
    ...remindersConfig,
    smtp: {
      ...remindersConfig.smtp,
      pass: remindersConfig.smtp.pass ? '••••••••••••' : '',
      isConfigured: Boolean(remindersConfig.smtp.user && remindersConfig.smtp.pass)
    }
  };
  res.json(safeConfig);
});

app.post('/api/reminders/config', (req, res) => {
  const { userEmail, wifeEmail, userName, smtp, schedules } = req.body;
  if (userEmail !== undefined) remindersConfig.userEmail = userEmail;
  if (wifeEmail !== undefined) remindersConfig.wifeEmail = wifeEmail;
  if (userName !== undefined) remindersConfig.userName = userName;
  if (schedules) remindersConfig.schedules = { ...remindersConfig.schedules, ...schedules };
  
  if (smtp) {
    if (smtp.pass && smtp.pass !== '••••••••••••') {
      remindersConfig.smtp.pass = smtp.pass;
    }
    if (smtp.user !== undefined) remindersConfig.smtp.user = smtp.user;
    if (smtp.service !== undefined) remindersConfig.smtp.service = smtp.service;
  }

  saveRemindersConfig();
  res.json({ success: true, message: 'Settings saved successfully!' });
});

// 5. Send Test Reminder Email
app.post('/api/reminders/send-test', async (req, res) => {
  const { nameId = 27, targetEmail } = req.body;
  const name = namesData.find(n => n.id === parseInt(nameId, 10)) || namesData[0];
  const emailTo = targetEmail || [remindersConfig.userEmail, remindersConfig.wifeEmail].filter(Boolean).join(', ');

  if (!emailTo) {
    return res.status(400).json({ error: 'Please enter your email address first.' });
  }

  const html = buildReminderEmailHtml({
    title: '🔔 Test Reminder: ' + name.transliteration,
    name,
    scheduleInfo: remindersConfig.schedules.fridayReminder,
    userNote: 'This is a test reminder sent to you and your family to ensure you receive notifications directly.'
  });

  const result = await dispatchEmail({
    to: emailTo,
    subject: `✨ 99 Names Test Reminder: ${name.transliteration} (${name.wazifa} - ${name.count}x)`,
    htmlContent: html
  });

  res.json(result);
});

// 6. Trigger Friday Reminder Manually
app.post('/api/reminders/trigger-friday', async (req, res) => {
  const emailTo = req.body.targetEmail || [remindersConfig.userEmail, remindersConfig.wifeEmail].filter(Boolean).join(', ');
  if (!emailTo) {
    return res.status(400).json({ error: 'Please set your email address first.' });
  }

  const name = namesData.find(n => n.id === 27) || namesData[26]; // Al-Basir
  const html = buildReminderEmailHtml({
    title: '🌟 Friday Continuous Wazifa Reminder',
    name,
    scheduleInfo: remindersConfig.schedules.fridayReminder,
    userNote: 'Friday special recitation: Between farz and sunnah at Friday afternoon prayer.'
  });

  const result = await dispatchEmail({
    to: emailTo,
    subject: `🌟 Friday Dhikr Reminder: Recite ${name.transliteration} for Esteem & Blessing`,
    htmlContent: html
  });

  res.json(result);
});

// 7. Preview Latest Saved Email in Browser
app.get('/api/reminders/preview-latest', (req, res) => {
  const latestFile = path.join(EMAILS_OUTPUT_DIR, 'latest_email.html');
  if (fs.existsSync(latestFile)) {
    res.sendFile(latestFile);
  } else {
    res.send('<h3>No emails sent or previewed yet. Click "Send Test Reminder" in the app!</h3>');
  }
});

// 8. Stream high-res original scan from Google Drive folder (with fallback to book_pages)
app.get('/scans/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(GDRIVE_SCANS_PATH, filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    return res.sendFile(filePath);
  }
  // Fallback to bundled page scan
  const fallback = path.join(CROPPED_PAGES_PATH, 'page_020.jpg');
  if (fs.existsSync(fallback)) {
    res.setHeader('Content-Type', 'image/jpeg');
    return res.sendFile(fallback);
  }
  res.status(404).send('Scan not found.');
});

// 9. Stream individual cropped book page
app.get('/scans/page/:page', (req, res) => {
  const pageNum = parseInt(req.params.page, 10);
  const formatted = `page_${String(pageNum).padStart(3, '0')}.jpg`;
  const filePath = path.join(CROPPED_PAGES_PATH, formatted);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page image not found.');
  }
});

// Serve Frontend Static Files (from build)
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/scans')) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[Backend] 99 Names of Allah API & Reminder Service running on http://localhost:${PORT}`);
});
