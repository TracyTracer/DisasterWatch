'use server';

/**
 * @fileOverview Earthquake information retrieval flow.
 *
 * - earthquakeInfo - A function that handles earthquake information retrieval.
 * - EarthquakeInfoInput - The input type for the earthquakeInfo function.
 * - EarthquakeInfoOutput - The return type for the earthquakeInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EarthquakeInfoInputSchema = z.object({
  query: z.string().describe('The query for earthquake information.'),
});
export type EarthquakeInfoInput = z.infer<typeof EarthquakeInfoInputSchema>;

const EarthquakeInfoOutputSchema = z.object({
  answer: z.string().describe('The answer to the earthquake information query.'),
});
export type EarthquakeInfoOutput = z.infer<typeof EarthquakeInfoOutputSchema>;

export async function earthquakeInfo(input: EarthquakeInfoInput): Promise<EarthquakeInfoOutput> {
  return earthquakeInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'earthquakeInfoPrompt',
  input: {schema: EarthquakeInfoInputSchema},
  output: {schema: EarthquakeInfoOutputSchema},
  prompt: `You are an expert in providing information about earthquakes. Use your knowledge base to answer the following question:

{{{query}}}`, 
});

const earthquakeInfoFlow = ai.defineFlow(
  {
    name: 'earthquakeInfoFlow',
    inputSchema: EarthquakeInfoInputSchema,
    outputSchema: EarthquakeInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
