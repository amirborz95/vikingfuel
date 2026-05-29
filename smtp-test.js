const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const envPath = path.join(__dirname, '.env.local');
const envText = fs.readFileSync(envPath, 'utf8');
const result = {};
envText.split(/\r?\n/).forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
  const [key, ...rest] = trimmed.split('=');
  result[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});
const smtpHost = result.SMTP_HOST;
const smtpPort = Number(result.SMTP_PORT || '465');
const smtpUser = result.SMTP_USER;
const smtpPass = result.SMTP_PASS;
console.log({ smtpHost, smtpPort, smtpUser, smtpPass: smtpPass ? 'SET' : 'EMPTY' });
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});
transporter.verify((err, success) => {
  if (err) {
    console.error('verify error', err);
    process.exit(1);
  } else {
    console.log('verify success', success);
    process.exit(0);
  }
});
