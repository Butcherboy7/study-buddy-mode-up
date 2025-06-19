import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function registerRoutes(app: Express): Promise<Server> {
  // Code execution endpoint
  app.post("/api/execute", async (req, res) => {
    try {
      const { code, language } = req.body;

      if (!code?.trim()) {
        return res.status(400).json({ error: "Code is required" });
      }

      // Simple code execution for demonstration
      // In production, you'd want to use sandboxed execution
      let output = '';
      let error = '';

      if (language === 'javascript') {
        try {
          // Capture console.log output
          const logs: string[] = [];
          const originalLog = console.log;
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };

          // Execute the code
          eval(code);
          
          // Restore console.log
          console.log = originalLog;
          
          output = logs.join('\n') || 'Code executed successfully (no output)';
        } catch (err) {
          error = err instanceof Error ? err.message : String(err);
        }
      } else if (language === 'python') {
        // For Python, we'll return a simulated output
        // In production, you'd use a Python subprocess or container
        output = `Python execution simulated:\n${code}\n\n(Note: Full Python execution requires server-side setup)`;
      }

      res.json({ output, error });
    } catch (error) {
      console.error("Code execution error:", error);
      res.status(500).json({ error: "Failed to execute code" });
    }
  });

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
