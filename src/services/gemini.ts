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
  },

  async analyzeProjectFile(file: File): Promise<{
    description: string;
    tasks: Partial<Task>[];
  }> {
    try {
      // Read file as base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Map file extension to MIME type
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const mimeMap: Record<string, string> = {
        'pdf': 'application/pdf',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'txt': 'text/plain',
        'md': 'text/markdown',
      };
      const mimeType = mimeMap[ext] || file.type || 'application/octet-stream';

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            }
          },
          {
            text: `Read and analyze this project document thoroughly. Based on its contents:
1. Write a concise project description in Arabic (2-3 sentences).
2. Generate 5-8 balanced tasks for the project. Each task should have a title in Arabic, a description in Arabic, and a weight (1-10) based on complexity.
The goal is fair, balanced task distribution for a student team project.`
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              tasks: {
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
            required: ["description", "tasks"],
          },
        },
      });

      const text = response.text.trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error analyzing project file:", error);
      return { description: '', tasks: [] };
    }
  }
};
