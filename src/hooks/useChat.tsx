import { useState, useCallback } from 'react';
import { useGemini } from './useGemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = (systemPrompt: string, apiKey?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage: sendGeminiMessage } = useGemini();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let response: string;
      
      if (apiKey) {
        // Use Gemini API
        response = await sendGeminiMessage(newMessages, systemPrompt, apiKey);
      } else {
        // Fallback to mock response
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        response = generateMockResponse(content, systemPrompt);
      }
      
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: apiKey 
          ? 'Sorry, I encountered an error with the Gemini API. Please check your API key and try again.' 
          : 'Sorry, I encountered an error. Please try again or configure your Gemini API key for better responses.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, systemPrompt, apiKey, sendGeminiMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
};

// Mock response generator (fallback)
const generateMockResponse = (userMessage: string, systemPrompt: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('python') || lowerMessage.includes('programming')) {
    return `## Getting Started with Python

Python is a versatile, beginner-friendly programming language. Here's what makes it special:

### Key Features:
- **Easy to read**: Python's syntax is clean and intuitive
- **Versatile**: Used for web development, data science, AI, automation
- **Large community**: Extensive libraries and support

### Basic Example:
\`\`\`python
# Hello World in Python
print("Hello, World!")

# Variables and data types
name = "EduBuddy"
age = 1
is_helpful = True

print(f"I'm {name}, I'm {age} year old, and helpful: {is_helpful}")
\`\`\`

Would you like me to explain any specific Python concept or show you more examples?`;
  }

  if (lowerMessage.includes('math') || lowerMessage.includes('equation')) {
    return `## Understanding Mathematical Concepts

Let me help you with math! Here's a step-by-step approach:

### Problem-Solving Strategy:
1. **Identify** what you're solving for
2. **Write down** what you know
3. **Choose** the right formula or method
4. **Solve** step by step
5. **Check** your answer

### Example - Quadratic Equation:
For ax² + bx + c = 0, use the quadratic formula:

**x = (-b ± √(b² - 4ac)) / 2a**

Would you like me to walk through a specific problem or explain another concept?`;
  }

  if (lowerMessage.includes('science') || lowerMessage.includes('physics')) {
    return `## Exploring Science Concepts

Science is all about understanding how our world works! Let me break this down:

### Scientific Method:
1. **Observe** - Notice something interesting
2. **Question** - Ask why or how it happens
3. **Hypothesize** - Make an educated guess
4. **Test** - Design experiments
5. **Analyze** - Look at the results
6. **Conclude** - Draw conclusions

### Real-World Connection:
Everything around you follows scientific principles - from the phone in your hand to the weather outside!

What specific science topic would you like to explore?`;
  }

  // Generic educational response
  return `Great question! Let me help you understand this topic better.

## Key Points to Remember:

• **Break it down**: Complex topics become easier when divided into smaller parts
• **Connect to what you know**: Link new information to familiar concepts
• **Practice actively**: Don't just read - engage with the material
• **Ask questions**: Curiosity drives learning

### Next Steps:
1. Identify the main concepts
2. Look for patterns and connections
3. Practice with examples
4. Test your understanding

Would you like me to dive deeper into any specific aspect of this topic?`;
};
