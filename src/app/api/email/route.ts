import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { emails, jobs } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'Valid email recipients are required' }, { status: 400 });
    }

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ error: 'No jobs to send' }, { status: 400 });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.naver.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Create email content
    const htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Job Postings</h1>
        <p>Here are the latest job postings you requested:</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        ${jobs.map(job => `
          <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 18px;">${job.title}</h2>
            <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
              <strong>${job.company}</strong> • ${job.location} • ${job.date}
            </p>
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
              ${job.description}
            </p>
          </div>
        `).join('')}
      </div>
    `;

    // Send emails
    const info = await transporter.sendMail({
      from: `"Job Aggregator" <${process.env.EMAIL_SERVER_USER}>`,
      to: emails.join(', '),
      subject: `Your Job Postings Report (${jobs.length} jobs)`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Email sending error:', error);
    // Return success in development if env vars are missing to avoid blocking UI testing
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVER_PASSWORD) {
       console.log('Skipping actual email send in dev mode due to missing SMTP credentials.');
       return NextResponse.json({ success: true, warning: 'Emails not actually sent (missing SMTP config)' });
    }
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
