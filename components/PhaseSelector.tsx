
import React from 'react';
import { Phase } from '../types';
import { PHASE_DETAILS } from '../constants';

interface PhaseSelectorProps {
  currentPhase: Phase;
  onPhaseChange: (phase: Phase) => void;
}

const PhaseSelector: React.FC<PhaseSelectorProps> = ({ currentPhase, onPhaseChange }) => {
  const phases = Object.values(Phase);

  return (
    <nav className="p-4 bg-gray-900/50 backdrop-blur-sm border-b border-cyan-500/20">
      <div className="flex justify-center items-center space-x-2 sm:space-x-4">
        {phases.map((phase, index) => {
          const isActive = phase === currentPhase;
          const isCompleted = phases.indexOf(currentPhase) > index;

          return (
            <React.Fragment key={phase}>
              <button
                onClick={() => onPhaseChange(phase)}
                className="flex flex-col sm:flex-row items-center space-x-2 group focus:outline-none"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300
                    ${isActive ? 'bg-cyan-500 border-cyan-300 animate-pulse' : ''}
                    ${isCompleted ? 'bg-green-500 border-green-300' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-700 border-gray-600 group-hover:border-cyan-500' : ''}
                  `}
                >
                  {PHASE_DETAILS[phase].icon}
                </div>
                <span
                  className={`hidden lg:block text-sm font-medium transition-colors duration-300
                  ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`}
                >
                  {phase.split(' ')[0]}
                </span>
              </button>
              {index < phases.length - 1 && (
                <div className={`flex-1 h-1 rounded
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default PhaseSelector;
