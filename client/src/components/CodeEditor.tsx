import React, { useState, useEffect } from 'react';
import { Play, Save, RotateCcw, Bug, Sparkles, Copy, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface CodeEditorProps {
  onAIHelp: (code: string, language: string, question: string) => void;
}

const LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    template: `// Welcome to the JavaScript playground!
function greet(name) {
  return \`Hello, \${name}! Welcome to EduBuddy.\`;
}

console.log(greet('Developer'));
console.log('Try editing this code and click Run!');`,
    example: 'console.log("Hello World");'
  },
  python: {
    name: 'Python',
    template: `# Welcome to the Python playground!
def greet(name):
    return f"Hello, {name}! Welcome to EduBuddy."

print(greet('Developer'))
print('Try editing this code and click Run!')`,
    example: 'print("Hello World")'
  },
  html: {
    name: 'HTML/CSS/JS',
    template: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduBuddy Code Playground</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to EduBuddy Code Playground!</h1>
        <p>Edit this HTML, CSS, and JavaScript to create amazing things.</p>
        <button onclick="showMessage()">Click me!</button>
        <div id="output"></div>
    </div>
    
    <script>
        function showMessage() {
            document.getElementById('output').innerHTML = 
                '<h2>Great job! You made it interactive!</h2>';
        }
    </script>
</body>
</html>`,
    example: '<h1>Hello World</h1>'
  }
};

const CodeEditor: React.FC<CodeEditorProps> = ({ onAIHelp }) => {
  const [language, setLanguage] = useState<keyof typeof LANGUAGES>('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');

  useEffect(() => {
    setCode(LANGUAGES[language].template);
    setOutput('');
    setError('');
  }, [language]);

  const runCode = async () => {
    setIsRunning(true);
    setError('');
    setOutput('Running...');

    try {
      if (language === 'html') {
        // For HTML, just display the code in an iframe
        setOutput('preview');
      } else {
        // Send code to backend for execution
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language })
        });

        const result = await response.json();
        
        if (result.error) {
          setError(result.error);
          setOutput('');
        } else {
          setOutput(result.output || 'Code executed successfully (no output)');
          setError('');
        }
      }
    } catch (err) {
      setError('Failed to execute code. Please check your syntax.');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const askAI = () => {
    if (!aiQuestion.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question about your code",
        variant: "destructive"
      });
      return;
    }
    onAIHelp(code, language, aiQuestion);
    setAiQuestion('');
  };

  const generateCode = () => {
    const question = `Generate a ${LANGUAGES[language].name} example that demonstrates best practices and common patterns. Make it educational and interactive.`;
    onAIHelp('', language, question);
  };

  const debugCode = () => {
    if (!code.trim()) {
      toast({
        title: "No Code to Debug",
        description: "Please write some code first",
        variant: "destructive"
      });
      return;
    }
    const question = `Debug this ${LANGUAGES[language].name} code and explain any issues: ${code}`;
    onAIHelp(code, language, question);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadCode = () => {
    const extensions = { javascript: 'js', python: 'py', html: 'html' };
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edubuddy-code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Code Playground</h2>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(value: keyof typeof LANGUAGES) => setLanguage(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGES).map(([key, lang]) => (
                  <SelectItem key={key} value={key}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={runCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          
          <Button onClick={generateCode} variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Example
          </Button>
          
          <Button onClick={debugCode} variant="outline">
            <Bug className="h-4 w-4 mr-2" />
            Debug
          </Button>
          
          <Button onClick={copyCode} variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          
          <Button onClick={downloadCode} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button 
            onClick={() => setCode(LANGUAGES[language].template)} 
            variant="outline" 
            size="sm"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Code Editor and Output */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b">
            <span className="text-sm font-medium">Editor</span>
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 font-mono text-sm resize-none border-0 rounded-none focus:ring-0"
            placeholder={`Write your ${LANGUAGES[language].name} code here...`}
          />
        </div>

        {/* Output Panel */}
        <div className="flex-1 flex flex-col border-t lg:border-t-0 lg:border-l">
          <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b">
            <span className="text-sm font-medium">Output</span>
          </div>
          <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 overflow-auto">
            {language === 'html' && output === 'preview' ? (
              <iframe
                srcDoc={code}
                className="w-full h-full border rounded"
                title="HTML Preview"
              />
            ) : (
              <>
                {error && (
                  <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded p-3 mb-4">
                    <p className="text-red-700 dark:text-red-400 font-medium">Error:</p>
                    <pre className="text-red-600 dark:text-red-300 text-sm mt-1 whitespace-pre-wrap">{error}</pre>
                  </div>
                )}
                {output && output !== 'preview' && (
                  <div className="bg-white dark:bg-gray-900 border rounded p-3">
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Output:</p>
                    <pre className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
                {!output && !error && (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                    <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Run" to execute your code</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Help Section */}
      <div className="border-t bg-white dark:bg-gray-800 p-4">
        <div className="flex gap-2">
          <Textarea
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Ask AI about your code: 'How can I optimize this?' or 'Explain this function'"
            className="flex-1 min-h-[60px] max-h-[120px]"
          />
          <Button onClick={askAI} disabled={!aiQuestion.trim()} className="bg-blue-600 hover:bg-blue-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;