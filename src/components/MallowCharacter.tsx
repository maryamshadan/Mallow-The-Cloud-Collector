import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../utils/soundFx';
import { MallowMood } from '../types';

interface MallowCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  mood?: MallowMood;
  interactive?: boolean;
  className?: string;
}

export const MallowCharacter: React.FC<MallowCharacterProps> = ({
  size = 'md',
  mood: initialMood = 'happy',
  interactive = true,
  className = '',
}) => {
  const [currentMood, setCurrentMood] = useState(initialMood);
  const [isBlinking, setIsBlinking] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isSquashing, setIsSquashing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Pupil offsets for eye tracking
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointerTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });

  // Synchronize initialMood
  useEffect(() => {
    setCurrentMood(initialMood);
  }, [initialMood]);

  // Natural spontaneous blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4200 + Math.random() * 3200);

    return () => clearInterval(blinkInterval);
  }, []);

  // Eye tracking logic
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      lastPointerTimeRef.current = Date.now();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mallowCenterX = rect.left + rect.width / 2;
      const mallowCenterY = rect.top + rect.height * 0.45; // eye height roughly 45%

      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

      const dx = clientX - mallowCenterX;
      const dy = clientY - mallowCenterY;
      const distance = Math.hypot(dx, dy);

      if (distance === 0) {
        targetOffsetRef.current = { x: 0, y: 0 };
        return;
      }

      // Smooth radial clamp inside eye socket
      const maxDistanceX = 5.2;
      const maxDistanceY = 6.0;

      const angle = Math.atan2(dy, dx);
      // Gentle distance falloff
      const normalizedDist = Math.min(1, distance / 260);

      targetOffsetRef.current = {
        x: Math.cos(angle) * maxDistanceX * normalizedDist,
        y: Math.sin(angle) * maxDistanceY * normalizedDist,
      };
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Butter-smooth animation frame loop
    const animateEyes = () => {
      const now = Date.now();
      const timeSincePointer = now - lastPointerTimeRef.current;

      // If idle for more than 3 seconds, smooth gentle wandering glance
      if (timeSincePointer > 3000) {
        const t = now * 0.001;
        targetOffsetRef.current = {
          x: Math.sin(t) * 2.5,
          y: Math.cos(t * 0.8) * 2.0 - 0.8, // glancing up at the stars
        };
      }

      // Smooth exponential damping (0.095 factor for silky glide)
      currentOffsetRef.current.x += (targetOffsetRef.current.x - currentOffsetRef.current.x) * 0.095;
      currentOffsetRef.current.y += (targetOffsetRef.current.y - currentOffsetRef.current.y) * 0.095;

      setPupilOffset({
        x: Number(currentOffsetRef.current.x.toFixed(3)),
        y: Number(currentOffsetRef.current.y.toFixed(3)),
      });

      rafRef.current = requestAnimationFrame(animateEyes);
    };

    rafRef.current = requestAnimationFrame(animateEyes);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const quotes = [
    "Puff puff! ☁️",
    "Soft dreams ahead! ✨",
    "You're so gentle! 🌸",
    "Collecting starry wishes! ⭐",
    "Warm cloud hugs for you! 💕",
    "Listen... the sky is whispering! 🌙",
    "Every dream deserves a soft landing! 🪶",
  ];

  const handleClick = () => {
    if (!interactive) return;

    soundFx.playPuff();

    setIsSquashing(true);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeechBubble(randomQuote);

    // Alternate mood briefly
    const moods: ('happy' | 'giggling' | 'dreamy')[] = ['happy', 'giggling', 'dreamy'];
    setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);

    setTimeout(() => setIsSquashing(false), 450);
    setTimeout(() => setSpeechBubble(null), 3000);
  };

  const sizeMap = {
    sm: 'w-24 h-20',
    md: 'w-44 h-36',
    lg: 'w-64 h-52',
    hero: 'w-72 h-60 sm:w-88 sm:h-72',
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label="Mallow the baby cloud character"
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          handleClick();
        }
      }}
    >
      {/* Interactive Speech Bubble */}
      {speechBubble && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-2xl bg-white/95 text-slate-700 text-xs sm:text-sm font-semibold shadow-lg border border-purple-200/80 whitespace-nowrap animate-bounce pointer-events-none">
          {speechBubble}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 rotate-45 border-r border-b border-purple-200/80" />
        </div>
      )}

      {/* Floating Star Accessory above Mallow */}
      <div className="absolute -top-4 sm:-top-6 right-6 sm:right-10 z-20 animate-float-bob">
        <svg
          viewBox="0 0 40 40"
          className="w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-[0_0_9px_rgba(253,224,71,0.9)] transition-transform duration-300 hover:rotate-12 hover:scale-110"
        >
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <path
            d="M20 2 L24.5 13.5 L36.5 15 L28 23.5 L30 35.5 L20 30 L10 35.5 L12 23.5 L3.5 15 L15.5 13.5 Z"
            fill="url(#starGrad)"
            stroke="#FEF9C3"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Star twinkle sparkle */}
          <circle cx="20" cy="20" r="2.5" fill="#FFFFFF" opacity="0.9" />
          <path
            d="M20 16 L20 24 M16 20 L24 20"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Mallow Cloud Creature SVG with Squash-and-Stretch physics */}
      <div
        className={`${sizeMap[size]} transition-all duration-300 ${
          isSquashing
            ? 'scale-x-112 scale-y-88'
            : isHovered
            ? 'scale-104 -translate-y-1'
            : 'hover:scale-102'
        } ${interactive ? 'cursor-pointer' : ''}`}
        style={{
          transformOrigin: 'bottom center',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg
          viewBox="0 0 320 240"
          className="w-full h-full filter drop-shadow-[0_14px_28px_rgba(147,197,253,0.38)]"
        >
          <defs>
            {/* Fluffy body cloud gradient */}
            <linearGradient id="cloudBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            {/* Blush cheeks gradient with rich vibrant pink glow */}
            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor="#FF5FA2"
                stopOpacity={isHovered || isSquashing ? 0.98 : 0.88}
              />
              <stop offset="55%" stopColor="#FB7185" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#FDA4AF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
            </radialGradient>

            {/* Gentle highlight sheen */}
            <linearGradient id="cloudHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Cloud Body Shape (Cumulus Bumps) */}
          <g className="transition-all duration-300">
            {/* Base cloud structure */}
            <path
              d="M 80 180 
                 C 45 180, 25 155, 35 125 
                 C 25 90, 60 65, 95 75 
                 C 115 40, 165 35, 195 65 
                 C 230 45, 275 70, 275 105 
                 C 295 130, 285 170, 250 180 
                 C 235 200, 195 205, 165 190 
                 C 140 205, 100 200, 80 180 Z"
              fill="url(#cloudBodyGrad)"
              stroke="#E2E8F0"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Top highlight puff */}
            <path
              d="M 100 78 C 120 52, 160 48, 188 70 C 160 62, 120 66, 100 78 Z"
              fill="url(#cloudHighlight)"
            />

            {/* Left little marshmallow hand */}
            <ellipse
              cx="65"
              cy="150"
              rx="15"
              ry="11"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
              transform="rotate(-15 65 150)"
              className={isSquashing ? 'animate-bounce' : ''}
            />

            {/* Right little marshmallow hand waving */}
            <ellipse
              cx="255"
              cy="145"
              rx="15"
              ry="11"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
              transform="rotate(25 255 145)"
              className="animate-pulse"
            />
          </g>

          {/* Blush Cheeks with gentle pulsating glow */}
          <ellipse
            cx="105"
            cy="138"
            rx={isHovered ? 21 : 19}
            ry={isHovered ? 14 : 12}
            fill="url(#blushGrad)"
            className="transition-all duration-300"
          />
          <ellipse
            cx="215"
            cy="138"
            rx={isHovered ? 21 : 19}
            ry={isHovered ? 14 : 12}
            fill="url(#blushGrad)"
            className="transition-all duration-300"
          />

          {/* Eyes Group with Functional Mouse Eye-Tracking */}
          <g id="mallow-eyes">
            {isBlinking || currentMood === 'sleepy' || currentMood === 'content' || currentMood === 'comforting' ? (
              // Curved sleeping/content happy eyes ^_^
              <g stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none">
                <path d="M 115 125 Q 128 112 141 125" />
                <path d="M 179 125 Q 192 112 205 125" />
              </g>
            ) : currentMood === 'laughing' || currentMood === 'giggling' ? (
              // Joyful squinting happy laughing eyes ( ˆ ‿ ˆ )
              <g stroke="#1E293B" strokeWidth="4.2" strokeLinecap="round" fill="none">
                <path d="M 115 126 Q 128 110 141 126" />
                <path d="M 179 126 Q 192 110 205 126" />
              </g>
            ) : currentMood === 'winking' ? (
              // Playful cute wink! Left eye wide, right eye winking shut (^_-)
              <>
                <ellipse cx="128" cy="122" rx="12" ry="15" fill="#1E293B" />
                <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}>
                  <circle cx="124" cy="116" r="4.6" fill="#FFFFFF" />
                  <circle cx="132" cy="126" r="2.3" fill="#FFFFFF" />
                  <circle cx="127" cy="124" r="1.4" fill="#67E8F9" opacity="0.8" />
                </g>
                <path d="M 179 126 Q 192 112 205 126" stroke="#1E293B" strokeWidth="4.2" strokeLinecap="round" fill="none" />
              </>
            ) : currentMood === 'dreamy' ? (
              // Dreamy stars eyes
              <g fill="#4338CA">
                <path d="M 128 116 L 131 124 L 139 124 L 132 129 L 135 137 L 128 132 L 121 137 L 124 129 L 117 124 L 125 124 Z" />
                <path d="M 192 116 L 195 124 L 203 124 L 196 129 L 199 137 L 192 132 L 185 137 L 188 129 L 181 124 L 189 124 Z" />
              </g>
            ) : currentMood === 'surprised' || currentMood === 'excited' ? (
              // Extra wide round excited baby eyes
              <>
                <ellipse cx="128" cy="122" rx="14" ry="16.5" fill="#1E293B" />
                <g style={{ transform: `translate(${pupilOffset.x * 0.8}px, ${pupilOffset.y * 0.8}px)` }}>
                  <circle cx="124" cy="115" r="5.2" fill="#FFFFFF" />
                  <circle cx="133" cy="127" r="2.8" fill="#FFFFFF" />
                  <circle cx="127" cy="124" r="1.6" fill="#67E8F9" />
                </g>
                <ellipse cx="192" cy="122" rx="14" ry="16.5" fill="#1E293B" />
                <g style={{ transform: `translate(${pupilOffset.x * 0.8}px, ${pupilOffset.y * 0.8}px)` }}>
                  <circle cx="188" cy="115" r="5.2" fill="#FFFFFF" />
                  <circle cx="197" cy="127" r="2.8" fill="#FFFFFF" />
                  <circle cx="191" cy="124" r="1.6" fill="#67E8F9" />
                </g>
              </>
            ) : (
              // Big glossy expressive eyes that follow pointer!
              <>
                {/* Left Eye Socket */}
                <ellipse cx="128" cy="122" rx="12" ry="15" fill="#1E293B" />
                <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}>
                  <circle cx="124" cy="116" r="4.6" fill="#FFFFFF" />
                  <circle cx="132" cy="126" r="2.3" fill="#FFFFFF" />
                  <circle cx="127" cy="124" r="1.4" fill="#67E8F9" opacity="0.8" />
                </g>

                {/* Right Eye Socket */}
                <ellipse cx="192" cy="122" rx="12" ry="15" fill="#1E293B" />
                <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}>
                  <circle cx="188" cy="116" r="4.6" fill="#FFFFFF" />
                  <circle cx="196" cy="126" r="2.3" fill="#FFFFFF" />
                  <circle cx="191" cy="124" r="1.4" fill="#67E8F9" opacity="0.8" />
                </g>
              </>
            )}
          </g>

          {/* Mouth Expressions */}
          <g id="mallow-mouth">
            {currentMood === 'laughing' || currentMood === 'giggling' || currentMood === 'excited' ? (
              // Open joyful laughing / excited mouth with rosy tongue inside
              <g>
                <path
                  d="M 148 132 Q 160 154 172 132 Q 160 135 148 132 Z"
                  fill="#F43F5E"
                  stroke="#1E293B"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M 153 144 Q 160 139 167 144 Q 160 152 153 144 Z"
                  fill="#FB7185"
                />
              </g>
            ) : currentMood === 'surprised' || currentMood === 'curious' ? (
              // Cute rounded "o" mouth
              <ellipse
                cx="160"
                cy="138"
                rx={currentMood === 'surprised' ? 5.5 : 4.5}
                ry={currentMood === 'surprised' ? 6.5 : 5}
                fill="#1E293B"
              />
            ) : currentMood === 'shy' ? (
              // Shy delicate w-shaped baby pout / sweet smile
              <path
                d="M 152 136 Q 156 142 160 137 Q 164 142 168 136"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            ) : currentMood === 'winking' ? (
              // Playful perky curved smile tilted slightly up on right
              <path
                d="M 151 135 Q 161 145 171 132"
                fill="none"
                stroke="#1E293B"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            ) : currentMood === 'sleepy' || currentMood === 'comforting' || currentMood === 'content' ? (
              // Tiny cozy relaxed smile
              <path
                d="M 154 136 Q 160 142 166 136"
                fill="none"
                stroke="#334155"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            ) : (
              // Sweet gentle open smile
              <path
                d="M 151 134 Q 160 144 169 134"
                fill="none"
                stroke="#1E293B"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};
