
import React from 'react';
import { Button } from "@/components/ui/button";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SmartSuggestionsProps {
  suggestions: string[];
  lastMessage: Message;
  onSuggestionClick: (suggestion: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ 
  suggestions, 
  lastMessage, 
  onSuggestionClick 
}) => {
  // Don't show suggestions if the last message is from the user
  if (lastMessage?.role === 'user') {
    return null;
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Add context reference to the suggestion
    const contextualSuggestion = `${suggestion} (about what you just explained)`;
    onSuggestionClick(contextualSuggestion);
  };

  return (
    <div className="border-t bg-gray-50 dark:bg-gray-800/50 p-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">💡 Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;
