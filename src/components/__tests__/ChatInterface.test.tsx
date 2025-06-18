
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import ChatInterface from '../ChatInterface';
import { mockModels } from '../../utils/ollamaSimulator';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

describe('ChatInterface', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chat interface', () => {
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Ollama Chat Interface')).toBeInTheDocument();
    expect(screen.getByText('Select Model')).toBeInTheDocument();
  });

  it('shows disconnected state when Ollama is not available', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });
  });

  it('loads and displays mock models when Ollama is not available', async () => {
    // First call fails (connection check)
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });

    // Open model selector
    const modelSelect = screen.getByRole('combobox');
    fireEvent.click(modelSelect);

    // Check if mock models are displayed
    await waitFor(() => {
      expect(screen.getByText('llama3.1:8b')).toBeInTheDocument();
      expect(screen.getByText('llava:7b')).toBeInTheDocument();
      expect(screen.getByText('codellama:13b')).toBeInTheDocument();
      expect(screen.getByText('mistral:7b')).toBeInTheDocument();
    });
  });

  it('detects vision capabilities for llava model', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });

    // Select llava model
    const modelSelect = screen.getByRole('combobox');
    fireEvent.click(modelSelect);
    
    const llavaOption = await screen.findByText('llava:7b');
    fireEvent.click(llavaOption);

    // Check if vision support badge appears
    await waitFor(() => {
      expect(screen.getByText('Vision Support')).toBeInTheDocument();
    });

    // Check if image upload button is present
    expect(screen.getByRole('button', { name: /image/i })).toBeInTheDocument();
  });

  it('detects tool capabilities for codellama model', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });

    // Select codellama model
    const modelSelect = screen.getByRole('combobox');
    fireEvent.click(modelSelect);
    
    const codelamaOption = await screen.findByText('codellama:13b');
    fireEvent.click(codelamaOption);

    // Check if tool usage badge appears
    await waitFor(() => {
      expect(screen.getByText('Tool Usage')).toBeInTheDocument();
    });

    // Check if tools toggle is present
    expect(screen.getByText('Enable Tools')).toBeInTheDocument();
  });

  it('sends a message and receives simulated response', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });

    // Select a model
    const modelSelect = screen.getByRole('combobox');
    fireEvent.click(modelSelect);
    const modelOption = await screen.findByText('llama3.1:8b');
    fireEvent.click(modelOption);

    // Type a message
    const messageInput = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(messageInput, { target: { value: 'Hello, how are you?' } });

    // Send the message
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    // Check if user message appears
    await waitFor(() => {
      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    });

    // Check if simulated response appears
    await waitFor(() => {
      const responseElements = screen.getAllByText(/llama3.1:8b/);
      expect(responseElements.length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  it('handles image upload for vision models', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });

    // Select llava model
    const modelSelect = screen.getByRole('combobox');
    fireEvent.click(modelSelect);
    const llavaOption = await screen.findByText('llava:7b');
    fireEvent.click(llavaOption);

    // Create a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    // Find the hidden file input
    const fileInput = screen.getByRole('button', { name: /image/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      result: 'data:image/png;base64,test',
      onload: null as any,
    };
    
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    // Simulate FileReader onload
    mockFileReader.onload?.({ target: mockFileReader } as any);
    
    // The image should be selected (this would be visible in the UI)
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
  });

  it('toggles streaming mode', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });

    // Select a model first
    const modelSelect = screen.getByRole('combobox');
    fireEvent.click(modelSelect);
    const modelOption = await screen.findByText('llama3.1:8b');
    fireEvent.click(modelOption);

    // Find and toggle streaming switch
    const streamingSwitch = screen.getByRole('switch', { name: /streaming/i });
    expect(streamingSwitch).toBeChecked(); // Should be enabled by default
    
    fireEvent.click(streamingSwitch);
    expect(streamingSwitch).not.toBeChecked();
  });

  it('clears chat when switching models', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(<ChatInterface />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
    });

    // Select first model and send a message
    const modelSelect = screen.getByRole('combobox');
    fireEvent.click(modelSelect);
    let modelOption = await screen.findByText('llama3.1:8b');
    fireEvent.click(modelOption);

    const messageInput = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    // Switch to another model
    fireEvent.click(modelSelect);
    modelOption = await screen.findByText('mistral:7b');
    fireEvent.click(modelOption);

    // The previous message should be cleared
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
});
