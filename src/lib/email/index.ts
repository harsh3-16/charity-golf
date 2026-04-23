import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
      },
    });
  }
  return transporter;
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mail = getTransporter();
  return mail.sendMail({
    from: 'Charity Golf <onboarding@charitygolf.com>',
    to: email,
    subject: 'Welcome to the Impact! ⛳️',
    html: `<h1>Hi ${name},</h1><p>Welcome to Charity Golf. Your subscription is active and you are now making a difference.</p>`,
  });
}

export async function sendDrawPublishedEmail(emails: string[], month: string) {
  const mail = getTransporter();
  return mail.sendMail({
    from: 'Charity Golf <draws@charitygolf.com>',
    to: emails.join(', '),
    subject: `Results are in for the ${month} Draw! 🏆`,
    html: `<h1>The results are out!</h1><p>Head to your dashboard to see if you've matched this month's winning numbers.</p>`,
  });
}

export async function sendWinnerAlert(email: string, amount: string) {
  const mail = getTransporter();
  return mail.sendMail({
    from: 'Charity Golf <payouts@charitygolf.com>',
    to: email,
    subject: `YOU WON! 🎊`,
    html: `<h1>Congratulations!</h1><p>You have won ${amount} in this month's draw. Please upload your proof in the dashboard to claim your prize.</p>`,
  });
}
export async function sendVerificationStatusEmail(email: string, status: 'approved' | 'rejected', notes?: string) {
  const mail = getTransporter();
  const subject = status === 'approved' ? 'Winning Verification Approved! ✅' : 'Winning Verification Update ℹ️';
  const message = status === 'approved' 
    ? '<p>Great news! Your prize verification has been approved. Your payment is being processed.</p>'
    : `<p>We were unable to verify your winning entry. Reason: ${notes || 'Scorecard mismatch'}</p><p>Please upload a clear screenshot of your scores to try again.</p>`;
    
  return mail.sendMail({
    from: 'Charity Golf <payouts@charitygolf.com>',
    to: email,
    subject: subject,
    html: `<h1>Status Update</h1>${message}`,
  });
}

export async function sendRenewalReminderEmail(email: string, date: string) {
  const mail = getTransporter();
  return mail.sendMail({
    from: 'Charity Golf <subscriptions@charitygolf.com>',
    to: email,
    subject: 'Your Impact Continues Soon! ⛳️',
    html: `<h1>Renewal Reminder</h1><p>Your subscription is set to renew on ${date}. Thank you for your continued support for your chosen charity.</p>`,
  });
}
