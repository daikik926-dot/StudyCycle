# StudyCycle Agent Handoff

## Project Summary

StudyCycle is a university textbook exchange app for students. The goal is to make textbook reuse safer and more academically valuable by connecting listings to courses, professors, verified student identity, and senior exam notes.

The product tone should be serious, academic, and infrastructure-like. Avoid casual SNS vibes. Use a clean professional interface with blue `#0056b3` and green `#28a745` accents where possible.

## Tech Stack

- Next.js App Router
- Tailwind CSS
- Lucide React icons
- `@ericblade/quagga2` for ISBN barcode scanning

## How To Run

From the project root:

```powershell
npm install --cache .\.npm-cache
npm run dev:3000
```

Then open:

```text
http://localhost:3000
```

There is also a Windows helper:

```text
run-next.bat
```

Keep the terminal window open while using the demo.

## Implemented Routes

- `/`  
  Home screen with StudyCycle branding, search input, recommended textbook grid, and bottom mobile navigation.

- `/listings`  
  Textbook registration/listing page. Includes photo upload, ISBN input with barcode scan, title, author, course, professor, price, senior exam memo checkbox, and safety notice.

- `/textbooks/[id]`  
  Textbook detail page. Shows book information, course/professor context, seller, condition, price, senior note badge, and a CTA to start chat.

- `/textbooks/[id]/chat`  
  Transaction chat UI. Chat starts only from a specific textbook detail page. Initial buyer message is limited to predefined templates. Includes safety notice and recommended meetup spots.

- `/profile`  
  My Page. Includes demo user profile, verified student badge, trust rating, stats, coupons, listings/history tabs, and safety guidelines link area.

- `/coupons/[id]`  
  Digital coupon display page. Shows store info, offer, dummy QR code, serial code, usage instructions, expiration, and status badge.

## Implemented Features

- Responsive landing/home screen
- Textbook cards and local cover assets
- Textbook listing form
- ISBN barcode scan with camera preview
- Photo upload preview
- Senior exam memo checkbox
- Safety notices around university email verification and public meetup spots
- Textbook detail pages
- Transaction chat with fixed initial templates
- Handle-name based chat identity, not real-name based
- My Page with verified student badge and trust rating
- Digital coupon display with QR and serial code
- StudyCycle app icon in `public/studycycle-icon.svg`

## Design Rules

- Use mobile-first responsive layouts.
- Prefer restrained academic UI over playful marketplace styling.
- Keep controls clear and operational.
- Use Lucide icons for buttons and sections.
- Use blue `#0056b3` for trust, verification, headers, and primary academic structure.
- Use green `#28a745` for successful actions, rewards, listings, and positive status.
- Keep safety and academic context visible in transaction-related pages.

## Important Product Assumptions

- Users are verified students via `.ac.jp` university email.
- Chat identities use handle names, not real names.
- Initial chat messages should be template-only to discourage non-academic use.
- Meetup recommendations should stay inside campus/public places, such as library entrance and university co-op.
- The senior exam memo is a key value proposition, not a decorative feature.

## Current Demo Data

Demo textbooks live in:

```text
lib/textbooks.ts
```

Static cover images live in:

```text
public/covers
```

Coupon QR placeholders live in:

```text
public/coupons
```

## Good Next Tasks

1. Build the Search screen for the bottom navigation.
2. Add a notifications screen for chat replies, purchase status, and coupon rewards.
3. Add a real Safety Guidelines page.
4. Add listing confirmation flow after the listing form.
5. Connect form state to a mock listing preview.
6. Improve chat flow after the seller replies.

## Suggested Prompt For Another AI Agent

You are continuing work on StudyCycle, a Next.js App Router university textbook exchange app. Keep all new work inside the existing app. Maintain a serious academic design with blue `#0056b3` and green `#28a745` accents. Use Tailwind CSS and Lucide React. Existing routes include home, listings, textbook detail, transaction chat, profile, and coupon display. Prioritize safety, `.ac.jp` verification, public campus meetup guidance, template-first chat, and course/professor-linked textbook listings. Before editing, inspect the existing components and follow their patterns.
