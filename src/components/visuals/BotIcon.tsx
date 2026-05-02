import { motion } from "framer-motion";

interface BotIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function BotIcon({ size = 64, className = "", animated = false }: BotIconProps) {
  const scale = size / 64;
  
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
      {...(animated && {
        initial: { scale: 0, rotateY: -180 },
        animate: { scale: scale, rotateY: 0 },
        transition: { 
          duration: 0.8, 
          ease: [0.34, 1.56, 0.64, 1],
          type: "spring",
          stiffness: 100
        }
      })}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        <defs>
          {/* Gradients for 3D effect - Dark theme */}
          <linearGradient id="botBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="1" />
            <stop offset="50%" stopColor="#0f172a" stopOpacity="1" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="botHeadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="1" />
            <stop offset="50%" stopColor="#1e293b" stopOpacity="1" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="botScreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="botEyeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id="botShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shine effect - subtle for dark theme */}
          <radialGradient id="shine" cx="30%" cy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          
          {/* Edge highlight */}
          <linearGradient id="edgeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Antenna with glow */}
        <g filter="url(#botShadow)">
          <motion.line
            x1="32"
            y1="8"
            x2="32"
            y2="14"
            stroke="url(#botBodyGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            {...(animated && {
              initial: { pathLength: 0, opacity: 0 },
              animate: { pathLength: 1, opacity: 1 },
              transition: { duration: 0.4, delay: 0.3 }
            })}
          />
          <motion.circle
            cx="32"
            cy="8"
            r="3"
            fill="url(#botEyeGlow)"
            filter="url(#botShadow)"
            {...(animated && {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { duration: 0.3, delay: 0.4 }
            })}
          >
            <animate
              attributeName="opacity"
              values="1;0.6;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </g>

        {/* Head - 3D rounded rectangle */}
        <g filter="url(#botShadow)">
          <motion.rect
            x="16"
            y="14"
            width="32"
            height="28"
            rx="8"
            fill="url(#botHeadGradient)"
            stroke="url(#edgeHighlight)"
            strokeWidth="0.5"
            {...(animated && {
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 0.5, delay: 0.2 }
            })}
          />
          {/* Shine on head */}
          <ellipse cx="26" cy="20" rx="8" ry="6" fill="url(#shine)" opacity="0.8" />
          
          {/* Screen/Face panel */}
          <motion.rect
            x="20"
            y="18"
            width="24"
            height="20"
            rx="4"
            fill="url(#botScreenGradient)"
            opacity="0.5"
            {...(animated && {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { duration: 0.4, delay: 0.5 }
            })}
          />
        </g>

        {/* Eyes - glowing */}
        <g>
          <motion.circle
            cx="26"
            cy="28"
            r="3.5"
            fill="url(#botEyeGlow)"
            {...(animated && {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { duration: 0.3, delay: 0.6 }
            })}
          >
            <animate
              attributeName="r"
              values="3.5;4;3.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </motion.circle>
          <circle cx="26" cy="28" r="2" fill="white" opacity="0.8" />
          
          <motion.circle
            cx="38"
            cy="28"
            r="3.5"
            fill="url(#botEyeGlow)"
            {...(animated && {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { duration: 0.3, delay: 0.6 }
            })}
          >
            <animate
              attributeName="r"
              values="3.5;4;3.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </motion.circle>
          <circle cx="38" cy="28" r="2" fill="white" opacity="0.8" />
        </g>

        {/* Smile */}
        <motion.path
          d="M26 34 Q32 37 38 34"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
          {...(animated && {
            initial: { pathLength: 0 },
            animate: { pathLength: 1 },
            transition: { duration: 0.4, delay: 0.7 }
          })}
        />

        {/* Body - 3D trapezoid */}
        <g filter="url(#botShadow)">
          <motion.path
            d="M20 42 L44 42 L46 56 L18 56 Z"
            fill="url(#botBodyGradient)"
            stroke="url(#edgeHighlight)"
            strokeWidth="0.5"
            {...(animated && {
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 0.5, delay: 0.4 }
            })}
          />
          {/* Body shine */}
          <ellipse cx="28" cy="46" rx="6" ry="4" fill="url(#shine)" opacity="0.6" />
          
          {/* Chest panel */}
          <motion.rect
            x="26"
            y="45"
            width="12"
            height="8"
            rx="2"
            fill="url(#botScreenGradient)"
            opacity="0.5"
            {...(animated && {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { duration: 0.3, delay: 0.8 }
            })}
          />
          
          {/* Status lights */}
          <circle cx="29" cy="49" r="1" fill="#34d399">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="32" cy="49" r="1" fill="#34d399">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="35" cy="49" r="1" fill="#34d399">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Arms - 3D cylinders */}
        <g filter="url(#botShadow)">
          <motion.rect
            x="12"
            y="44"
            width="6"
            height="10"
            rx="3"
            fill="url(#botBodyGradient)"
            stroke="url(#edgeHighlight)"
            strokeWidth="0.3"
            {...(animated && {
              initial: { x: 20, opacity: 0 },
              animate: { x: 12, opacity: 1 },
              transition: { duration: 0.4, delay: 0.9 }
            })}
          />
          <ellipse cx="15" cy="45" rx="2" ry="1.5" fill="url(#shine)" opacity="0.7" />
          
          <motion.rect
            x="46"
            y="44"
            width="6"
            height="10"
            rx="3"
            fill="url(#botBodyGradient)"
            stroke="url(#edgeHighlight)"
            strokeWidth="0.3"
            {...(animated && {
              initial: { x: 44, opacity: 0 },
              animate: { x: 46, opacity: 1 },
              transition: { duration: 0.4, delay: 0.9 }
            })}
          />
          <ellipse cx="49" cy="45" rx="2" ry="1.5" fill="url(#shine)" opacity="0.7" />
        </g>

        {/* Legs */}
        <g filter="url(#botShadow)">
          <motion.rect
            x="24"
            y="56"
            width="5"
            height="6"
            rx="2.5"
            fill="url(#botBodyGradient)"
            stroke="url(#edgeHighlight)"
            strokeWidth="0.3"
            {...(animated && {
              initial: { y: 52, opacity: 0 },
              animate: { y: 56, opacity: 1 },
              transition: { duration: 0.3, delay: 1 }
            })}
          />
          <motion.rect
            x="35"
            y="56"
            width="5"
            height="6"
            rx="2.5"
            fill="url(#botBodyGradient)"
            stroke="url(#edgeHighlight)"
            strokeWidth="0.3"
            {...(animated && {
              initial: { y: 52, opacity: 0 },
              animate: { y: 56, opacity: 1 },
              transition: { duration: 0.3, delay: 1 }
            })}
          />
        </g>
      </svg>
    </motion.div>
  );
}
