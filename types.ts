// Fix: Import React to provide the JSX namespace for the JSX.Element type.
import React from 'react';

export enum Phase {
  Ideation = 'Ideation & Planning',
  Development = 'Development & Debugging',
  Launch = 'Launch & Marketing',
  PostLaunch = 'Post-Launch & Sustainability',
}

export enum Personality {
  Mentor = 'Mentor',
  Catalyst = 'Catalyst',
  Guardian = 'Guardian',
  Strategist = 'Strategist',
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isCode?: boolean;
}

export interface PersonalityDetails {
  name: Personality;
  description: string;
  systemInstruction: string;
  icon: JSX.Element;
}