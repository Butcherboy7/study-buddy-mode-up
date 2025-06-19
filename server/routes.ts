import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint for Gemini integration
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, systemPrompt, history = [] } = req.body;

      if (!message?.trim()) {
        return res.status(400).json({ error: "Message is required" });
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt
      });

      // Convert history to Gemini format
      const chatHistory = history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      res.json({ response: text });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ 
        error: "Failed to generate response",
        fallback: "I'm experiencing technical difficulties. Please try again in a moment."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
