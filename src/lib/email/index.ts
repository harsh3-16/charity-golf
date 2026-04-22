import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: 'Charity Golf <onboarding@charitygolf.com>',
    to: email,
    subject: 'Welcome to the Impact! ⛳️',
    html: `<h1>Hi ${name},</h1><p>Welcome to Charity Golf. Your subscription is active and you are now making a difference.</p>`,
  });
}

export async function sendDrawPublishedEmail(emails: string[], month: string) {
  return resend.emails.send({
    from: 'Charity Golf <draws@charitygolf.com>',
    to: emails,
    subject: `Results are in for the ${month} Draw! 🏆`,
    html: `<h1>The results are out!</h1><p>Head to your dashboard to see if you've matched this month's winning numbers.</p>`,
  });
}

export async function sendWinnerAlert(email: string, amount: string) {
  return resend.emails.send({
    from: 'Charity Golf <payouts@charitygolf.com>',
    to: email,
    subject: `YOU WON! 🎊`,
    html: `<h1>Congratulations!</h1><p>You have won ${amount} in this month's draw. Please upload your proof in the dashboard to claim your prize.</p>`,
  });
}
