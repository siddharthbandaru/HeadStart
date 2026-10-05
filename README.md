# HeadStart

HeadStart is a full-stack assignment planner that helps students break large assignments into smaller tasks and schedule them before the due date.

Instead of only keeping track of deadlines, HeadStart generates checkpoints based on an assignment's instructions, available dates, and the amount of time a student has to work each day.

**Live Beta:** https://headstart-beta.vercel.app/login

## Features

- Create and manage classes
- Add assignments with instructions and due dates
- Generate assignment plans with AI
- Break assignments into scheduled checkpoints
- Track checkpoints through a to-do list
- View assignments and checkpoints on a calendar
- Mark tasks as complete
- Customize class colors
- Create an account and save your data
- Password reset and account management

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Supabase
- PostgreSQL
- Next.js API routes

**AI API**
- Groq
- Google Gemini
- Custom fallback planning algorithm

**Other**
- Figma
- Vercel
- Git/GitHub

## Planning System

HeadStart has both AI and standard plan generation.

For AI-generated plans, the planner first tries Groq and then Gemini. If neither provider is available, it falls back to the standard planning algorithm so users can still generate a plan.

Generated plans are also checked against the assignment dates and the user's daily available work time before being returned.

```text
Assignment
    ↓
Planner
    ↓
Groq
    ↓
Gemini
    ↓
Standard Planner (fallback)
    ↓
Schedule Validation
    ↓
Checkpoints
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/siddharthbandaru/HeadStart.git
cd HeadStart
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with the required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

GROQ_API_KEY=
GEMINI_API_KEY=
```

Then run:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Status

HeadStart is currently in beta. The main application is functional and deployed, and we're currently testing it with users and making improvements based on feedback.

Some things we're working on next:

- Responsive/mobile layouts
- UI polish
- Improvements to generated plans
- More planning customization
- Calendar improvements
- Additional progress tracking

## Team

Built by Clara Anderson and Siddu Bandaru at UF!
