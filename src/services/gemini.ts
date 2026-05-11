/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Task, Contribution } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async suggestTasks(projectDescription: string): Promise<Partial<Task>[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given this project description: "${projectDescription}", suggest a list of 5-8 balanced tasks. 
        For each task, provide a title, a brief description, and a "weight" (1-10) based on complexity.
        The goal is a balanced project distribution.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                weight: { type: Type.NUMBER },
              },
              required: ["title", "description", "weight"],
            },
          },
        },
      });

      const text = response.text.trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error suggesting tasks:", error);
      return [];
    }
  },

  async analyzeContribution(contributionContent: string, taskDescription: string): Promise<Contribution['analysis']> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this student contribution: "${contributionContent}" 
        for the following task: "${taskDescription}".
        Rate the quality as 'Critical' (essential solution/masterpiece), 'Major' (solid work), or 'Minor' (minimal effort/superficial).
        Provide a 1-sentence explanation of why.
        Provide a score from 1 to 10.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quality: { type: Type.STRING, enum: ["Critical", "Major", "Minor"] },
              feedback: { type: Type.STRING },
              score: { type: Type.NUMBER },
            },
            required: ["quality", "feedback", "score"],
          },
        },
      });

      const text = response.text.trim();
      return JSON.parse(text) as Contribution['analysis'];
    } catch (error) {
      console.error("Error analyzing contribution:", error);
      return {
        quality: 'Minor',
        feedback: "Could not analyze contribution.",
        score: 1
      };
    }
  }
};
