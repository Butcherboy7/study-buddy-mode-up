
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';

interface CareerPath {
  role: string;
  skills: string[];
  roadmap: string[];
  tools: string[];
  description: string;
}

interface CareerGuidanceProps {
  onStartLearning: (topic: string, role: string) => void;
}

const CareerGuidance: React.FC<CareerGuidanceProps> = ({ onStartLearning }) => {
  const [formData, setFormData] = useState({
    interests: '',
    goals: '',
    strengths: '',
    experience: ''
  });
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCareerPaths = async () => {
    setIsLoading(true);
    try {
      // Mock career path generation - in real app, this would call Gemini API
      const mockPaths: CareerPath[] = [
        {
          role: "Software Developer",
          description: "Build applications and websites using various programming languages",
          skills: ["JavaScript", "React", "Python", "Git", "Problem Solving"],
          roadmap: [
            "Learn HTML, CSS, JavaScript basics",
            "Master a framework like React or Vue",
            "Learn backend development with Node.js or Python",
            "Practice with projects and build portfolio",
            "Apply for junior developer positions"
          ],
          tools: ["VS Code", "GitHub", "Node.js", "React", "MongoDB"]
        },
        {
          role: "Data Scientist",
          description: "Analyze complex data to help organizations make better decisions",
          skills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
          roadmap: [
            "Learn Python and basic statistics",
            "Master data manipulation with Pandas",
            "Study machine learning algorithms",
            "Practice with real datasets",
            "Build a portfolio of data projects"
          ],
          tools: ["Python", "Jupyter Notebook", "TensorFlow", "Tableau", "SQL"]
        },
        {
          role: "UX Designer",
          description: "Design user-friendly interfaces and experiences for digital products",
          skills: ["Design Thinking", "Prototyping", "User Research", "Wireframing", "Visual Design"],
          roadmap: [
            "Learn design fundamentals and theory",
            "Master design tools like Figma",
            "Study user research methods",
            "Create portfolio projects",
            "Network with other designers"
          ],
          tools: ["Figma", "Adobe Creative Suite", "Sketch", "InVision", "Miro"]
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCareerPaths(mockPaths);
    } catch (error) {
      console.error('Error generating career paths:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.interests.trim() && formData.goals.trim();

  return (
    <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
      <div className="space-y-4">
        <div>
          <Label htmlFor="interests">What are your interests? *</Label>
          <Input
            id="interests"
            placeholder="e.g., technology, creativity, helping people..."
            value={formData.interests}
            onChange={(e) => handleInputChange('interests', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="goals">What are your career goals? *</Label>
          <Textarea
            id="goals"
            placeholder="e.g., work remotely, high salary, creative freedom..."
            value={formData.goals}
            onChange={(e) => handleInputChange('goals', e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="strengths">What are your strengths?</Label>
          <Input
            id="strengths"
            placeholder="e.g., problem solving, communication, analytical thinking..."
            value={formData.strengths}
            onChange={(e) => handleInputChange('strengths', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="experience">Previous experience/education</Label>
          <Input
            id="experience"
            placeholder="e.g., computer science degree, self-taught programming..."
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
          />
        </div>

        <Button 
          onClick={generateCareerPaths} 
          className="w-full" 
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Paths...
            </>
          ) : (
            'Generate Career Paths'
          )}
        </Button>
      </div>

      {careerPaths.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Recommended Career Paths</h3>
          {careerPaths.map((path, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{path.role}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">{path.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Required Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Learning Roadmap:</h4>
                  <ul className="text-xs space-y-1">
                    {path.roadmap.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Tools & Platforms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.tools.map((tool, idx) => (
                      <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onStartLearning(path.skills[0], path.role)}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerGuidance;
