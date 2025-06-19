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

{{{query}}}`, 
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
