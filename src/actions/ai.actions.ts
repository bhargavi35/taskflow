"use server";

import { requireAuth } from "@/lib/auth-guard";

export async function generateTaskDescription(title: string, projectName: string) {
  await requireAuth();

  if (!process.env.OPENAI_API_KEY) {
    return { error: "AI features require an OpenAI API key" };
  }

  try {
    const { generateText } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: `Write a brief, actionable task description (2-3 sentences) for a project management task.
Project: ${projectName}
Task title: ${title}
Keep it professional and specific. Focus on what needs to be done.`,
      maxOutputTokens: 150,
    });

    return { description: text };
  } catch {
    return { error: "Failed to generate description" };
  }
}

export async function suggestPriority(title: string, description?: string) {
  await requireAuth();

  if (!process.env.OPENAI_API_KEY) {
    return { priority: "MEDIUM" as const, reason: "AI unavailable — defaulting to MEDIUM" };
  }

  try {
    const { generateText } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: `Based on this task, suggest a priority level.
Title: ${title}
Description: ${description || "No description"}
Reply with ONLY one of: LOW, MEDIUM, HIGH, URGENT
Then on a new line, explain in one sentence why.`,
      maxOutputTokens: 50,
    });

    const lines = text.trim().split("\n");
    const priority = lines[0]?.trim() as "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    const reason = lines[1]?.trim() || "";
    const valid = ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(priority);

    return { priority: valid ? priority : "MEDIUM", reason };
  } catch {
    return { priority: "MEDIUM" as const, reason: "AI unavailable" };
  }
}
