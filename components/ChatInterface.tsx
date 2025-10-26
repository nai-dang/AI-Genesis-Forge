
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    stopAudio: () => void;
}

const LoadingIndicator = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">AI is forging a response...</span>
    </div>
);

const MicrophoneIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-cyan-400 hover:text-cyan-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 8v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const StopIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6" />
    </svg>
);


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, stopAudio }) => {
    const [inputText, setInputText] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const handleTranscript = (transcript: string) => {
        onSendMessage(transcript);
    };

    const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(handleTranscript);
    const { isPlaying, stop: stopPlayer } = useAudioPlayer();

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim() && !isLoading) {
            onSendMessage(inputText);
            setInputText('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    const handleStopAll = () => {
        stopAudio(); // From App.tsx -> useAudioPlayer
        stopListening();
    };

    return (
        <div className="flex flex-col h-full bg-gray-900/30">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center ring-2 ring-cyan-500/50 text-cyan-400 font-bold text-sm flex-shrink-0">AI</div>}
                        <div className={`max-w-xl p-4 rounded-2xl shadow-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                           <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-3 justify-start">
                         <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center ring-2 ring-cyan-500/50 text-cyan-400 font-bold text-sm flex-shrink-0">AI</div>
                         <div className="max-w-xl p-4 rounded-2xl shadow-lg bg-gray-800 text-gray-200 rounded-bl-none">
                            <LoadingIndicator />
                         </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>

            <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-cyan-500/20">
                <div className="relative bg-gray-800 border-2 border-gray-700 rounded-lg focus-within:border-cyan-500 transition-colors">
                    <textarea
                        value={isListening ? transcript : inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "Listening..." : "Tell me what's on your mind..."}
                        className="w-full bg-transparent p-4 pr-24 text-gray-200 placeholder-gray-500 focus:outline-none resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        {(isPlaying || isListening) && (
                            <button onClick={handleStopAll} className="p-2 rounded-full text-red-500 hover:bg-red-500/20">
                                <StopIcon />
                            </button>
                        )}
                        {hasRecognitionSupport && (
                             <button onClick={isListening ? stopListening : startListening} disabled={isLoading} className="p-2 rounded-full disabled:opacity-50">
                                <MicrophoneIcon isListening={isListening} />
                             </button>
                        )}
                        <button onClick={handleSend} disabled={isLoading || !inputText.trim()} className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
