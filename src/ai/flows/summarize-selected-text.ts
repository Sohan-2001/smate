'use server';

/**
 * @fileOverview A text summarization AI agent.
 *
 * - summarizeSelectedText - A function that handles the summarization process.
 * - SummarizeSelectedTextInput - The input type for the summarizeSelectedText function.
 * - SummarizeSelectedTextOutput - The return type for the summarizeSelectedText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSelectedTextInputSchema = z.object({
  selectedText: z
    .string()
    .describe('The text selected by the user to be summarized.'),
});
export type SummarizeSelectedTextInput = z.infer<
  typeof SummarizeSelectedTextInputSchema
>;

const SummarizeSelectedTextOutputSchema = z.object({
  summary: z.string().describe('The summary of the selected text.'),
});
export type SummarizeSelectedTextOutput = z.infer<
  typeof SummarizeSelectedTextOutputSchema
>;

export async function summarizeSelectedText(
  input: SummarizeSelectedTextInput
): Promise<SummarizeSelectedTextOutput> {
  return summarizeSelectedTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSelectedTextPrompt',
  input: {schema: SummarizeSelectedTextInputSchema},
  output: {schema: SummarizeSelectedTextOutputSchema},
  prompt: `You are a world-class summarization expert. Please summarize the following text, extracting the key points and providing a concise overview.

Text: {{{selectedText}}}`,
});

const summarizeSelectedTextFlow = ai.defineFlow(
  {
    name: 'summarizeSelectedTextFlow',
    inputSchema: SummarizeSelectedTextInputSchema,
    outputSchema: SummarizeSelectedTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
