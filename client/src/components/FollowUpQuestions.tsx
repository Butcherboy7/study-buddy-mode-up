
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from 'lucide-react';

interface FollowUpQuestionsProps {
  lastMessage: { role: 'user' | 'assistant'; content: string } | null;
  studyMode: string;
  onQuestionClick: (question: string) => void;
}

const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({ 
  lastMessage, 
  studyMode, 
  onQuestionClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getFollowUpQuestions = () => {
    if (!lastMessage || lastMessage.role === 'user') return [];

    const baseQuestions = ['Can you explain that differently?', 'Give me an example', 'What should I do next?'];
    
    const modeSpecificQuestions = {
      coding: ['Show me the code', 'Debug this for me', 'Best practices?', 'Performance tips?'],
      math: ['Step by step solution', 'Practice problems', 'Real world application', 'Visual explanation'],
      science: ['How does this work?', 'Real life examples', 'Related concepts', 'Experiments to try'],
      law: ['Case studies', 'Practical applications', 'Recent changes', 'Common mistakes'],
      history: ['Why is this important?', 'What happened next?', 'Key figures involved', 'Modern parallels'],
      general: ['More details', 'Simplify this', 'Related topics', 'How to remember this']
    };

    return [...baseQuestions, ...(modeSpecificQuestions[studyMode] || modeSpecificQuestions.general)];
  };

  const questions = getFollowUpQuestions();
  
  if (questions.length === 0) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick follow-up questions:</p>
          <div className="grid gap-1">
            {questions.slice(0, 6).map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start h-auto p-2 text-left text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => {
                  onQuestionClick(question);
                  setIsOpen(false);
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FollowUpQuestions;
