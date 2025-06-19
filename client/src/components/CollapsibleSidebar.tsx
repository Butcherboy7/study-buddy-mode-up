
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, X, Target, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CollapsibleSidebarProps {
  onOpenCareerGuidance: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ onOpenCareerGuidance }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out border-r bg-white dark:bg-gray-800",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-start"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4 mr-2" />}
          {!isCollapsed && "Collapse"}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Career Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Get personalized career path recommendations and learning roadmaps.
              </p>
              <Button 
                onClick={onOpenCareerGuidance}
                className="w-full"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Career Guide
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Study Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                💡 Use voice input for hands-free learning
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                🎯 Switch study modes for different subjects
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                🔄 Use retry button to get alternative explanations
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CollapsibleSidebar;
