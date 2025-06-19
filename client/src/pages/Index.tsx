import React, { useState, useRef, useEffect } from 'react';
import { Mic, Moon, Sun, Trash2, Send, Code, MessageSquare, Briefcase, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ChatMessage from '../components/ChatMessage';
import SmartSuggestions from '../components/SmartSuggestions';
import FollowUpQuestions from '../components/FollowUpQuestions';
import CodeEditor from '../components/CodeEditor';
import CareerGuidanceComponent from '../components/CareerGuidance';
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
    name: 'General',
    placeholder: 'Ask me anything! I can help with various topics...',
    systemPrompt: 'You are a helpful tutor. Provide clear, engaging explanations on any topic and adapt your teaching style to the subject.',
    suggestions: ['Explain simply', 'Give examples', 'How to remember this?', 'Related topics', 'Quick quiz']
  }
};

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [showStarterPrompts, setShowStarterPrompts] = useState(true);
  const [studyMode, setStudyMode] = useState<keyof typeof STUDY_MODES>('coding');
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, setMessages } = useChat(STUDY_MODES[studyMode].systemPrompt);
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

  const handleStartLearning = (topic: string, role: string) => {
    setActiveTab('chat');
    handleSendMessage(`I want to be a ${role}, for that I need to learn ${topic}. Please explain.`);
  };

  const handleAIHelp = async (code: string, language: string, question: string) => {
    setActiveTab('chat');
    const prompt = `Please help me with this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n${question}`;
    await handleSendMessage(prompt);
  };

  const getStarterPrompts = () => {
    const basePrompts = [
      "How do I get started with programming?",
      "What are the best programming languages to learn?",
      "Can you explain variables and data types?",
      "How do I debug my code effectively?"
    ];
    
    switch (studyMode) {
      case 'math':
        return [
          "Explain quadratic equations step by step",
          "How do I solve calculus derivatives?",
          "What's the difference between mean and median?",
          "Show me how to solve word problems"
        ];
      case 'science':
        return [
          "Explain how photosynthesis works",
          "What are Newton's laws of motion?",
          "How does DNA replication happen?",
          "What causes chemical reactions?"
        ];
      case 'law':
        return [
          "What are constitutional rights?",
          "Explain contract law basics",
          "How does the court system work?",
          "What's the difference between civil and criminal law?"
        ];
      case 'history':
        return [
          "Tell me about World War II",
          "What caused the Industrial Revolution?",
          "Explain the American Civil Rights Movement",
          "How did ancient civilizations develop?"
        ];
      default:
        return basePrompts;
    }
  };

  const renderChatContent = () => (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showStarterPrompts && messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">EB</span>
                </div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to EduBuddy
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  AI-powered learning assistant with Gemini
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current mode:</p>
                <p className="font-medium text-blue-600 dark:text-blue-400 text-lg">
                  {STUDY_MODES[studyMode].name}
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Quick start questions:</p>
                <div className="grid gap-3">
                  {getStarterPrompts().map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm"
                      onClick={() => handleSendMessage(prompt)}
                    >
                      <span className="text-blue-600 dark:text-blue-400 mr-2">→</span>
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
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
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading}
              className="pr-20"
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
              <FollowUpQuestions
                lastMessage={messages[messages.length - 1] || null}
                studyMode={studyMode}
                onQuestionClick={handleSendMessage}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${isListening ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                  >
                    <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isListening ? 'Stop listening' : 'Voice input'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Status indicator */}
        {isLoading && (
          <div className="mt-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
              </div>
              <span>Generating response with Gemini...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r transition-all duration-300 flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">EB</span>
                  </div>
                  <span className="font-bold text-sm">EduBuddy</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex-1 p-2">
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === 'chat' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('chat')}
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} h-12`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {sidebarOpen && <span className="ml-2">Chat</span>}
                  </Button>
                </TooltipTrigger>
                {!sidebarOpen && <TooltipContent side="right">Chat</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === 'code' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('code')}
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} h-12`}
                  >
                    <Code className="h-4 w-4" />
                    {sidebarOpen && <span className="ml-2">Code Editor</span>}
                  </Button>
                </TooltipTrigger>
                {!sidebarOpen && <TooltipContent side="right">Code Editor</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === 'career' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('career')}
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} h-12`}
                  >
                    <Briefcase className="h-4 w-4" />
                    {sidebarOpen && <span className="ml-2">Career Guide</span>}
                  </Button>
                </TooltipTrigger>
                {!sidebarOpen && <TooltipContent side="right">Career Guide</TooltipContent>}
              </Tooltip>
            </div>
          </div>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="p-4 border-t">
              <Select value={studyMode} onValueChange={(value: keyof typeof STUDY_MODES) => setStudyMode(value)}>
                <SelectTrigger className="w-full">
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
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === 'chat' && 'AI Chat Assistant'}
                {activeTab === 'code' && 'Code Playground'}
                {activeTab === 'career' && 'Career Guidance'}
              </h1>
              
              {!sidebarOpen && (
                <Select value={studyMode} onValueChange={(value: keyof typeof STUDY_MODES) => setStudyMode(value)}>
                  <SelectTrigger className="w-40">
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
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMessages([])}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear conversation</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Main Content Area with Resizable Panels */}
          <div className="flex-1">
            {activeTab === 'chat' && renderChatContent()}
            
            {activeTab === 'code' && (
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={100} minSize={50}>
                  <CodeEditor onAIHelp={handleAIHelp} />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}

            {activeTab === 'career' && (
              <div className="h-full bg-gray-50 dark:bg-gray-900">
                <div className="h-full overflow-auto">
                  <CareerGuidanceComponent onStartLearning={handleStartLearning} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;