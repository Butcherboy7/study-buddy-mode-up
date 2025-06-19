
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Moon, Sun, Trash2, ChevronDown, Target, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ChatMessage from '../components/ChatMessage';
import CareerGuidance from '../components/CareerGuidance';
import SmartSuggestions from '../components/SmartSuggestions';
import { useChat } from '../hooks/useChat';
import { useSpeech } from '../hooks/useSpeech';

const STUDY_MODES = {
  coding: {
    name: 'Coding',
    placeholder: 'Ask me about programming, algorithms, or debugging...',
    systemPrompt: 'You are a coding tutor. Help with programming concepts, debugging, best practices, and provide clear code examples.',
    suggestions: ['Explain like I\'m 5', 'Show me code example', 'Debug this', 'Best practices', 'Quiz me']
  },
  math: {
    name: 'Math',
    placeholder: 'Ask me about equations, formulas, or problem solving...',
    systemPrompt: 'You are a math tutor. Explain mathematical concepts clearly, show step-by-step solutions, and use visual analogies.',
    suggestions: ['Step-by-step solution', 'Real-life example', 'Visualize this', 'Practice problems', 'Simplify']
  },
  science: {
    name: 'Science',
    placeholder: 'Ask me about physics, chemistry, biology, or experiments...',
    systemPrompt: 'You are a science tutor. Explain scientific concepts with examples, relate to everyday life, and encourage curiosity.',
    suggestions: ['Real-world example', 'Simple explanation', 'How does it work?', 'Experiment ideas', 'Quiz me']
  },
  law: {
    name: 'Law',
    placeholder: 'Ask me about legal concepts, cases, or procedures...',
    systemPrompt: 'You are a law tutor. Explain legal concepts clearly, provide case examples, and discuss practical applications.',
    suggestions: ['Case examples', 'Plain English', 'Real applications', 'Key principles', 'Test my knowledge']
  },
  history: {
    name: 'History',
    placeholder: 'Ask me about historical events, figures, or timelines...',
    systemPrompt: 'You are a history tutor. Make history engaging with stories, context, and connections to modern times.',
    suggestions: ['Tell me a story', 'Why is this important?', 'Timeline view', 'Key figures', 'Modern connections']
  },
  general: {
    name: 'General Learning',
    placeholder: 'Ask me anything you want to learn about...',
    systemPrompt: 'You are a knowledgeable tutor. Adapt your teaching style to any subject and make learning engaging.',
    suggestions: ['Explain simply', 'Give examples', 'Break it down', 'Quiz me', 'More details']
  },
  custom: {
    name: 'Custom',
    placeholder: 'Define your own learning focus...',
    systemPrompt: 'You are an adaptive tutor. Follow the user\'s specific learning preferences and goals.',
    suggestions: ['Explain more', 'Give examples', 'Test me', 'Simplify', 'Deep dive']
  }
};

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [studyMode, setStudyMode] = useState('general');
  const [careerPanelOpen, setCareerPanelOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showStarterPrompts, setShowStarterPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, clearChat } = useChat(STUDY_MODES[studyMode].systemPrompt);
  const { startListening, stopListening, isListening, speak } = useSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowStarterPrompts(false);
    }
  }, [messages]);

  const handleSendMessage = async (text: string = message) => {
    if (!text.trim()) return;
    
    await sendMessage(text);
    setMessage('');
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setMessage(transcript);
      });
    }
  };

  const handleModeChange = (mode: string) => {
    setStudyMode(mode);
    setShowStarterPrompts(messages.length === 0);
  };

  const getStarterPrompts = () => {
    const prompts = {
      coding: ['How do I start learning Python?', 'Explain object-oriented programming', 'What is the difference between React and Vue?'],
      math: ['Help me understand calculus', 'How do I solve quadratic equations?', 'Explain statistics basics'],
      science: ['How does photosynthesis work?', 'Explain quantum physics simply', 'What causes climate change?'],
      law: ['What is constitutional law?', 'Explain contract basics', 'How does the court system work?'],
      history: ['Tell me about World War II', 'Explain the Renaissance period', 'What caused the American Revolution?'],
      general: ['How can I improve my memory?', 'What is artificial intelligence?', 'Explain time management techniques'],
      custom: ['Help me create a study plan', 'What should I focus on?', 'How do I stay motivated?']
    };
    return prompts[studyMode] || prompts.general;
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <header className="border-b bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduBuddy
            </h1>
            <Select value={studyMode} onValueChange={handleModeChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STUDY_MODES).map(([key, mode]) => (
                  <SelectItem key={key} value={key}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle dark mode</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  disabled={messages.length === 0}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear chat</TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Career Guidance Panel */}
          <Collapsible
            open={careerPanelOpen}
            onOpenChange={setCareerPanelOpen}
            className="border-r bg-white dark:bg-gray-800"
          >
            <CollapsibleTrigger className="flex items-center gap-2 p-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium">🎯 Career Path Guidance</span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${careerPanelOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="w-80">
              <CareerGuidance onStartLearning={(topic, role) => {
                handleSendMessage(`I wanna be a ${role}, for that I need to learn ${topic}. Please explain.`);
                setCareerPanelOpen(false);
              }} />
            </CollapsibleContent>
          </Collapsible>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {showStarterPrompts && messages.length === 0 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4 text-center text-gray-600 dark:text-gray-300">
                    Welcome to {STUDY_MODES[studyMode].name} mode! 🎓
                  </h2>
                  <div className="grid gap-2 max-w-2xl mx-auto">
                    {getStarterPrompts().map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => handleSendMessage(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  onRetry={() => sendMessage(msg.content)}
                  onSpeak={(text) => speak(text)}
                />
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <Card className="max-w-xs">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggestions */}
            {messages.length > 0 && (
              <SmartSuggestions
                suggestions={STUDY_MODES[studyMode].suggestions}
                lastMessage={messages[messages.length - 1]}
                onSuggestionClick={handleSendMessage}
              />
            )}

            {/* Input Area */}
            <div className="border-t bg-white dark:bg-gray-800 p-4">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={STUDY_MODES[studyMode].placeholder}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 ${isListening ? 'text-red-500' : ''}`}
                        onClick={handleVoiceInput}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice input</TooltipContent>
                  </Tooltip>
                </div>
                <Button onClick={() => handleSendMessage()} disabled={!message.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
