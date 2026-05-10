"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";

type ChatApiSuccess = {
  reply: string;
};

type ChatApiError = {
  error: string;
};

const MAX_INPUT_LENGTH = 4_000;

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const remainingChars = useMemo(
    () => MAX_INPUT_LENGTH - message.length,
    [message]
  );

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) {
      return;
    }

    setError("");
    setReply("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = (await response.json()) as ChatApiSuccess | ChatApiError;

      if (!response.ok) {
        setError(
          "error" in data ? data.error : "Request failed. Please try again."
        );
        return;
      }

      if (!("reply" in data) || !data.reply) {
        setError("Received an invalid response from the server.");
        return;
      }

      setReply(data.reply);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage();
  };

  const onMessageKeyDown = async (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      await sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          AI Chat Assistant
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Ask anything and get an AI response. Press Ctrl/Cmd + Enter to send.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onMessageKeyDown}
            maxLength={MAX_INPUT_LENGTH}
            placeholder="Type your message..."
            className="h-40 w-full resize-none rounded-xl border border-zinc-300 p-4 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />

          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{remainingChars} characters remaining</span>
            <span>Ctrl/Cmd + Enter to send</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {reply && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Assistant Reply
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
              {reply}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}