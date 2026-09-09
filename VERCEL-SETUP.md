# Vulpix Digital Solutions — Vercel

The contact form uses a Vercel Serverless Function at `/api/contact` and Resend for email delivery.

## Vercel setup
1. Add `RESEND_API_KEY` in Vercel Project Settings → Environment Variables.
2. Add `CONTACT_TO_EMAIL=vulpixdigitalsolutions@gmail.com`.
3. Add `CONTACT_FROM_EMAIL` using a sender address on a domain verified in Resend.
4. Redeploy and test the contact form.

Keep the Resend API key out of `index.html` and browser JavaScript.
