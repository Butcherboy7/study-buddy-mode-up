
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
    <div className="border-t bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Continue learning:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="text-blue-500 mr-1">•</span>
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;
