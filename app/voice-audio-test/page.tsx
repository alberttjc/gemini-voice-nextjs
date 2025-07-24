import VoiceAudioTestComponent from './VoiceAudioTestComponent';

export default function VoiceAudioTestPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">API Key Missing</h1>
        <p className="text-gray-600">Please set NEXT_PUBLIC_GOOGLE_AI_API_KEY in your .env file</p>
      </div>
    );
  }

  return <VoiceAudioTestComponent apiKey={apiKey} />;
}
