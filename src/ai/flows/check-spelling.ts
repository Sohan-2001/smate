'use server';

/**
 * @fileOverview An AI flow to check and correct spelling in a given text.
 *
 * - checkSpelling - A function that takes text and returns corrected text along with a list of corrections.
 * - CheckSpellingInput - The input type for the checkSpelling function.
 * - CheckSpellingOutput - The return type for the checkSpelling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckSpellingInputSchema = z.object({
  text: z.string().describe('The text to check for spelling errors.'),
});
export type CheckSpellingInput = z.infer<typeof CheckSpellingInputSchema>;

const CorrectionSchema = z.object({
  original: z.string().describe('The original misspelled word.'),
  corrected: z.string().describe('The corrected spelling of the word.'),
});

const CheckSpellingOutputSchema = z.object({
  correctedText: z.string().describe('The text with spelling corrected.'),
  hasCorrections: z
    .boolean()
    .describe('Whether any corrections were made.'),
  corrections: z
    .array(CorrectionSchema)
    .describe('A list of the corrections made.'),
});
export type CheckSpellingOutput = z.infer<typeof CheckSpellingOutputSchema>;

export async function checkSpelling(
  input: CheckSpellingInput
): Promise<CheckSpellingOutput> {
  return checkSpellingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkSpellingPrompt',
  input: {schema: CheckSpellingInputSchema},
  output: {schema: CheckSpellingOutputSchema},
  prompt: `You are an expert spellchecker. Your task is to identify and correct any spelling errors in the provided text.

- Analyze the text for any misspelled words.
- If there are no spelling errors, return the original text, set 'hasCorrections' to false, and provide an empty 'corrections' array.
- If spelling errors are found:
  1. Provide the full text with all spelling errors corrected in the 'correctedText' field.
  2. Set 'hasCorrections' to true.
  3. For each correction made, add an object to the 'corrections' array detailing the original misspelled word and the corrected word.

Original Text: {{{text}}}
`,
});

const checkSpellingFlow = ai.defineFlow(
  {
    name: 'checkSpellingFlow',
    inputSchema: CheckSpellingInputSchema,
    outputSchema: CheckSpellingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
