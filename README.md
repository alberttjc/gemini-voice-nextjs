# Live API Web Console - Next.js Clone

A Next.js-based recreation of the Google Gemini Live API Web Console for real-time audio/video streaming and WebSocket communication.

## Features

- **WebSocket Connection Management**: Connect and disconnect from Live API endpoints
- **Audio Recording**: Capture microphone input and stream to the server
- **Video Capture**: Enable camera feed and screen sharing capabilities  
- **Real-time Logging**: Unified console view for all application events
- **Message Sending**: Send text messages through the WebSocket connection
- **Media Playback**: Audio playback controls for server responses

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser with WebRTC support

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd live-api-web-console-nextjs
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your WebSocket endpoint in the environment file:
\`\`\`
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-endpoint
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Connect**: Click the "Connect" button to establish a WebSocket connection
2. **Record Audio**: Enable microphone recording to stream audio data
3. **Enable Camera**: Turn on camera feed for video capture
4. **Screen Share**: Share your screen for presentation or debugging
5. **Send Messages**: Use the text input to send messages through the connection
6. **Monitor Logs**: View all application events in the console panel

## Architecture

- **Frontend**: Next.js 14 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **WebSocket**: Native WebSocket API for real-time communication
- **Media APIs**: WebRTC getUserMedia and getDisplayMedia for audio/video capture
- **State Management**: React hooks for component state

## API Endpoints

- \`GET /api/websocket\` - WebSocket upgrade endpoint
- \`POST /api/websocket\` - HTTP fallback for data processing

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
