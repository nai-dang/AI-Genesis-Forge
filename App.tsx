
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PhaseSelector from './components/PhaseSelector';
import ChatInterface from './components/ChatInterface';
import { Phase, Personality, Message, PersonalityDetails } from './types';
import { PERSONALITIES, PHASE_DETAILS } from './constants';
import { generateText } from './services/geminiService';
import { useAudioPlayer } from './hooks/useAudioPlayer';

const App: React.FC = () => {
    const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.Ideation);
    const [personality, setPersonality] = useState<Personality>(Personality.Mentor);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isPlaying, play: playAudio, stop: stopAudio } = useAudioPlayer();
    
    useEffect(() => {
        const welcomeMessage = PHASE_DETAILS[currentPhase].welcomeMessage;
        setMessages([{
            id: 'welcome-' + currentPhase,
            sender: 'ai',
            text: welcomeMessage,
        }]);
        playAudio(welcomeMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPhase, personality]);

    const handleSendMessage = useCallback(async (text: string) => {
        stopAudio();
        const userMessage: Message = { id: Date.now().toString(), sender: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const history = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        try {
            const aiResponseText = await generateText(text, history, currentPhase, personality);
            const aiMessage: Message = { id: Date.now().toString() + '-ai', sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
            playAudio(aiResponseText);
        } catch (error) {
            console.error("Error communicating with Gemini:", error);
            const errorMessage: Message = { id: Date.now().toString() + '-err', sender: 'ai', text: "I'm sorry, I encountered an error. Please check the console and try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, currentPhase, personality, playAudio, stopAudio]);


    const handlePhaseChange = (phase: Phase) => {
        if (phase !== currentPhase) {
            stopAudio();
            setCurrentPhase(phase);
        }
    };
    
    const currentPersonalityDetails: PersonalityDetails = useMemo(() => PERSONALITIES[personality], [personality]);

    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-100 flex flex-col font-sans overflow-hidden">
            <header className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-900/50 backdrop-blur-sm border-b border-cyan-500/20 shadow-lg">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mr-4 flex items-center justify-center shadow-cyan-500/50 shadow-md">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        AI Genesis Forge
                    </h1>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center bg-gray-800 p-2 rounded-lg border border-gray-700">
                    <span className="text-sm font-medium text-gray-400 mr-3">AI Personality:</span>
                    <div className="relative">
                        <select 
                            value={personality} 
                            onChange={(e) => setPersonality(e.target.value as Personality)}
                            className="appearance-none bg-gray-700 text-white pl-8 pr-4 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm">
                            {Object.values(Personality).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
                            {currentPersonalityDetails.icon}
                        </div>
                    </div>
                </div>
            </header>
            
            <PhaseSelector currentPhase={currentPhase} onPhaseChange={handlePhaseChange} />
            
            <main className="flex-1 overflow-hidden">
                <ChatInterface 
                    messages={messages} 
                    onSendMessage={handleSendMessage} 
                    isLoading={isLoading}
                    stopAudio={stopAudio}
                />
            </main>
        </div>
    );
};

export default App;
