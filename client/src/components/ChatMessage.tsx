
import React, { useState } from 'react';
import { Copy, RotateCcw, Volume2, User, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
  onRetry: () => void;
  onSpeak: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry, onSpeak }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleSpeak = async () => {
    setIsPlaying(true);
    try {
      await onSpeak(message.content);
    } finally {
      setIsPlaying(false);
    }
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <Card className={`max-w-4xl ${isUser ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isUser ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            
            <div className="flex-1 min-w-0">
              {isUser ? (
                <p className="text-white">{message.content}</p>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      code: ({ children, className, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        if (match) {
                          return (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        }
                        return (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {!isUser && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t dark:border-gray-600">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={onRetry}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Retry</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.content)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSpeak}
                        disabled={isPlaying}
                      >
                        <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-green-500' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Speak</TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMessage;
