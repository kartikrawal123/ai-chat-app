# AI Chat App

A production-style AI chat application built with Next.js App Router, TypeScript, Tailwind CSS, and the OpenAI API.

## Features

- Clean chat UI with loading and error states
- Keyboard shortcut support (`Ctrl/Cmd + Enter`)
- Typed request/response handling across frontend and backend
- Server-side input validation and structured API errors
- OpenAI integration via `app/api/chat/route.ts`

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- OpenAI Node SDK

## Project Structure

```txt
app/
  api/chat/route.ts   # Backend API route for chat completion
  page.tsx            # Frontend chat interface
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## API Contract

### `POST /api/chat`

Request body:

```json
{
  "message": "Your prompt text"
}
```

Success response (`200`):

```json
{
  "reply": "Model response text"
}
```

Error response (for example `400`, `429`, `500`):

```json
{
  "error": "Human-readable error message"
}
```

## Troubleshooting

- **`500` with missing key**: Ensure `OPENAI_API_KEY` is present in `.env.local` and restart the dev server.
- **`429` quota error**: Check billing/usage for your OpenAI project and key.
- **Push rejected (non-fast-forward)**: Pull and merge remote changes before pushing.

## License

For personal and educational use. Add a formal license file if you plan to distribute this project.
