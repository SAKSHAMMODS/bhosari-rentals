'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating concise and appealing bike descriptions.
 *
 * - generateBikeDescription - A function that handles the generation of bike descriptions.
 * - GenerateBikeDescriptionInput - The input type for the generateBikeDescription function.
 * - GenerateBikeDescriptionOutput - The return type for the generateBikeDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBikeDescriptionInputSchema = z.object({
  brand: z.string().describe('The brand of the bike.'),
  model: z.string().describe('The model name of the bike.'),
  type: z.string().describe('The type of bike (e.g., Mountain Bike, Road Bike, Electric Bike).'),
  frameSize: z.string().describe('The frame size of the bike (e.g., Small, Medium, Large).'),
  color: z.string().describe('The color of the bike.'),
  features: z
    .string()
    .describe('A comma-separated list of key features (e.g., hydraulic disc brakes, 12-speed, carbon frame).'),
  condition: z.string().describe('The condition of the bike (e.g., New, Excellent, Good).'),
  rentalPricePerDay: z.number().describe('The rental price of the bike per day.'),
});
export type GenerateBikeDescriptionInput = z.infer<typeof GenerateBikeDescriptionInputSchema>;

const GenerateBikeDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise and appealing description of the bike.'),
});
export type GenerateBikeDescriptionOutput = z.infer<typeof GenerateBikeDescriptionOutputSchema>;

export async function generateBikeDescription(
  input: GenerateBikeDescriptionInput
): Promise<GenerateBikeDescriptionOutput> {
  return generateBikeDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBikeDescriptionPrompt',
  input: {schema: GenerateBikeDescriptionInputSchema},
  output: {schema: GenerateBikeDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in bike rental descriptions. Your task is to create a concise and appealing description for a bike based on its specifications, designed to attract customers for rental. Highlight its unique selling points and features. The description should be no more than 60 words.

Bike Specifications:
Brand: {{{brand}}}
Model: {{{model}}}
Type: {{{type}}}
Frame Size: {{{frameSize}}}
Color: {{{color}}}
Features: {{{features}}}
Condition: {{{condition}}}
Rental Price per Day: ${{{rentalPricePerDay}}}

Generate the bike description:`,
});

const generateBikeDescriptionFlow = ai.defineFlow(
  {
    name: 'generateBikeDescriptionFlow',
    inputSchema: GenerateBikeDescriptionInputSchema,
    outputSchema: GenerateBikeDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
