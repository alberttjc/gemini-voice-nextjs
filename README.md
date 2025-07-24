# Gemini Voice Next.js

A modern, responsive web application for interacting with Google's Gemini Live API through real-time audio and video streaming. Built with Next.js and optimized for performance and natural voice conversations.

## Overview

Gemini Voice Next.js provides an intuitive interface for natural AI conversations using:
- **Voice conversations** with Gemini AI using natural speech
- **Visual interactions** through camera and screen sharing
- **Real-time communication** via WebSocket connections
- **Multi-modal AI experiences** combining text, audio, and video
- **Customizable AI personalities** with ready-to-use prompt templates

Perfect for developers, businesses, and anyone looking to create voice-enabled AI applications or explore the capabilities of Gemini's Live API.

## ✨ Features

### Core Functionality
- 🎤 **Natural Voice Chat** - Speak naturally with AI responses in real-time
- 📹 **Camera Integration** - Show objects, documents, or gestures for AI analysis
- 🖥️ **Screen Sharing** - Share your screen for technical support or demonstrations
- 💬 **Text Chat** - Traditional text-based communication when needed
- 🔌 **Live WebSocket Connection** - Real-time, low-latency communication

### AI Customization
- 🎭 **Ready-to-Use Prompts** - Pre-built AI personalities (medical receptionist, assistant, etc.)
- ⚙️ **Custom Instructions** - Define your own AI behavior and personality
- 🔄 **Dynamic Switching** - Change AI roles during conversations
- 📝 **Prompt Templates** - Easy-to-customize starting points

### User Experience
- 🚀 **Fast Response Times** - Optimized for quick, natural conversations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎛️ **Intuitive Controls** - Simple interface that stays out of your way
- 📊 **Clear Status Indicators** - Always know your connection and recording status
- 🔧 **Easy Configuration** - Set up once, use immediately

### Technical Features
- ⚡ **Performance Optimized** - Fast loading and smooth interactions
- 🛡️ **Secure** - Proper handling of API keys and user privacy
- 🔄 **Auto-reconnect** - Maintains connection through network hiccups
- 📝 **Session Management** - Track conversations and debug issues
- 🎨 **Modern UI** - Clean, accessible interface built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Google AI API key** ([Get yours here](https://makersuite.google.com/app/apikey))
- **Modern web browser** with microphone access

### Installation

1. **Clone and install:**
   ```bash
   git clone https://github.com/alberttjc/gemini-voice-nextjs.git
   cd gemini-voice-nextjs
   npm install
   ```

2. **Configure your API key:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Google AI API key:
   # NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_api_key_here
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Open and start chatting:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Enter your API key in the console panel
   - Click "Connect" and start talking!

## 🎭 AI Personalities & Prompts

The `prompts/` folder contains ready-to-use AI personality templates:

### Available Prompts
- **`receptionist.md`** - Professional medical receptionist for appointment scheduling
- *(More prompts can be added for different use cases)*

### Using Prompts

1. **Browse prompts** in the `prompts/` folder
2. **Copy the content** from any `.md` file
3. **Paste into "System Instructions"** in the console panel
4. **Connect and enjoy** your customized AI assistant!

### Creating Custom Prompts

Create your own AI personalities:

```markdown
# Example: Personal Assistant Prompt
You are a helpful personal assistant named Alex. You are:
- Friendly and professional
- Great at organizing and planning
- Knowledgeable about productivity tips

Always greet users warmly and ask how you can help with their day.
Keep responses concise but helpful.
```

Save as `prompts/your-prompt-name.md` and use in the application.

## 📱 How to Use

### Voice Conversations
1. **Connect** to Gemini by clicking the "Connect" button
2. **Start speaking** - microphone activates automatically when connected
3. **Have natural conversations** - no need to press buttons or wait for prompts
4. **AI responds with voice** - natural back-and-forth conversation

### Visual Interactions
1. **Enable camera** by clicking the camera icon
2. **Show objects, documents, or gestures** to the camera
3. **AI can see and respond** to visual content in real-time
4. **Great for**: Getting help with documents, showing objects, visual demonstrations

### Screen Sharing
1. **Click the monitor icon** to start screen sharing
2. **AI can see your screen** and provide assistance
3. **Perfect for**: Technical support, code reviews, software tutorials
4. **End sharing** by clicking the icon again

### Text Chat Backup
- **Type messages** in the input field at the bottom
- **Useful when voice isn't available** or for precise questions
- **Works alongside voice and video** for mixed interactions

## 🏗️ Project Structure

```
📦 gemini-voice-nextjs/
├── 📁 app/                    # Next.js application pages
├── 📁 components/             # React UI components
│   ├── interface/             # Performance-optimized components
│   └── ui/                    # Reusable UI library
├── 📁 contexts/               # React state management
├── 📁 hooks/                  # Custom React hooks
├── 📁 lib/                    # Core functionality libraries
├── 📁 prompts/                # 🎭 AI personality templates
│   └── receptionist.md        # Medical receptionist 
```

## ⚙️ Configuration

### Environment Setup

Create `.env.local`:
```env
# Required: Your Google AI API key
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_api_key_here

# Optional: Development settings
NODE_ENV=development
```

### Application Settings

Configure through the console panel:
- **🤖 Model Selection** - Choose Gemini model version
- **🎵 Audio Mode** - Enable/disable voice features  
- **📝 System Instructions** - Set AI personality (use prompts from `prompts/` folder)
- **🔄 Auto-reconnect** - Automatic reconnection on network issues

## 🎯 Use Cases

### Personal Assistant
- Daily planning and organization
- Information lookup and research
- Creative brainstorming sessions
- Learning and tutoring conversations

### Business Applications
- **Customer service** with receptionist prompts
- **Technical support** with screen sharing
- **Training simulations** with role-playing scenarios
- **Accessibility tools** for voice-controlled interfaces

### Development & Research
- **API testing** and integration development
- **Voice interface prototyping** 
- **AI behavior research** and experimentation
- **Multi-modal interaction studies**

### Education
- **Language learning** with conversation practice
- **Interactive tutoring** with visual aids
- **Presentation assistance** with screen sharing
- **Accessibility support** for different learning needs

## 🔧 Development

### Available Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build optimized production version
npm run start        # Start production server

# Code Quality  
npm run lint         # Check code style and potential issues
npm run typecheck    # Validate TypeScript types

# Performance & Analysis
npm run analyze      # Analyze bundle size and composition
npm run perf:check   # Quick performance health check
```

### Required Permissions

When first using the app, your browser will request:
- **🎤 Microphone access** - Required for voice conversations
- **📹 Camera access** - Optional, for visual interactions
- **🖥️ Screen sharing** - Optional, for screen-based assistance

All permissions can be granted or denied based on your needs.

## 🎭 Customizing AI Behavior

### Using Existing Prompts

1. **Browse the `prompts/` folder** for available templates
2. **Open any `.md` file** to see the prompt content
3. **Copy the prompt text**
4. **Paste into "System Instructions"** in the app's console panel
5. **Click "Connect"** to start using your customized AI

### Creating Your Own Prompts

**Template Structure:**
```markdown
# Your AI Role Description
You are a [role] who [key characteristics].

PERSONALITY:
- [Trait 1]
- [Trait 2]
- [Trait 3]

BEHAVIOR:
- [How to respond]
- [Communication style]
- [Specific instructions]

LIMITATIONS:
- [What not to do]
- [When to defer or redirect]
```

**Save your prompt** as `prompts/your-prompt-name.md` for easy reuse.

