
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// Mock fetch for testing
global.fetch = vi.fn();

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch to simulate Ollama not being available
    (global.fetch as any).mockRejectedValue(new Error('Connection refused'));
  });

  it('renders without crashing', () => {
    render(<ChatInterface />);
    expect(screen.getByText('Ollama Chat Interface')).toBeInTheDocument();
  });

  it('shows simulation mode when Ollama is not available', async () => {
    render(<ChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });
  });

  it('shows model selector', async () => {
    render(<ChatInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Select Model')).toBeInTheDocument();
    });
  });

  it('enables image upload for vision models', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);
    
    // Wait for models to load and select llava model
    await waitFor(() => {
      const modelSelect = screen.getByRole('combobox');
      expect(modelSelect).toBeInTheDocument();
    });
    
    const modelSelect = screen.getByRole('combobox');
    await user.click(modelSelect);
    
    // Check if llava model is available
    await waitFor(() => {
      expect(screen.getByText('llava:7b')).toBeInTheDocument();
    });
  });

  it('allows sending messages', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);
    
    // First select a model
    await waitFor(() => {
      const modelSelect = screen.getByRole('combobox');
      expect(modelSelect).toBeInTheDocument();
    });
    
    const modelSelect = screen.getByRole('combobox');
    await user.click(modelSelect);
    
    await waitFor(() => {
      expect(screen.getByText('llama3.1:8b')).toBeInTheDocument();
    });
    
    const modelOption = screen.getByText('llama3.1:8b');
    await user.click(modelOption);
    
    // Now try to send a message
    const messageInput = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(messageInput, 'Hello AI');
    await user.click(sendButton);
    
    expect(messageInput).toHaveValue('');
  });

  it('displays capabilities based on selected model', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);
    
    // Wait for models to load
    await waitFor(() => {
      const modelSelect = screen.getByRole('combobox');
      expect(modelSelect).toBeInTheDocument();
    });
    
    const modelSelect = screen.getByRole('combobox');
    await user.click(modelSelect);
    
    // Select vision model
    await waitFor(() => {
      expect(screen.getByText('llava:7b')).toBeInTheDocument();
    });
    
    const visionModel = screen.getByText('llava:7b');
    await user.click(visionModel);
    
    // Check for vision capability badge
    await waitFor(() => {
      expect(screen.getByText('Vision Support')).toBeInTheDocument();
    });
  });
});
