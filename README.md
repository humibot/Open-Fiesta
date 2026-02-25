# Open-Fiesta

Open-Fiesta is an open-source, multi-model AI chat playground built with Next.js. It allows users to switch between providers and models, compare outputs side-by-side, and utilize optional web search and image attachments.

## Features

- **Multiple AI Providers**: Gemini, OpenRouter (DeepSeek R1, Llama 3.3, Qwen, Mistral, Moonshot, Reka, Sarvam, etc.)
- **Selectable Model Catalog**: Run up to 5 models simultaneously
- **Web Search**: Toggle per message
- **Image Attachments**: Supported with Gemini
- **Conversation Sharing**: Share conversations with links
- **Clean UI**: Streaming-friendly API normalization
- **Tech Stack**: Next.js 14 with TypeScript and Tailwind CSS
- **API Integration**: API routes for provider calls
- **Docker Support**: Containerization for development and production workflows

## Setup and Installation

### Prerequisites

- Node.js
- npm

### Installing Dependencies

```sh
npm install
```

### Environment Configuration

1. Copy the example environment setup:

   ```sh
   cp env.example .env
   ```

2. Update the `.env` file with your API keys and configuration settings:

   - `OPENROUTER_API_KEY` for OpenRouter models
   - `GEMINI_API_KEY` for Gemini models
   - Supabase configuration for authentication and chat persistence

### Running the Development Server

```sh
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Model Selection**: Choose your preferred AI models in the app.
- **Chat Interface**: Use the chat UI to interact and switch between models.
- **Sharing**: Easily share your session and outputs with others via generated links.

## Contribution Guidelines

We welcome contributions for bug fixes, new features, and documentation improvements.

### Steps to Contribute

1. Fork the repository and clone your fork.
2. Create a feature branch from `main`: `feat/` or `fix/`.
3. Run linters and build:

   ```sh
   npm run lint
   npm run build
   ```

4. Open a pull request to `main` with a clear description, testing notes, and checklist.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
