
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CareerGuidanceComponent from '../components/CareerGuidance';

const CareerGuidancePage = () => {
  const handleStartLearning = (topic: string, role: string) => {
    // Post message to parent window to start learning
    if (window.opener) {
      window.opener.postMessage({
        type: 'START_LEARNING',
        payload: { topic, role }
      }, '*');
      window.close();
    }
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to EduBuddy
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Career Path Guidance
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto max-w-4xl p-4">
        <CareerGuidanceComponent onStartLearning={handleStartLearning} />
      </main>
    </div>
  );
};

export default CareerGuidancePage;
