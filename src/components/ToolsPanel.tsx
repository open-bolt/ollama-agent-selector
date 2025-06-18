
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, FileText, FolderOpen, Search, Clock, Calendar, Bot } from 'lucide-react';
import { ollamaTools } from '@/utils/ollamaTools';

interface ToolsPanelProps {
  isVisible: boolean;
  selectedModel: string;
}

const getToolIcon = (toolName: string) => {
  switch (toolName) {
    case 'read_file':
      return <FileText className="w-4 h-4" />;
    case 'read_directory':
      return <FolderOpen className="w-4 h-4" />;
    case 'search_files':
      return <Search className="w-4 h-4" />;
    case 'get_current_time':
      return <Clock className="w-4 h-4" />;
    case 'get_current_date':
      return <Calendar className="w-4 h-4" />;
    case 'get_agent_info':
      return <Bot className="w-4 h-4" />;
    default:
      return <Wrench className="w-4 h-4" />;
  }
};

const ToolsPanel: React.FC<ToolsPanelProps> = ({ isVisible, selectedModel }) => {
  if (!isVisible) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wrench className="w-5 h-5 text-blue-600" />
          Available Tools
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedModel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ollamaTools.map((tool) => (
            <div
              key={tool.function.name}
              className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getToolIcon(tool.function.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  {tool.function.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {tool.function.description}
                </p>
                {tool.function.parameters.required && tool.function.parameters.required.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Required: </span>
                    {tool.function.parameters.required.map((param, index) => (
                      <Badge key={param} variant="outline" className="text-xs mr-1">
                        {param}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-blue-800">
            <strong>Usage:</strong> These tools are automatically available when you chat with tool-enabled models. 
            Simply ask questions or request actions that would benefit from these capabilities!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsPanel;
