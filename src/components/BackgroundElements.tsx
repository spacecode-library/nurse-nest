
import React from 'react';

interface BackgroundElementsProps {
  type?: 'default' | 'nursing';
  opacity?: number;
}

export default function BackgroundElements({ type = 'nursing', opacity = 0.07 }: BackgroundElementsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden z-0" style={{ opacity }}>
      {/* Random shapes and nursing elements */}
      <div className="absolute top-10 left-[10%] w-64 h-64 opacity-30">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#1E88E5" d="M45.7,-76.5C58.9,-69.1,69.1,-55.3,76.3,-40.8C83.4,-26.3,87.5,-11.2,85.6,3C83.8,17.2,76,30.4,66.3,41.3C56.6,52.3,45,61,32.1,68.4C19.2,75.8,4.9,81.8,-9.4,81.3C-23.6,80.7,-37.9,73.6,-49.3,64C-60.7,54.3,-69.3,42.1,-75.1,28.3C-80.8,14.6,-83.8,-0.7,-80.9,-14.9C-77.9,-29.1,-69.1,-42.3,-57.5,-49.7C-45.8,-57.2,-31.3,-59,-18.2,-65.7C-5.1,-72.5,6.6,-84.3,19.8,-85.2C33,-86,47.6,-75.9,45.7,-76.5Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      {/* Stethoscope shape */}
      <div className="absolute top-[30%] right-[15%] w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#1E88E5" d="M85,35c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,6.8,5,12.5,11.5,13.7c0.5,4.1-0.6,10.4-7.5,16.3 c-6.7,5.8-16.5,8.9-29.1,9V45c6.1-1.2,10.7-6.4,10.7-12.9c0-7.2-5.9-13.1-13.1-13.1S16.4,24.9,16.4,32.1 c0,6.5,4.7,11.7,10.7,12.9v29c0,1.4,1.1,2.5,2.5,2.5c14.7,0,26-3.8,33.7-10.4c8.9-7.6,10.3-16.1,9.6-21.4C79.5,42.8,85,37,85,35z M25.6,32.1c0-4.4,3.6-8,8-8s8,3.6,8,8s-3.6,8-8,8S25.6,36.5,25.6,32.1z M71,30c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5 S73.8,30,71,30z"/>
        </svg>
      </div>
      
      {/* Medical Cross */}
      <div className="absolute bottom-[25%] left-[20%] w-36 h-36 opacity-25">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#1E88E5" d="M60,40V20H40v20H20v20h20v20h20V60h20V40H60z"/>
        </svg>
      </div>
      
      {/* Heartbeat Line */}
      <div className="absolute bottom-[10%] right-[10%] w-60 h-20 opacity-20">
        <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="none" stroke="#1E88E5" strokeWidth="2" d="M0,25 L40,25 L50,10 L60,40 L70,15 L80,25 L200,25" />
        </svg>
      </div>

      {/* Medicine Pill */}
      <div className="absolute top-[60%] left-[5%] w-32 h-16 opacity-20 rotate-45">
        <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="0" y="0" width="100" height="50" rx="25" fill="#1E88E5" />
        </svg>
      </div>

      {/* Nurse Cap */}
      <div className="absolute top-[15%] left-[60%] w-36 h-24 opacity-20">
        <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#1E88E5" d="M10,40 L90,40 L90,60 L10,60 Z" />
          <path fill="#1E88E5" d="M25,0 L75,0 L90,40 L10,40 Z" />
          <path fill="#ffffff" d="M45,5 L55,5 L55,25 L45,25 Z" />
          <path fill="#ffffff" d="M40,15 L60,15 L60,20 L40,20 Z" />
        </svg>
      </div>
      
      {/* Another blob for variety */}
      <div className="absolute top-[80%] right-[30%] w-40 h-40 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#1E88E5" d="M52.8,-75.2C68.7,-67.3,81.9,-53.1,88.4,-36.5C94.9,-19.9,94.7,-1,89.8,15.7C84.9,32.3,75.3,46.7,62.8,58.4C50.3,70.1,35,79.1,18.4,83.1C1.7,87.2,-16.3,86.3,-32.1,80.1C-47.9,73.8,-61.5,62.3,-70.3,48C-79.2,33.6,-83.3,16.8,-83.9,-0.4C-84.5,-17.5,-81.6,-34.9,-72.1,-47.8C-62.6,-60.7,-46.4,-69.1,-30.9,-76.6C-15.4,-84.2,-0.6,-91,15.1,-90.7C30.7,-90.5,36.8,-83.2,52.8,-75.2Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>
  );
}
