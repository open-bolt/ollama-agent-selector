
export interface OllamaTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface ToolResult {
  name: string;
  result: string;
  error?: string;
}

// Mock file system for demo purposes (in a real app, this would use actual file APIs)
const mockFileSystem: Record<string, string | Record<string, any>> = {
  'README.md': '# Ollama Agent\n\nThis is a demonstration of tool usage with Ollama models.',
  'package.json': JSON.stringify({ name: 'ollama-agent', version: '1.0.0' }, null, 2),
  'src/': {
    'main.ts': 'console.log("Hello from Ollama Agent");',
    'utils/': {
      'helpers.ts': 'export const helper = () => "Helper function";'
    }
  },
  'docs/': {
    'guide.md': '# User Guide\n\nHow to use the Ollama Agent tools.',
    'api.md': '# API Reference\n\nTool documentation.'
  }
};

export const ollamaTools: OllamaTool[] = [
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a file',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The file path to read'
          }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_directory',
      description: 'List the contents of a directory',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The directory path to read',
            default: '.'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_files',
      description: 'Search for files by name or pattern',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query or pattern'
          },
          path: {
            type: 'string',
            description: 'The directory to search in',
            default: '.'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Get the current time',
      parameters: {
        type: 'object',
        properties: {
          format: {
            type: 'string',
            description: 'Time format (12h or 24h)',
            enum: ['12h', '24h'],
            default: '24h'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_current_date',
      description: 'Get the current date',
      parameters: {
        type: 'object',
        properties: {
          format: {
            type: 'string',
            description: 'Date format',
            enum: ['iso', 'us', 'eu', 'relative'],
            default: 'iso'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_agent_info',
      description: 'Get information about the current agent',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  }
];

export const executeOllamaTool = async (toolName: string, parameters: any): Promise<ToolResult> => {
  console.log(`Executing tool: ${toolName}`, parameters);

  try {
    switch (toolName) {
      case 'read_file':
        return await readFile(parameters.path);
      
      case 'read_directory':
        return await readDirectory(parameters.path || '.');
      
      case 'search_files':
        return await searchFiles(parameters.query, parameters.path || '.');
      
      case 'get_current_time':
        return getCurrentTime(parameters.format || '24h');
      
      case 'get_current_date':
        return getCurrentDate(parameters.format || 'iso');
      
      case 'get_agent_info':
        return getAgentInfo();
      
      default:
        return {
          name: toolName,
          result: '',
          error: `Unknown tool: ${toolName}`
        };
    }
  } catch (error) {
    return {
      name: toolName,
      result: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const readFile = async (path: string): Promise<ToolResult> => {
  const content = mockFileSystem[path];
  
  if (content === undefined) {
    return {
      name: 'read_file',
      result: '',
      error: `File not found: ${path}`
    };
  }
  
  if (typeof content === 'object') {
    return {
      name: 'read_file',
      result: '',
      error: `Path is a directory, not a file: ${path}`
    };
  }
  
  return {
    name: 'read_file',
    result: content
  };
};

const readDirectory = async (path: string): Promise<ToolResult> => {
  if (path === '.' || path === '/') {
    const items = Object.keys(mockFileSystem).map(key => {
      const isDirectory = typeof mockFileSystem[key] === 'object';
      return `${isDirectory ? 'DIR' : 'FILE'}: ${key}`;
    });
    
    return {
      name: 'read_directory',
      result: items.join('\n')
    };
  }
  
  const dirContent = mockFileSystem[path];
  
  if (dirContent === undefined) {
    return {
      name: 'read_directory',
      result: '',
      error: `Directory not found: ${path}`
    };
  }
  
  if (typeof dirContent !== 'object') {
    return {
      name: 'read_directory',
      result: '',
      error: `Path is a file, not a directory: ${path}`
    };
  }
  
  const items = Object.keys(dirContent).map(key => {
    const isDirectory = typeof dirContent[key] === 'object';
    return `${isDirectory ? 'DIR' : 'FILE'}: ${key}`;
  });
  
  return {
    name: 'read_directory',
    result: items.join('\n')
  };
};

const searchFiles = async (query: string, searchPath: string): Promise<ToolResult> => {
  const results: string[] = [];
  
  const searchInObject = (obj: Record<string, any>, currentPath: string) => {
    Object.keys(obj).forEach(key => {
      const fullPath = currentPath ? `${currentPath}/${key}` : key;
      
      if (key.toLowerCase().includes(query.toLowerCase())) {
        const isDirectory = typeof obj[key] === 'object';
        results.push(`${isDirectory ? 'DIR' : 'FILE'}: ${fullPath}`);
      }
      
      if (typeof obj[key] === 'object') {
        searchInObject(obj[key], fullPath);
      }
    });
  };
  
  if (searchPath === '.' || searchPath === '/') {
    searchInObject(mockFileSystem, '');
  } else {
    const dirContent = mockFileSystem[searchPath];
    if (typeof dirContent === 'object') {
      searchInObject(dirContent, searchPath);
    }
  }
  
  return {
    name: 'search_files',
    result: results.length > 0 ? results.join('\n') : `No files found matching: ${query}`
  };
};

const getCurrentTime = (format: string): ToolResult => {
  const now = new Date();
  let timeString: string;
  
  if (format === '12h') {
    timeString = now.toLocaleTimeString('en-US', { 
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  } else {
    timeString = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  return {
    name: 'get_current_time',
    result: `Current time: ${timeString}`
  };
};

const getCurrentDate = (format: string): ToolResult => {
  const now = new Date();
  let dateString: string;
  
  switch (format) {
    case 'us':
      dateString = now.toLocaleDateString('en-US');
      break;
    case 'eu':
      dateString = now.toLocaleDateString('en-GB');
      break;
    case 'relative':
      dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      break;
    default: // iso
      dateString = now.toISOString().split('T')[0];
  }
  
  return {
    name: 'get_current_date',
    result: `Current date: ${dateString}`
  };
};

const getAgentInfo = (): ToolResult => {
  const agentInfo = {
    name: 'Ollama Agent',
    version: '1.0.0',
    capabilities: [
      'File system operations',
      'Directory navigation',
      'File search',
      'Time and date queries',
      'Tool execution'
    ],
    availableTools: ollamaTools.map(tool => tool.function.name),
    status: 'Active and ready to assist'
  };
  
  return {
    name: 'get_agent_info',
    result: JSON.stringify(agentInfo, null, 2)
  };
};
