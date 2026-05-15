import "server-only";

import { generateText } from "ai";

const DEFAULT_MODEL = "openai/gpt-5.5";

const SYSTEM_INSTRUCTIONS =
  "Eres un experto en prompt engineering. Mejora prompts de usuario para que sean más claros, específicos y accionables. Mantén el idioma original del prompt. Devuelve únicamente la versión mejorada, sin explicaciones, sin markdown envolvente y sin comentarios previos.";

type ImprovePromptInput = {
  title?: string;
  category?: string;
  content: string;
};

export async function improvePromptWithAI({
  title,
  category,
  content,
}: ImprovePromptInput): Promise<string> {
  const prompt = [
    title?.trim() ? `Título: ${title.trim()}` : null,
    category?.trim() ? `Categoría: ${category.trim()}` : null,
    "Prompt original:",
    content.trim(),
    "",
    "Mejóralo añadiendo, cuando sea útil: rol, contexto, objetivo, restricciones, formato de salida, tono y criterios de calidad. Conserva variables como [VARIABLES] si existen.",
  ]
    .filter(Boolean)
    .join("\n");

  const { text } = await generateText({
    model: process.env.AI_GATEWAY_MODEL || DEFAULT_MODEL,
    system: SYSTEM_INSTRUCTIONS,
    prompt,
    maxOutputTokens: 1200,
  });

  const improvedPrompt = text.trim();

  if (!improvedPrompt) {
    throw new Error("La IA no devolvió una mejora válida.");
  }

  return improvedPrompt;
}
