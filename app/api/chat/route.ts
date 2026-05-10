import { NextResponse } from "next/server";
import OpenAI from "openai";

type ChatRequestBody = {
  message?: unknown;
};

type ChatSuccessResponse = {
  reply: string;
};

type ChatErrorResponse = {
  error: string;
};

const MAX_MESSAGE_LENGTH = 4_000;
const SYSTEM_PROMPT = "You are a helpful AI assistant.";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function jsonError(message: string, status: number) {
  return NextResponse.json<ChatErrorResponse>({ error: message }, { status });
}

function parseUserMessage(body: ChatRequestBody): string | null {
  if (typeof body.message !== "string") {
    return null;
  }

  const message = body.message.trim();
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return null;
  }

  return message;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return jsonError(
      "Server configuration error: OPENAI_API_KEY is missing.",
      500
    );
  }

  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = parseUserMessage(body);

    if (!userMessage) {
      return jsonError(
        `Invalid message. Provide 1-${MAX_MESSAGE_LENGTH} characters.`,
        400
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return jsonError("Model returned an empty response.", 502);
    }

    return NextResponse.json<ChatSuccessResponse>({ reply });
  } catch (error: unknown) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;

    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    console.error("POST /api/chat failed:", error);
    return jsonError(message, status);
  }
}