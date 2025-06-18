
export interface MockModel {
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

export const mockModels: MockModel[] = [
  {
    name: 'llama3.1:8b',
    size: 4661224676,
    digest: 'sha256:42182419e950',
    modified_at: '2024-01-15T10:30:00Z',
    details: {
      family: 'llama',
      format: 'gguf',
      parameter_size: '8B'
    }
  },
  {
    name: 'llava:7b',
    size: 4109793677,
    digest: 'sha256:8dd30f6b0cb1',
    modified_at: '2024-01-14T15:45:00Z',
    details: {
      family: 'llava',
      format: 'gguf',
      parameter_size: '7B'
    }
  },
  {
    name: 'codellama:13b',
    size: 7365960935,
    digest: 'sha256:9f438cb9cd581040003681',
    modified_at: '2024-01-13T09:20:00Z',
    details: {
      family: 'llama',
      format: 'gguf',
      parameter_size: '13B'
    }
  },
  {
    name: 'mistral:7b',
    size: 4109793677,
    digest: 'sha256:61e88e884507',
    modified_at: '2024-01-12T14:10:00Z',
    details: {
      family: 'mistral',
      format: 'gguf',
      parameter_size: '7B'
    }
  }
];

export const generateMockResponse = (message: string, model: string): string => {
  const responses = [
    `Hello! I'm ${model}, and I'm here to help you with your question: "${message}". How can I assist you further?`,
    `That's an interesting question about "${message}". As ${model}, I can provide insights on this topic.`,
    `Thank you for your message: "${message}". I'm ${model} and I'm ready to help you explore this topic in detail.`,
    `I understand you're asking about "${message}". Let me share some thoughts on this as ${model}.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const simulateStreamingResponse = async (
  message: string,
  model: string,
  onChunk: (chunk: string) => void,
  delay: number = 50
) => {
  const response = generateMockResponse(message, model);
  const words = response.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, delay));
    onChunk(words[i] + (i < words.length - 1 ? ' ' : ''));
  }
};
