'use server';
/**
 * @fileOverview An AI flow to assess disaster severity based on user description and an optional photo.
 *
 * - assessDisasterSeverity - A function that handles the disaster severity assessment.
 * - AssessDisasterSeverityInput - The input type for the assessDisasterSeverity function.
 * - AssessDisasterSeverityOutput - The return type for the assessDisasterSeverity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessDisasterSeverityInputSchema = z.object({
  description: z.string().describe('A textual description of the observed situation or event.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the situation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AssessDisasterSeverityInput = z.infer<typeof AssessDisasterSeverityInputSchema>;

const AssessDisasterSeverityOutputSchema = z.object({
  severityAssessment: z.string().describe("The AI's assessment of the disaster's severity (e.g., Minor, Moderate, Severe, Critical)."),
  potentialHazards: z.array(z.string()).describe('A list of potential hazards identified from the input.'),
  recommendedActions: z.array(z.string()).describe('A list of recommended immediate actions for the user.'),
});
export type AssessDisasterSeverityOutput = z.infer<typeof AssessDisasterSeverityOutputSchema>;

export async function assessDisasterSeverity(input: AssessDisasterSeverityInput): Promise<AssessDisasterSeverityOutput> {
  return assessDisasterSeverityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessDisasterSeverityPrompt',
  input: {schema: AssessDisasterSeverityInputSchema},
  output: {schema: AssessDisasterSeverityOutputSchema},
  prompt: `You are a disaster response expert. Analyze the provided description and, if available, the photo to assess the severity of the situation.
Identify potential hazards and recommend immediate, actionable safety measures.

User's Description: {{{description}}}
{{#if photoDataUri}}
User's Photo: {{media url=photoDataUri}}
{{/if}}

Provide a concise severity assessment (e.g., Minor, Moderate, Severe, Critical).
List key potential hazards.
List clear, step-by-step recommended actions. Be very specific and practical.
Focus on immediate safety.

If a photo is provided, consider visual cues like structural damage, water levels, fire, visible injuries, etc.
If no photo is provided, base your assessment solely on the textual description.
If the description is vague or insufficient for a clear assessment, state that and ask for more specific details, but still provide general precautionary advice if possible.
`,
});

const assessDisasterSeverityFlow = ai.defineFlow(
  {
    name: 'assessDisasterSeverityFlow',
    inputSchema: AssessDisasterSeverityInputSchema,
    outputSchema: AssessDisasterSeverityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
