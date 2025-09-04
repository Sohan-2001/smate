'use server';

/**
 * @fileOverview AI flow to improve the writing style of selected text.
 *
 * - improveWritingStyle - A function that takes text and returns improved text.
 * - ImproveWritingStyleInput - The input type for the improveWritingStyle function.
 * - ImproveWritingStyleOutput - The return type for the improveWritingStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveWritingStyleInputSchema = z.object({
  text: z.string().describe('The text to improve.'),
  style: z
    .string()
    .optional()
    .describe(
      'The desired writing style (e.g., clear, concise, professional).'
    ),
});
export type ImproveWritingStyleInput = z.infer<
  typeof ImproveWritingStyleInputSchema
>;

const ImproveWritingStyleOutputSchema = z.object({
  improvedText: z.string().describe('The improved text.'),
});
export type ImproveWritingStyleOutput = z.infer<
  typeof ImproveWritingStyleOutputSchema
>;

export async function improveWritingStyle(
  input: ImproveWritingStyleInput
): Promise<ImproveWritingStyleOutput> {
  return improveWritingStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveWritingStylePrompt',
  input: {schema: ImproveWritingStyleInputSchema},
  output: {schema: ImproveWritingStyleOutputSchema},
  prompt: `You are an AI writing assistant. Your task is to improve the writing style of the given text.

Text: {{{text}}}

{% if style %}Desired style: {{{style}}}{% endif %}

Please provide the improved text.`,
});

const improveWritingStyleFlow = ai.defineFlow(
  {
    name: 'improveWritingStyleFlow',
    inputSchema: ImproveWritingStyleInputSchema,
    outputSchema: ImproveWritingStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
