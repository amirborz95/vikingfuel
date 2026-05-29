import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = Number(process.env.SMTP_PORT || '587');
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const recipientEmail = process.env.CONTACT_RECIPIENT || 'info@vikingfuel.se';
const senderEmail = process.env.CONTACT_SENDER || `Viking Fuel <${smtpUser || 'info@vikingfuel.se'}>`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Alla fält måste fyllas i.' }, { status: 400 });
    }

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP not configured');
      return NextResponse.json({ error: 'SMTP ej konfigurerat på servern.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: `Kontaktförfrågan från Vikingfuel: ${name}`,
      text: `Namn: ${name}\nE-post: ${email}\n\n${message}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Contact email error:', err);
    return NextResponse.json({ error: 'Kunde inte skicka meddelandet.' }, { status: 500 });
  }
}
