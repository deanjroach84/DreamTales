import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { storyRequestSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate a new bedtime story
  app.post("/api/stories/generate", async (req, res) => {
    try {
      const validatedData = storyRequestSchema.parse(req.body);
      const { childName, animal, theme } = validatedData;

      // Generate story using OpenAI
      const story = await generateBedtimeStory(childName, animal, theme);
      
      // Save story to storage
      const savedStory = await storage.createStory({
        childName,
        animal,
        theme,
        title: story.title,
        content: story.content,
      });

      res.json(savedStory);
    } catch (error) {
      console.error("Error generating story:", error);
      res.status(500).json({ 
        message: "Failed to generate story. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific story
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.getStory(id);
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  // Get stories by child name
  app.get("/api/stories", async (req, res) => {
    try {
      const childName = req.query.childName as string;
      
      if (!childName) {
        return res.status(400).json({ message: "Child name is required" });
      }
      
      const stories = await storage.getStoriesByChild(childName);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generateBedtimeStory(childName: string, animal: string, theme: string): Promise<{ title: string; content: string }> {
  const themeMessages = {
    friendship: "the importance of making friends and being kind to others",
    courage: "being brave even when things seem scary or difficult", 
    sharing: "the joy of sharing and caring for others",
    honesty: "the value of telling the truth and being honest",
    perseverance: "never giving up even when things are hard",
    empathy: "understanding and caring about how others feel",
    curiosity: "the excitement of exploring and learning new things",
  };

  const prompt = `Create a magical bedtime story for a child named ${childName}. The story should:

- Feature ${childName} as the main character alongside a wise and friendly ${animal}
- Teach a lesson about ${themeMessages[theme as keyof typeof themeMessages]}
- Be exactly 1000-1200 words long
- Have a gentle, soothing tone perfect for bedtime
- Include magical elements like enchanted forests, talking animals, or mystical places
- End with ${childName} learning the important lesson and feeling peaceful for sleep
- Use descriptive, imaginative language that sparks wonder
- Be age-appropriate for children 4-10 years old

Please respond with a JSON object containing:
- "title": A magical title for the story
- "content": The full story text (1000-1200 words)

Make the story unique, engaging, and filled with wonder. Include vivid descriptions of magical settings and gentle adventures that teach the chosen lesson naturally through the story.`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const result = await model.generateContent([
    `You are a magical storyteller who creates beautiful, educational bedtime stories for children. Your stories are always positive, gentle, and filled with wonder. Give every story a different title. Always respond with valid JSON.\n\n${prompt}`
  ]);

  const response = await result.response;
  const text = response.text();
  
  let parsedResult;
  try {
    // Clean the response text to extract JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsedResult = JSON.parse(cleanedText);
  } catch (error) {
    throw new Error("Invalid response from story generation");
  }
  
  if (!parsedResult.title || !parsedResult.content) {
    throw new Error("Invalid response from story generation");
  }

  return {
    title: parsedResult.title,
    content: parsedResult.content
  };
}

console.log("Google API Key loaded:", process.env.GOOGLE_API_KEY);
