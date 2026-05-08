import React, { useState } from 'react';
import { useVideoRecorder } from './hooks/useVideoRecorder';

// Mock API function (would be a real fetch call)
const generateShortVideo = async (blob: Blob, templateId: string): Promise<string> => {
  console.log(`Uploading video for template ${templateId}...`);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network
  // In reality: Upload blob -> POST /api/generate -> return resultUrl
  return `https://example.com/shorts/${templateId}-${Date.now()}.mp4`;
};

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'recording' | 'review' | 'generated'>('welcome');
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const { userVideoBlob, videoUrl, startRecording, stopRecording, reset } = useVideoRecorder();

  const handleStart = () => {
    setStep('recording');
    startRecording();
  };

  const handleStop = () => {
    stopRecording();
    setStep('review');
  };

  const handleRetake = () => {
    reset();
    setStep('recording');
    startRecording();
  };

  const handleConfirm = () => {
    // Simulate scanning a QR code after confirmation
    // In real app: QR code redirects to /scan/:templateId
    setCurrentTemplate('pharaoh-gold-01');
    if (userVideoBlob) {
      generateShortVideo(userVideoBlob, 'pharaoh-gold-01').then(url => {
        setResultUrl(url);
        setStep('generated');
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          MenaMuseum Shorts
        </h1>
      </div>

      {/* Steps */}
      {step === 'welcome' && (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto flex items-center justify-center">
            <span className="text-4xl">🏛️</span>
          </div>
          <h2 className="text-2xl font-semibold">Создай свой музейный шортс</h2>
          <p className="text-gray-400">Запиши видео, пройди квест и получи уникальный ролик для Instagram.</p>
          <button
            onClick={handleStart}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-full transition-transform active:scale-95"
          >
            Начать запись
          </button>
        </div>
      )}

      {step === 'recording' && (
        <div className="w-full max-w-sm aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden relative border-2 border-amber-500">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <span className="text-6xl animate-pulse">🔴</span>
              <p className="mt-4 text-lg">Запись...</p>
            </div>
          </div>
          <button
            onClick={handleStop}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-500 rounded-full border-4 border-white flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </button>
        </div>
      )}

      {step === 'review' && videoUrl && (
        <div className="w-full max-w-sm space-y-4">
          <video src={videoUrl} controls className="w-full rounded-xl" />
          <div className="flex gap-4">
            <button onClick={handleRetake} className="flex-1 py-3 border border-gray-600 rounded-full">Перезаписать</button>
            <button onClick={handleConfirm} className="flex-1 py-3 bg-green-600 rounded-full font-bold">Использовать</button>
          </div>
        </div>
      )}

      {step === 'generated' && resultUrl && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Готово! ✨</h2>
          <div className="bg-gray-800 p-6 rounded-xl">
            <p className="text-sm text-gray-400 mb-2">Ваш шортс создан:</p>
            <p className="font-mono text-amber-400 break-all text-xs">{resultUrl}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-full">
              Скачать в Галерею
            </button>
            <button className="border border-white py-3 rounded-full">
              Поделиться в Instagram
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
