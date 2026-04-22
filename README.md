# Charity Golf Subscription App

A complete subscription-based web application for golf score tracking, monthly prize draws, and charity donations.

## Features
- **Emotion-Forward Landing Page**: Leading with charity impact and live prize pools.
- **Monthly Prize Draws**: Algorithmic draw engine (HOT/COLD/RANDOM) based on user scores.
- **Charity Donations**: 10% (min) of every subscription fee donated to a chosen charity.
- **Score Tracking**: Rolling 5 Stableford scores management.
- **Admin Dashboard**: Comprehensive control over users, draws, and winner verification.
- **Stripe Integration**: Automated monthly/yearly subscriptions.
- **Email Notifications**: Automated alerts via Resend.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS 4, Framer Motion.
- **Backend**: Next.js API Routes / Server Actions.
- **Database**: Supabase (PostgreSQL) with RLS and Triggers.
- **Auth**: Supabase Auth (JWT).
- **Payments**: Stripe.
- **Email**: Resend.

## Setup Instructions

### 1. Clone & Install
```bash
git clone <repo-url>
cd charity-golf
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in your keys:
```bash
cp .env.example .env.local
```

### 3. Supabase Setup
- Create a new Supabase project.
- Execute the migration file: `supabase/migrations/20240421000000_init_schema.sql`.
- (Optional) Seed initial data: `supabase/seed.sql`.
- Enable Auth providers (Email/Password).

### 4. Stripe Setup
- Create a Monthly Product (£10) and a Yearly Product (£96) in Stripe.
- Set up a Webhook to point to `your-url/api/webhooks/stripe`.
- Listen for `checkout.session.completed` and `customer.subscription.deleted`.

### 5. Run Locally
```bash
npm run dev
```

## Deployment
Deploy to Vercel with the environment variables configured. Ensure `NEXT_PUBLIC_APP_URL` matches your production domain.

## License
MIT
