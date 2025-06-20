import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Settings, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { mockModels, generateMockResponse, simulateStreamingResponse } from '@/utils/ollamaSimulator';
import { ollamaTools, executeOllamaTool } from '@/utils/ollamaTools';
import ToolsPanel from './ToolsPanel';

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    family?: string;
    format?: string;
    parameter_size?: string;
  };
}

interface ModelCapabilities {
  vision: boolean;
  tools: boolean;
  multimodal: boolean;
  streaming: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [capabilities, setCapabilities] = useState<ModelCapabilities>({
    vision: false,
    tools: false,
    multimodal: false,
    streaming: true
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [toolsEnabled, setToolsEnabled] = useState(false);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check Ollama connection and fetch models
  useEffect(() => {
    checkOllamaConnection();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkOllamaConnection = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        setModels(data.models || []);
        setIsConnected(true);
        setIsSimulationMode(false);
        toast({
          title: "Connected to Ollama",
          description: `Found ${data.models?.length || 0} models`,
        });
      }
    } catch (error) {
      setIsConnected(false);
      setIsSimulationMode(true);
      setModels(mockModels);
      toast({
        title: "Simulation Mode",
        description: "Using mock models for testing. Install Ollama to connect to real models.",
        variant: "default",
      });
    }
  };

  const detectModelCapabilities = (modelName: string): ModelCapabilities => {
    const name = modelName.toLowerCase();
    
    // Vision models detection
    const hasVision = name.includes('vision') || 
                     name.includes('llava') || 
                     name.includes('bakllava') ||
                     name.includes('moondream') ||
                     name.includes('minicpm-v');

    // Tool-capable models detection - expanded list
    const hasTools = name.includes('functionary') ||
                    name.includes('hermes') ||
                    name.includes('mistral') ||
                    name.includes('mixtral') ||
                    name.includes('codellama') ||
                    name.includes('llama3') ||
                    name.includes('qwen') ||
                    name.includes('phi') ||
                    name.includes('gemma');

    return {
      vision: hasVision,
      tools: hasTools,
      multimodal: hasVision,
      streaming: true
    };
  };

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
    const caps = detectModelCapabilities(modelName);
    setCapabilities(caps);
    setToolsEnabled(caps.tools);
    setShowTools(caps.tools);
    setMessages([]);
    setSelectedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToolCall = async (toolName: string, parameters: any) => {
    console.log(`Tool called: ${toolName}`, parameters);
    
    const toolResult = await executeOllamaTool(toolName, parameters);
    
    // Add tool result as a system message for context
    const toolMessage: ChatMessage = {
      role: 'assistant',
      content: `**Tool Result: ${toolName}**\n\n${toolResult.error || toolResult.result}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, toolMessage]);
    
    return toolResult;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedModel || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      image: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (isSimulationMode) {
        // Enhanced simulation with tool support
        const assistantMessageObj: ChatMessage = {
          role: 'assistant',
          content: '',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessageObj]);

        // Check if the message might trigger a tool call
        let finalResponse = '';
        
        if (toolsEnabled && (
          inputMessage.toLowerCase().includes('read file') ||
          inputMessage.toLowerCase().includes('list directory') ||
          inputMessage.toLowerCase().includes('search for') ||
          inputMessage.toLowerCase().includes('what time') ||
          inputMessage.toLowerCase().includes('what date') ||
          inputMessage.toLowerCase().includes('who are you') ||
          inputMessage.toLowerCase().includes('your name')
        )) {
          // Simulate tool usage
          if (inputMessage.toLowerCase().includes('read file')) {
            const toolResult = await handleToolCall('read_file', { path: 'README.md' });
            finalResponse = `I'll read that file for you.\n\n${toolResult.result}`;
          } else if (inputMessage.toLowerCase().includes('list directory') || inputMessage.toLowerCase().includes('show files')) {
            const toolResult = await handleToolCall('read_directory', { path: '.' });
            finalResponse = `Here are the files and directories:\n\n${toolResult.result}`;
          } else if (inputMessage.toLowerCase().includes('search for')) {
            const toolResult = await handleToolCall('search_files', { query: 'md' });
            finalResponse = `Here are the search results:\n\n${toolResult.result}`;
          } else if (inputMessage.toLowerCase().includes('what time')) {
            const toolResult = await handleToolCall('get_current_time', { format: '12h' });
            finalResponse = toolResult.result;
          } else if (inputMessage.toLowerCase().includes('what date')) {
            const toolResult = await handleToolCall('get_current_date', { format: 'relative' });
            finalResponse = toolResult.result;
          } else if (inputMessage.toLowerCase().includes('who are you') || inputMessage.toLowerCase().includes('your name')) {
            const toolResult = await handleToolCall('get_agent_info', {});
            finalResponse = `Let me tell you about myself:\n\n${toolResult.result}`;
          }
        } else {
          finalResponse = generateMockResponse(inputMessage, selectedModel);
        }

        if (streamingEnabled) {
          let streamedMessage = '';
          const words = finalResponse.split(' ');
          
          for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            streamedMessage += words[i] + (i < words.length - 1 ? ' ' : '');
            setMessages(prev => 
              prev.map((msg, idx) => 
                idx === prev.length - 1 
                  ? { ...msg, content: streamedMessage }
                  : msg
              )
            );
          }
        } else {
          setMessages(prev => 
            prev.map((msg, idx) => 
              idx === prev.length - 1 
                ? { ...msg, content: finalResponse }
                : msg
            )
          );
        }
      } else {
        // Real Ollama request with tools
        const requestBody: any = {
          model: selectedModel,
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content,
              ...(msg.image && { images: [msg.image.split(',')[1]] })
            })),
            {
              role: 'user',
              content: inputMessage,
              ...(selectedImage && { images: [selectedImage.split(',')[1]] })
            }
          ],
          stream: streamingEnabled,
          options: {
            temperature: 0.7
          }
        };

        // Add tools if enabled
        if (toolsEnabled && capabilities.tools) {
          requestBody.tools = ollamaTools;
        }

        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let assistantMessage = '';

        if (streamingEnabled) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          
          const assistantMessageObj: ChatMessage = {
            role: 'assistant',
            content: '',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessageObj]);

          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                
                // Handle tool calls
                if (data.message?.tool_calls) {
                  for (const toolCall of data.message.tool_calls) {
                    await handleToolCall(toolCall.function.name, toolCall.function.arguments);
                  }
                }
                
                if (data.message?.content) {
                  assistantMessage += data.message.content;
                  setMessages(prev => 
                    prev.map((msg, idx) => 
                      idx === prev.length - 1 
                        ? { ...msg, content: assistantMessage }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        } else {
          const data = await response.json();
          
          // Handle tool calls in non-streaming mode
          if (data.message?.tool_calls) {
            for (const toolCall of data.message.tool_calls) {
              await handleToolCall(toolCall.function.name, toolCall.function.arguments);
            }
          }
          
          assistantMessage = data.message?.content || 'No response';
          
          const assistantMessageObj: ChatMessage = {
            role: 'assistant',
            content: assistantMessage,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessageObj]);
        }
      }

      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: isSimulationMode ? "Simulation error occurred" : "Failed to send message. Check your Ollama connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 gap-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            Ollama Chat Interface
            {isConnected ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            ) : isSimulationMode ? (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Simulation Mode
              </Badge>
            ) : (
              <Badge variant="destructive">Disconnected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Selection */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="model-select">Select Model</Label>
              <Select value={selectedModel} onValueChange={handleModelSelect}>
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Choose an Ollama model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      <div className="flex flex-col">
                        <span>{model.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(model.size / 1e9).toFixed(1)}GB
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={checkOllamaConnection}
              variant="outline"
              className="sm:self-end"
            >
              <Settings className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Capabilities Display */}
          {selectedModel && (
            <div className="space-y-3">
              <Label>Model Capabilities</Label>
              <div className="flex flex-wrap gap-2">
                {capabilities.vision && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Vision Support
                  </Badge>
                )}
                {capabilities.tools && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Tool Usage
                  </Badge>
                )}
                {capabilities.multimodal && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Multimodal
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  Streaming
                </Badge>
              </div>

              {/* Settings */}
              <div className="flex flex-wrap gap-4">
                {capabilities.tools && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tools"
                      checked={toolsEnabled}
                      onCheckedChange={setToolsEnabled}
                    />
                    <Label htmlFor="tools">Enable Tools</Label>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="streaming"
                    checked={streamingEnabled}
                    onCheckedChange={setStreamingEnabled}
                  />
                  <Label htmlFor="streaming">Streaming</Label>
                </div>
                {capabilities.tools && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-tools"
                      checked={showTools}
                      onCheckedChange={setShowTools}
                    />
                    <Label htmlFor="show-tools">Show Tools</Label>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tools Panel */}
      <ToolsPanel isVisible={showTools && capabilities.tools} selectedModel={selectedModel} />

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with your {isSimulationMode ? 'simulated' : 'Ollama'} model!</p>
                {capabilities.vision && (
                  <p className="text-sm mt-2">This model supports image uploads 📸</p>
                )}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {message.role === 'user' ? (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Uploaded"
                          className="max-w-xs rounded mb-2"
                        />
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isSimulationMode ? 'Simulating...' : 'Thinking...'}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            {!isConnected && !isSimulationMode && (
              <Alert className="mb-4">
                <AlertDescription>
                  Not connected to Ollama. Make sure Ollama is running on localhost:11434
                </AlertDescription>
              </Alert>
            )}
            
            {isSimulationMode && (
              <Alert className="mb-4">
                <AlertDescription>
                  Running in simulation mode with mock models. Install and run Ollama to use real models.
                </AlertDescription>
              </Alert>
            )}
            
            {!selectedModel && (isConnected || isSimulationMode) && (
              <Alert className="mb-4">
                <AlertDescription>
                  Please select a model to start chatting
                </AlertDescription>
              </Alert>
            )}

            {selectedImage && (
              <div className="mb-4 relative inline-block">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-xs rounded border"
                />
                <Button
                  onClick={removeImage}
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                >
                  ×
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedModel
                      ? "Type your message..."
                      : "Select a model first..."
                  }
                  disabled={!selectedModel || (!isConnected && !isSimulationMode)}
                  className="min-h-[60px] resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                {capabilities.vision && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="icon"
                      disabled={!selectedModel || (!isConnected && !isSimulationMode)}
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || !selectedModel || (!isConnected && !isSimulationMode) || isLoading}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
