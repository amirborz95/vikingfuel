import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// TEMPORARY diagnostic endpoint — verifies that the running environment (e.g.
// Netlify production) actually has the SMTP env vars and can reach the mail
// server. Gated by the admin password. Remove after debugging.
export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') || '';
  if (key !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const sender = process.env.ORDER_CONFIRMATION_SENDER || '';

  // What the function actually sees (password value never exposed).
  const env = {
    SMTP_HOST: host || '(MISSING)',
    SMTP_PORT: port,
    SMTP_USER: user || '(MISSING)',
    SMTP_PASS_present: !!pass,
    SMTP_PASS_length: pass.length,
    ORDER_CONFIRMATION_SENDER: sender || '(using SMTP_USER)',
    ORDER_NOTIFICATION_RECIPIENT: process.env.ORDER_NOTIFICATION_RECIPIENT || '(default: smartval.se@gmail.com)',
    runtime: process.env.NETLIFY ? 'netlify' : 'other',
  };

  if (!host || !user || !pass) {
    return NextResponse.json({
      ok: false,
      stage: 'env',
      message: 'SMTP env vars are NOT all present in this environment.',
      env,
    });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  // 1) Can we open + authenticate the SMTP connection?
  let verifyOk = false;
  let verifyError: any = null;
  try {
    await transporter.verify();
    verifyOk = true;
  } catch (e: any) {
    verifyError = {
      message: e?.message || String(e),
      code: e?.code || null,
      command: e?.command || null,
      response: e?.response || null,
    };
  }

  // 2) Optionally send a real test message: add &to=you@example.com
  const to = req.nextUrl.searchParams.get('to');
  let sendResult: any = null;
  if (to) {
    try {
      const info = await transporter.sendMail({
        from: sender || user,
        to,
        subject: 'Vikingfuel SMTP-test',
        text: 'Testmeddelande från Vikingfuel för att verifiera e-postutskick i produktion.',
      });
      sendResult = {
        ok: true,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      };
    } catch (e: any) {
      sendResult = {
        ok: false,
        message: e?.message || String(e),
        code: e?.code || null,
        command: e?.command || null,
        response: e?.response || null,
      };
    }
  }

  return NextResponse.json({ ok: verifyOk, env, verifyOk, verifyError, sendResult });
}
