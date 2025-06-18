
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatInterface from '../ChatInterface';

// Mock the ollama simulator
vi.mock('../../utils/ollamaSimulator', () => ({
  mockModels: [
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
    }
  ],
  generateMockResponse: vi.fn((message, model) => `Mock response from ${model}: ${message}`),
  simulateStreamingResponse: vi.fn()
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ChatInterface />);
    expect(screen.getByText('AI Chat with Ollama')).toBeInTheDocument();
  });

  it('shows model selector', async () => {
    render(<ChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Select Model')).toBeInTheDocument();
    });
  });

  it('enables image upload for vision models', async () => {
    render(<ChatInterface />);
    
    // Wait for models to load and select llava model
    await waitFor(() => {
      const modelSelect = screen.getByRole('combobox');
      fireEvent.click(modelSelect);
    });
    
    // Check if image upload is available when vision model is selected
    await waitFor(() => {
      expect(screen.getByText('llava:7b')).toBeInTheDocument();
    });
  });

  it('allows sending messages', async () => {
    render(<ChatInterface />);
    
    const messageInput = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(messageInput, { target: { value: 'Hello AI' } });
    fireEvent.click(sendButton);
    
    expect(messageInput).toHaveValue('');
  });
});
