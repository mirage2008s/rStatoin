'use server';

/**
 * @fileOverview An AI agent that detects the genre and language of a radio station.
 *
 * - detectStationGenreAndLanguage - A function that handles the station genre and language detection process.
 * - DetectStationGenreAndLanguageInput - The input type for the detectStationGenreAndLanguage function.
 * - DetectStationGenreAndLanguageOutput - The return type for the detectStationGenreAndLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectStationGenreAndLanguageInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A short audio clip from the radio station, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectStationGenreAndLanguageInput = z.infer<typeof DetectStationGenreAndLanguageInputSchema>;

const DetectStationGenreAndLanguageOutputSchema = z.object({
  genre: z.string().describe('The genre of the radio station.'),
  language: z.string().describe('The language of the radio station.'),
});
export type DetectStationGenreAndLanguageOutput = z.infer<typeof DetectStationGenreAndLanguageOutputSchema>;

export async function detectStationGenreAndLanguage(input: DetectStationGenreAndLanguageInput): Promise<DetectStationGenreAndLanguageOutput> {
  return detectStationGenreAndLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectStationGenreAndLanguagePrompt',
  input: {schema: DetectStationGenreAndLanguageInputSchema},
  output: {schema: DetectStationGenreAndLanguageOutputSchema},
  prompt: `You are an AI expert in radio broadcasts. You will be provided
with a short audio clip from a radio station, and you need to determine
the genre and language of the radio station. Return the genre and language
in JSON format.

Audio clip: {{media url=audioDataUri}}`,
});

const detectStationGenreAndLanguageFlow = ai.defineFlow(
  {
    name: 'detectStationGenreAndLanguageFlow',
    inputSchema: DetectStationGenreAndLanguageInputSchema,
    outputSchema: DetectStationGenreAndLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
