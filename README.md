# LangPod - AI Language Learning Platform

LangPod is an AI-powered language learning platform that creates personalized, scenario-based lessons using ElevenLabs' voice technology. Built for the ElevenLabs x a16z WW Hackathon, it generates dynamic, contextual learning experiences tailored to each user's interests, proficiency level, and learning goals.

## Tech Stack

- 🚀 Next.js 15 (App Router) + TypeScript
- 🎯 ElevenLabs API for voice generation
- 🔐 Clerk for authentication
- 📊 PostHog for analytics
- 💾 Neon (PostgreSQL) for database
- 🎨 Shadcn UI + Tailwind CSS for styling
- 🛠️ ZenStack for type-safe database operations

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/hamedmp/langpod.git
cd langpod
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

4. Add your API keys to `.env`:

```bash
ELEVENLABS_API_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_POSTHOG_KEY=
```

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- 🎯 Personalized language learning paths
- 🗣️ Dynamic voice-powered conversations
- 📚 Scenario-based lessons
- 📊 Progress tracking
- 🔄 Adaptive difficulty levels

## Contributing

This project was created for the ElevenLabs x a16z WW Hackathon. Feel free to fork and experiment!

## Learn More

- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [PostHog Documentation](https://posthog.com/docs)
- [ZenStack Documentation](https://zenstack.dev/docs)

## License

MIT
