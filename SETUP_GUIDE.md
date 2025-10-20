# ArtVerse Setup Guide

## Environment Variables

Create a `.env.local` file with the following variables:

### Authentication (Clerk)
\`\`\`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
\`\`\`

### Database (MongoDB Atlas)
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/artverse
MONGODB_DB=artverse
\`\`\`

### Payment (Stripe)
\`\`\`
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

### File Storage (Cloudinary)
\`\`\`
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### Email (SMTP - Maili or similar)
\`\`\`
SMTP_HOST=smtp.maili.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@artverse.com
\`\`\`

### App URL
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Setup Clerk Authentication**
   - Go to https://dashboard.clerk.com
   - Create a new application
   - Copy your publishable and secret keys

3. **Setup MongoDB Atlas**
   - Create a cluster at https://www.mongodb.com/cloud/atlas
   - Create a database user
   - Get your connection string

4. **Setup Stripe**
   - Create account at https://stripe.com
   - Get your API keys
   - Create a webhook endpoint pointing to `/api/webhooks/stripe`

5. **Setup Cloudinary**
   - Create account at https://cloudinary.com
   - Get your cloud name and API keys

6. **Setup Email (SMTP)**
   - Use Maili or similar SMTP service
   - Get your SMTP credentials

7. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Features

- User authentication with Clerk
- Art marketplace with search and filters
- Seller dashboard with analytics
- Image/video uploads to Cloudinary
- Secure payments with Stripe
- Email notifications with Nodemailer
- Glassmorphism UI design
- MongoDB data persistence

## Webhook Setup

For Stripe webhooks to work:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`
