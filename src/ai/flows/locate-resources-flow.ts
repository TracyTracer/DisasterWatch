
'use server';
/**
 * @fileOverview An AI flow to locate disaster relief resources based on user query and location.
 *
 * - locateResources - A function that handles finding relevant resources.
 * - LocateResourcesInput - The input type for the locateResources function.
 * - LocateResourcesOutput - The return type for the locateResources function.
 * - Resource - The type definition for a resource.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { mockResources } from '@/lib/mock-data';

const ResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['shelter', 'medical', 'food', 'water', 'other']),
  address: z.string(),
  contact: z.string().optional(),
  operatingHours: z.string().optional(),
  notes: z.string().optional(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});
export type Resource = z.infer<typeof ResourceSchema>;

const LocateResourcesInputSchema = z.object({
  query: z.string().describe('The user\'s query for resources (e.g., "find shelters", "need food").'),
  location: z.string().optional().describe('The user\'s approximate current location (e.g., "downtown Yangon", "near city hall").'),
});
export type LocateResourcesInput = z.infer<typeof LocateResourcesInputSchema>;

const LocateResourcesOutputSchema = z.object({
  foundResources: z.array(ResourceSchema).describe('A list of relevant resources found based on the query.'),
});
export type LocateResourcesOutput = z.infer<typeof LocateResourcesOutputSchema>;

export async function locateResources(input: LocateResourcesInput): Promise<LocateResourcesOutput> {
  return locateResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locateResourcesPrompt',
  input: { schema: z.object({
    query: z.string(),
    location: z.string().optional(),
    availableResources: z.array(ResourceSchema),
  }) },
  output: { schema: LocateResourcesOutputSchema },
  prompt: `You are a helpful assistant for finding disaster relief resources.
Your task is to identify relevant resources from the provided list based on the user's query and optional location.

User's query: "{{query}}"
{{#if location}}User's approximate location: "{{location}}"{{/if}}

Consider keywords in the query like 'shelter', 'hospital', 'clinic', 'doctor', 'medical aid', 'food', 'water', 'emergency supplies'.
If a location is mentioned by the user, try to find resources whose address seems to match or be near that area.

Here is the list of currently available resources:
{{#each availableResources}}
Resource ID: {{id}}
Name: {{name}}
Type: {{type}}
Address: {{address}}
{{#if contact}}Contact: {{contact}}{{/if}}
{{#if operatingHours}}Operating Hours: {{operatingHours}}{{/if}}
{{#if notes}}Notes: {{notes}}{{/if}}
---
{{/each}}

Analyze the user's request and the details of each resource.
Return ONLY the resources that directly and strongly match the user's request for the type of resource and, if provided, the location.
If the query is for "medical help in downtown", a hospital in "downtown" is a strong match. A food bank in a different district is not.
If no resources clearly match, return an empty list for "foundResources".
Do not guess or infer too broadly. Stick to clear matches.
`,
});

const locateResourcesFlow = ai.defineFlow(
  {
    name: 'locateResourcesFlow',
    inputSchema: LocateResourcesInputSchema,
    outputSchema: LocateResourcesOutputSchema,
  },
  async (flowInput) => {
    // Map mockResources to ensure they conform to ResourceSchema, especially enum types
    const typedMockResources: Resource[] = mockResources.map(r => ({
      ...r,
      type: r.type as 'shelter' | 'medical' | 'food' | 'water' | 'other', // Ensure enum conformance
    }));

    const { output } = await prompt({
      query: flowInput.query,
      location: flowInput.location,
      availableResources: typedMockResources,
    });

    if (!output) {
        return { foundResources: [] };
    }
    return output;
  }
);
