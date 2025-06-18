
# Ollama AI Chat Interface

A modern, responsive AI chat interface for local Ollama models with dynamic capability detection and intelligent feature adaptation.

## 🚀 Features

- **Dynamic Model Detection**: Automatically detects available Ollama models and their capabilities
- **Vision Support**: Enables image upload for vision-capable models (like LLaVA)
- **Tool Integration**: Shows tool options for models that support function calling
- **Streaming Responses**: Real-time streaming chat responses
- **Simulation Mode**: Falls back to mock responses when Ollama is not available (perfect for testing)
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Comprehensive Testing**: Full test suite with Vitest and React Testing Library

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: @tanstack/react-query
- **Testing**: Vitest, React Testing Library, jsdom
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- [Ollama](https://ollama.ai/) installed locally (optional - app works in simulation mode without it)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ollama-chat-interface
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

Run the test suite:

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## 🔧 Configuration

### With Ollama

Make sure Ollama is running on your local machine:

```bash
ollama serve
```

The app will automatically detect your available models and their capabilities.

### Without Ollama (Simulation Mode)

The app automatically falls back to simulation mode when Ollama is not detected. This includes:

- Mock models with different capabilities (vision, tools)
- Simulated streaming responses
- All UI features remain functional for testing

## 🎯 Model Capabilities

The interface automatically adapts based on model capabilities:

- **Vision Models** (e.g., LLaVA): Shows image upload button
- **Tool-capable Models**: Displays tools configuration options
- **Standard Models**: Basic chat interface

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx      # Main chat component
│   ├── ui/                    # shadcn/ui components
│   └── __tests__/            # Component tests
├── utils/
│   └── ollamaSimulator.ts    # Mock data and simulation logic
├── pages/
│   ├── Index.tsx             # Home page
│   └── NotFound.tsx          # 404 page
└── hooks/                    # Custom React hooks
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🔮 Roadmap

- [ ] Support for more Ollama model families
- [ ] Custom model configuration
- [ ] Chat history persistence
- [ ] Export chat conversations
- [ ] Plugin system for custom tools
- [ ] Multi-language support

## ⭐ Acknowledgments

- [Ollama](https://ollama.ai/) for the amazing local AI model runtime
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Vite](https://vitejs.dev/) for blazing fast development

---

Made with ❤️ for the local AI community
