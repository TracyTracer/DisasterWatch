'use server';

/**
 * @fileOverview Personalized safety recommendations based on the user's location and current disaster events.
 *
 * - getPersonalizedSafetyTips - A function that generates personalized safety recommendations.
 * - PersonalizedSafetyTipsInput - The input type for the getPersonalizedSafetyTips function.
 * - PersonalizedSafetyTipsOutput - The return type for the getPersonalizedSafetyTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSafetyTipsInputSchema = z.object({
  location: z
    .string()
    .describe("The user's current location (e.g., city, state)."),
  recentDisasterEvents: z // Renamed from recentEarthquakeEvents
    .string()
    .describe('Information about recent disaster events (e.g., earthquakes, floods, storms) in the user location.'),
});
export type PersonalizedSafetyTipsInput = z.infer<
  typeof PersonalizedSafetyTipsInputSchema
>;

const PersonalizedSafetyTipsOutputSchema = z.object({
  safetyRecommendations: z
    .string()
    .describe('Personalized safety recommendations for the user.'),
});
export type PersonalizedSafetyTipsOutput = z.infer<
  typeof PersonalizedSafetyTipsOutputSchema
>;

export async function getPersonalizedSafetyTips(
  input: PersonalizedSafetyTipsInput
): Promise<PersonalizedSafetyTipsOutput> {
  return personalizedSafetyTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSafetyTipsPrompt',
  input: {schema: PersonalizedSafetyTipsInputSchema},
  output: {schema: PersonalizedSafetyTipsOutputSchema},
  prompt: `You are an AI assistant specializing in providing personalized safety recommendations during and after disaster events.

  Based on the user's current location and recent disaster events, generate personalized safety recommendations.

  Location: {{{location}}}
  Recent Disaster Events: {{{recentDisasterEvents}}}

  Provide specific and actionable advice to ensure the user's safety.
  The safetyRecommendations should be formatted as a list.
  Do not act as the user, you are an assistant.`,
});

const personalizedSafetyTipsFlow = ai.defineFlow(
  {
    name: 'personalizedSafetyTipsFlow',
    inputSchema: PersonalizedSafetyTipsInputSchema,
    outputSchema: PersonalizedSafetyTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
