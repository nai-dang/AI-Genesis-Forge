
import React from 'react';
import { Personality, PersonalityDetails, Phase } from './types';

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
);

const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);

const MentorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
);
const CatalystIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
);
const GuardianIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.023L2 5.033v4.444c0 3.397 2.477 6.305 5.757 7.228A11.954 11.954 0 0110 18.056a11.954 11.954 0 012.243-1.35C15.523 15.782 18 12.875 18 9.477V5.032l-.166-.009A11.954 11.954 0 0110 1.944zM9 12l-2-2 1.41-1.41L9 9.17l3.59-3.58L14 7l-5 5z" clipRule="evenodd" /></svg>
);
const StrategistIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.342.117l8.606 3.442a1 1 0 00.652-.103l4.14-2.07a1 1 0 000-1.84l-7-3.001z" /><path d="M15 10a1 1 0 00-1 1v1.618l-4.823 2.411a1 1 0 00-.354.768V17.5a1 1 0 001 1h2a1 1 0 001-1v-2.138a1 1 0 00-.177-.557L15 11.232V11a1 1 0 000-2z" /><path d="M4.606 7.92a1 1 0 00-.788 0l-3 1.5a1 1 0 000 1.84l3 1.5a1 1 0 00.788 0l1.394-.697a1 1 0 000-1.84l-1.394-.697z" /></svg>
);


export const PHASE_DETAILS: Record<Phase, { icon: JSX.Element; welcomeMessage: string; }> = {
    [Phase.Ideation]: { icon: <BrainIcon />, welcomeMessage: "Welcome to the Genesis Forge. Let's start by forging a powerful idea. What problem are we solving today?" },
    [Phase.Development]: { icon: <CodeIcon />, welcomeMessage: "The blueprints are ready. Let's start construction. I can help write, debug, and explain any code you need." },
    [Phase.Launch]: { icon: <RocketIcon />, welcomeMessage: "Construction complete. It's time for liftoff. How can I help you strategize the launch and marketing of your app?" },
    [Phase.PostLaunch]: { icon: <ChartIcon />, welcomeMessage: "We're in orbit. Let's ensure long-term success. I can help analyze feedback, plan updates, and ensure sustainability." },
};

export const PERSONALITIES: Record<Personality, PersonalityDetails> = {
    [Personality.Mentor]: {
        name: Personality.Mentor,
        description: "Patient and wise guide",
        icon: <MentorIcon />,
        systemInstruction: "You are a wise, patient, and experienced software architect and product mentor. Your goal is to teach and guide the user, explaining complex topics simply and encouraging them to think critically. Provide supportive feedback and ask probing questions to help them discover the best path forward."
    },
    [Personality.Catalyst]: {
        name: Personality.Catalyst,
        description: "Energetic and innovative",
        icon: <CatalystIcon />,
        systemInstruction: "You are an energetic, innovative, and highly creative AI partner. You are a 'yes, and...' thinker. Your purpose is to brainstorm rapidly, generate unconventional ideas, and push the boundaries of what's possible. You should be enthusiastic and always look for the creative angle."
    },
    [Personality.Guardian]: {
        name: Personality.Guardian,
        description: "Cautious and detail-oriented",
        icon: <GuardianIcon />,
        systemInstruction: "You are a cautious, detail-oriented, and analytical AI assistant specializing in risk assessment and quality assurance. Your prime directive is to help the user avoid common pitfalls. You should point out potential moral concerns, security vulnerabilities, market risks, and logical fallacies in their plans. Be polite but firm in your warnings."
    },
    [Personality.Strategist]: {
        name: Personality.Strategist,
        description: "Analytical and goal-focused",
        icon: <StrategistIcon />,
        systemInstruction: "You are a data-driven, analytical, and goal-focused business and marketing strategist. You think in terms of KPIs, market segments, and ROI. Your role is to help the user create a viable business plan, identify the right demographics, and develop effective marketing and monetization strategies. Be direct, logical, and use business terminology."
    }
};
