'use server';

/**
 * @fileOverview Disaster information retrieval flow.
 *
 * - disasterInfo - A function that handles disaster information retrieval.
 * - DisasterInfoInput - The input type for the disasterInfo function.
 * - DisasterInfoOutput - The return type for the disasterInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisasterInfoInputSchema = z.object({
  query: z.string().describe('The query for disaster information.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo relevant to the query, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DisasterInfoInput = z.infer<typeof DisasterInfoInputSchema>;

const DisasterInfoOutputSchema = z.object({
  answer: z.string().describe('The answer to the disaster information query.'),
});
export type DisasterInfoOutput = z.infer<typeof DisasterInfoOutputSchema>;

export async function disasterInfo(input: DisasterInfoInput): Promise<DisasterInfoOutput> {
  return disasterInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'disasterInfoPrompt',
  input: {schema: DisasterInfoInputSchema},
  output: {schema: DisasterInfoOutputSchema},
  prompt: `You are an expert in providing information about natural disasters. Use your knowledge base to answer the following question:

User's query: {{{query}}}
{{#if photoDataUri}}
The user has also provided the following image related to their query:
{{media url=photoDataUri}}
Consider this image if it helps answer the query.
{{/if}}`,
});

const disasterInfoFlow = ai.defineFlow(
  {
    name: 'disasterInfoFlow',
    inputSchema: DisasterInfoInputSchema,
    outputSchema: DisasterInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
