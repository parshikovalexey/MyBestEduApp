import React, { useState, useRef, useCallback } from 'react';

// Types
interface VideoSession {
  userVideoBlob: Blob | null;
  videoUrl: string | null;
}

export const useVideoRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [session, setSession] = useState<VideoSession>({ userVideoBlob: null, videoUrl: null });

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true
      });

      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setSession({ userVideoBlob: blob, videoUrl: url });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    setSession({ userVideoBlob: null, videoUrl: null });
    if (session.videoUrl) URL.revokeObjectURL(session.videoUrl);
  }, [session.videoUrl]);

  return { ...session, startRecording, stopRecording, reset };
};
