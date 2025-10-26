
import { useState, useCallback, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';

// Base64 decoding function
function decode(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Raw PCM audio data decoding function
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const useAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);

    const play = useCallback(async (text: string) => {
        if (isPlaying) {
            stop();
        }
        setIsPlaying(true);
        try {
            const base64Audio = await generateSpeech(text);
            
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                 audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioContext,
                24000,
                1
            );
            
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.onended = () => {
                setIsPlaying(false);
                sourceRef.current = null;
            };
            source.start();
            sourceRef.current = source;
        } catch (error) {
            console.error("Failed to play audio:", error);
            setIsPlaying(false);
        }
    }, [isPlaying]);

    const stop = useCallback(() => {
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state === 'running') {
            audioContextRef.current.suspend();
        }
        setIsPlaying(false);
    }, []);

    return { isPlaying, play, stop };
};
