'use server';
/**
 * @fileOverview Generates text from a user-provided prompt.
 *
 * - generateText - A function that accepts a prompt and returns generated text.
 * - GenerateTextFromPromptInput - The input type for the generateText function.
 * - GenerateTextFromPromptOutput - The return type for the generateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTextFromPromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to use for generating text.'),
});
export type GenerateTextFromPromptInput = z.infer<typeof GenerateTextFromPromptInputSchema>;

const GenerateTextFromPromptOutputSchema = z.object({
  generatedText: z.string().describe('The text generated from the prompt.'),
});
export type GenerateTextFromPromptOutput = z.infer<typeof GenerateTextFromPromptOutputSchema>;

export async function generateText(input: GenerateTextFromPromptInput): Promise<GenerateTextFromPromptOutput> {
  return generateTextFromPromptFlow(input);
}

const generateTextFromPromptPrompt = ai.definePrompt({
  name: 'generateTextFromPromptPrompt',
  input: {schema: GenerateTextFromPromptInputSchema},
  output: {schema: GenerateTextFromPromptOutputSchema},
  prompt: `{{{prompt}}}`,
});

const generateTextFromPromptFlow = ai.defineFlow(
  {
    name: 'generateTextFromPromptFlow',
    inputSchema: GenerateTextFromPromptInputSchema,
    outputSchema: GenerateTextFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generateTextFromPromptPrompt(input);
    return output!;
  }
);
