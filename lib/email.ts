import React from 'react';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import crypto from 'crypto';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import Bull, { Job, JobId } from 'bull';
import Setting from '@/models/Setting';
import { connectDB } from './db';

// Rate limiter: 100 emails per minute
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

// Email queue
const emailQueue = new Bull('email', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Encryption key and IV
const ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

// Encryption functions
function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  await connectDB();
  const emailSetting = await Setting.findOne({ key: 'emailConfig' });
  
  if (!emailSetting?.value) {
    throw new Error('Email configuration not found');
  }

  const { host, port, user, password, secure } = emailSetting.value;
  
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: secure || port === 465,
    auth: {
      user,
      pass: decrypt(password),
    },
  });

  return transporter;
}

// Type for email job data added to the queue
interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

// Email queue processor
emailQueue.process(async (job: Job<EmailJobData>) => {
  const { to, subject, html } = job.data;
  const emailFromSetting = await Setting.findOne({ key: 'emailFrom' });
  const emailFrom = emailFromSetting?.value || process.env.SMTP_FROM || 'noreply@example.com';

  const mailTransporter = await getTransporter();
  await mailTransporter.sendMail({
    from: emailFrom,
    to,
    subject,
    html,
  });
});

type TemplateFunction<T extends any[]> = (...args: T) => { subject: string; html: Promise<string> };

interface EmailTemplates {
  welcome: TemplateFunction<[string]>;
  verifyEmail: TemplateFunction<[string, string]>;
  resetPassword: TemplateFunction<[string, string]>;
  passwordChanged: TemplateFunction<[string]>;
  accountBlocked: TemplateFunction<[string, string]>;
  quizResult: TemplateFunction<[string, number, number]>;
  twoFactorCode: TemplateFunction<[string, string]>;
  securityAlert: TemplateFunction<[string, string]>;
  custom?: (data: { subject: string, html: string }) => { subject: string; html: Promise<string> };
}

// Email templates
const templates: EmailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Free Fire India!',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Welcome to Free Fire India!'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, "Thank you for joining Free Fire India! We're excited to have you on board."),
      React.createElement('p', null, "Here's what you can do with your account:"),
      React.createElement('ul', null,
        React.createElement('li', null, 'Participate in daily quizzes'),
        React.createElement('li', null, 'Earn coins and rewards'),
        React.createElement('li', null, 'Access exclusive wallpapers'),
        React.createElement('li', null, 'Join the community')
      ),
      React.createElement('p', null, 'If you have any questions, feel free to contact our support team.'),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),

  verifyEmail: (name: string, token: string) => ({
    subject: 'Verify Your Email Address - Free Fire India',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Verify Your Email Address'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, 'Please verify your email address by clicking the button below:'),
      React.createElement('a', { 
        href: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`,
        style: { backgroundColor: '#FF4B2B', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }
       }, 'Verify Email Address'),
      React.createElement('p', null, 'This link will expire in 24 hours.'),
      React.createElement('p', null, "If you didn't request this verification, please ignore this email."),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),

  resetPassword: (name: string, resetUrl: string) => ({
    subject: 'Reset Your Password - Free Fire India',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Reset Your Password'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, 'We received a request to reset your password. Click the button below to reset it:'),
      React.createElement('a', { 
        href: resetUrl, 
        style: { backgroundColor: '#FF4B2B', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }
      }, 'Reset Password'),
      React.createElement('p', null, "If you didn't request this, you can safely ignore this email."),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),

  passwordChanged: (name: string) => ({
    subject: 'Password Changed - Free Fire India',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Password Changed'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, 'Your password has been successfully changed.'),
      React.createElement('p', null, "If you didn't make this change, please contact our support team immediately."),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),

  accountBlocked: (name: string, reason: string) => ({
    subject: 'Account Blocked - Free Fire India',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Account Blocked'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, 'Your account has been blocked for the following reason:'),
      React.createElement('p', { style: { color: '#FF4B2B' } }, reason),
      React.createElement('p', null, 'If you believe this is a mistake, please contact our support team.'),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),

  quizResult: (name: string, score: number, coinsEarned: number) => ({
    subject: 'Quiz Results - Free Fire India',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Quiz Results'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, 'Here are your quiz results:'),
      React.createElement('div', { style: { backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '4px', margin: '20px 0' } },
        React.createElement('p', null, React.createElement('strong', null, 'Score:'), ` ${score}%`),
        React.createElement('p', null, React.createElement('strong', null, 'Coins Earned:'), ` ${coinsEarned}`)
      ),
      React.createElement('p', null, 'Keep participating in quizzes to earn more coins!'),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),

  twoFactorCode: (name: string, code: string) => ({
    subject: 'Your Two-Factor Authentication Code - Free Fire India',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Two-Factor Authentication Code'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, 'Your two-factor authentication code is:'),
      React.createElement('h2', { style: { fontSize: '24px', letterSpacing: '5px', textAlign: 'center', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '4px' } }, code),
      React.createElement('p', null, 'This code will expire in 5 minutes.'),
      React.createElement('p', null, "If you didn't request this code, please secure your account immediately."),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),

  securityAlert: (name: string, alertMessage: string) => ({
    subject: 'Security Alert - Free Fire India',
    html: render(React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } },
      React.createElement('h1', { style: { color: '#FF4B2B' } }, 'Security Alert'),
      React.createElement('p', null, `Hello ${name},`),
      React.createElement('p', null, alertMessage),
      React.createElement('p', null, 'If you have any concerns, please contact our support team or change your password immediately.'),
      React.createElement('p', null, 'Best regards,', React.createElement('br'), 'The Free Fire India Team')
    )),
  }),
};

// Public function to send email by adding to queue
export async function sendEmail<K extends keyof EmailTemplates>(
  to: string,
  templateKey: K,
  // Use a conditional type to get parameters if templateKey is a valid key of EmailTemplates
  // and the value at EmailTemplates[K] is a function.
  ...args: EmailTemplates[K] extends ((...args: any) => any) ? Parameters<EmailTemplates[K]> : never
): Promise<{ success: boolean; message?: string; error?: string; jobId?: string }> {
  try {
    const recipientEmail = String(to);
    await rateLimiter.consume(recipientEmail);

    const templateFunction = templates[templateKey];

    if (typeof templateFunction !== 'function') {
      throw new Error(`Email template "${String(templateKey)}" not found or is not a function.`);
    }

    // Now TypeScript knows templateFunction is a function, so spreading args is safer.
    // @ts-ignore // We use a conditional type for args, but TS might still be tricky with spread here.
    const { subject, html: renderedHtmlPromise } = templateFunction(...args);
    const html = await renderedHtmlPromise;

    const job = await emailQueue.add({ to: recipientEmail, subject, html } as EmailJobData);

    return { success: true, message: 'Email queued successfully', jobId: String(job.id) }; // Ensure job.id is string
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error?.msBeforeNext) {
      return { success: false, error: `Rate limit exceeded. Try again in ${Math.ceil(error.msBeforeNext / 1000)} seconds.` };
    }
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

// Function to verify email configuration
export async function verifyEmailConfig() {
  try {
    const mailTransporter = await getTransporter();
    await mailTransporter.verify();
    console.log('Email configuration is valid');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error: any) {
    console.error('Email configuration verification failed:', error);
    return { success: false, error: error.message || 'Email configuration verification failed' };
  }
}

// Function to update email settings in the database
export async function updateEmailSettings(settings: {
  host: string;
  port: number;
  user: string;
  password: string;
  secure?: boolean;
  fromAddress: string;
}) {
  await connectDB();
  
  const encryptedPassword = encrypt(settings.password);

  await Setting.findOneAndUpdate(
    { key: 'emailConfig' },
    { value: { ...settings, password: encryptedPassword } },
    { upsert: true, new: true }
  );
  await Setting.findOneAndUpdate(
    { key: 'emailFrom' },
    { value: settings.fromAddress },
    { upsert: true, new: true }
  );
  
  transporter = null;
}

export { templates }; 