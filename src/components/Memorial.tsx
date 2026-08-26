import React from 'react'
import { motion } from 'framer-motion'

interface MemorialProps {
  config: any;
}

export const Memorial: React.FC<MemorialProps> = ({ config }) => {
  const memorial = config?.memorial

  // If disabled or missing, do not render
  if (!memorial || !memorial.enabled) return null

  const title = memorial.titleEn || 'In Loving Memory'
  const message = memorial.messageEn || 'Forever in our hearts, always in our thoughts.'
  const dua = memorial.duaEn || ''
  const members = memorial.members || []

  return (
    <section className="relative py-12 sm:py-20 px-6 bg-ivory overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="px-8 py-10 md:px-16 md:py-14 border border-soft-gold/30 rounded-2xl relative flex flex-col items-center justify-center bg-navy/5 shadow-lg shadow-navy/5 text-center overflow-hidden"
        >
          {/* Inner decorative border */}
          <div className="absolute inset-2 border border-soft-gold/15 rounded-xl pointer-events-none" />

          {/* Animated Burning Candle Flame */}
          <div className="flex justify-center mb-6 select-none relative z-10">
          <svg className="w-18 h-24 text-soft-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Candle Body */}
            <rect x="46" y="55" width="8" height="28" rx="1" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2" />
            {/* Candle Wick */}
            <line x1="50" y1="55" x2="50" y2="49" stroke="currentColor" strokeWidth="1.2" />
            {/* Glow Effect behind the flame */}
            <circle cx="50" cy="38" r="12" fill="url(#candleGlow)" opacity="0.15" className="animate-pulse" />
            {/* Animated Flame */}
            <motion.path
              d="M50 25 C46 33 46 44 50 48 C54 44 54 33 50 25 Z"
              fill="currentColor"
              animate={{
                scaleY: [1, 1.15, 0.95, 1.05, 1],
                scaleX: [1, 0.9, 1.1, 0.95, 1],
                y: [0, -1, 1, -0.5, 0],
                x: [0, 0.5, -0.5, 0.3, 0],
                skewX: [0, 2, -2, 1, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ originX: 0.5, originY: 1 }}
            />
            {/* Dynamic flame center glow */}
            <motion.path
              d="M50 32 C48 37 48 43 50 46 C52 43 52 37 50 32 Z"
              fill="#FAF8F5"
              animate={{
                scaleY: [1, 1.1, 0.9, 1.05, 1],
                scaleX: [1, 0.95, 1.05, 0.97, 1],
                y: [0, -0.5, 0.5, -0.2, 0],
                x: [0, 0.3, -0.3, 0.1, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ originX: 0.5, originY: 1 }}
            />
            <defs>
              <radialGradient id="candleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Section Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-playfair text-xl sm:text-2xl text-navy font-semibold tracking-wider mb-5 uppercase"
        >
          {title}
        </motion.h2>

        {/* Members List */}
        {members.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1.0 }}
            className="flex flex-col items-center justify-center gap-2 mb-6"
          >
            {members.map((member: string, idx: number) => (
              <div 
                key={idx} 
                className="font-cormorant text-base sm:text-lg text-navy/90 font-medium tracking-wide italic"
              >
                {member}
              </div>
            ))}
          </motion.div>
        )}

        {/* Message */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-lora text-xs sm:text-sm text-navy/70 max-w-lg mx-auto leading-relaxed mb-6"
        >
          {message}
        </motion.p>

        {/* Optional Islamic Du'a */}
        {dua && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1.0 }}
            className="border-t border-soft-gold/10 pt-4 max-w-md mx-auto"
          >
            <p className="font-playfair text-xs text-soft-gold italic tracking-wide leading-relaxed">
              “{dua}”
            </p>
          </motion.div>
        )}

        </motion.div>
      </div>
    </section>
  )
}
export default Memorial
