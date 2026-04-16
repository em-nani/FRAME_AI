import { Project } from './types';

/**
 * Calls the /api/generate Vercel serverless function which uses Claude
 * to generate a complete production plan from a plain-language brief.
 *
 * Falls back to the mock generator in local dev if the env variable
 * VITE_USE_MOCK=true is set (useful for working offline).
 */
export async function generateProjectFromPrompt(prompt: string): Promise<Project> {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  if (useMock) {
    // Dynamic import so the mock is tree-shaken out of production builds
    const { generateProjectFromPrompt: mockGenerate } = await import('./ai-mock');
    return mockGenerate(prompt);
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.details || error.error || `Server error: ${response.status}`);
  }

  const project: Project = await response.json();
  return project;
}
