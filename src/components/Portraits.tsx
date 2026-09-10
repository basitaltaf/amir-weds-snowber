import React from 'react'
import { motion } from 'framer-motion'
import type { TranslationSet } from '../lib/translations'

interface PortraitsProps {
  t: TranslationSet;
  config?: any;
}

export const Portraits: React.FC<PortraitsProps> = ({ config }) => {
  const currentLang = document.documentElement.lang || 'en'
  const groomLabel = currentLang === 'ur' ? 'دولہا' : 'Groom'
  const brideLabel = currentLang === 'ur' ? 'دلہن' : 'Bride'

  const groomImg = config?.portraits?.groom || '/groom.png'
  const brideImg = config?.portraits?.bride || '/bride.png'

  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-6 bg-ivory overflow-hidden flex items-center justify-center min-h-[500px]">
      
      {/* Background Celestial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-soft-gold/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      {/* Decorative floral/dust particles */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-soft-gold/40 rounded-full blur-[1px]" />
      <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-soft-gold/30 rounded-full blur-[1px]" />

      <div className="max-w-3xl mx-auto relative z-10 text-center w-full">
        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="font-cormorant text-2xl sm:text-4xl text-soft-gold font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase">
            {currentLang === 'ur' ? 'دولہا اور دلہن' : 'The Bride & Groom'}
          </h2>
          {/* Heart Separator */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
            <div className="h-[1px] w-12 sm:w-20 bg-soft-gold/40" />
            <span className="text-[#A25050] text-sm animate-pulse">♥</span>
            <div className="h-[1px] w-12 sm:w-20 bg-soft-gold/40" />
          </div>
        </div>

        {/* Clean Minimalist Frames */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
          className="border border-soft-gold/50 rounded-3xl p-3 sm:p-6 bg-ivory shadow-[0_5px_20px_rgba(200,160,74,0.05)] max-w-2xl mx-auto mb-8 sm:mb-10 relative"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Groom Photo */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-navy/5 shadow-sm border border-soft-gold/20 relative group">
                <img 
                  src={groomImg} 
                  alt={groomLabel}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none mix-blend-overlay" />
              </div>
              <span className="font-cormorant text-soft-gold text-sm sm:text-base tracking-[0.15em] uppercase font-bold">
                {groomLabel}
              </span>
            </div>

            {/* Bride Photo */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-navy/5 shadow-sm border border-soft-gold/20 relative group">
                <img 
                  src={brideImg} 
                  alt={brideLabel}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none mix-blend-overlay" />
              </div>
              <span className="font-cormorant text-soft-gold text-sm sm:text-base tracking-[0.15em] uppercase font-bold">
                {brideLabel}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Heart Separator */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="h-[1px] w-12 sm:w-20 bg-soft-gold/40" />
          <span className="text-[#A25050] text-sm animate-pulse">♥</span>
          <div className="h-[1px] w-12 sm:w-20 bg-soft-gold/40" />
        </div>

        {/* Quotes Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center gap-4 sm:gap-6"
        >
          <h3 className="font-signature text-4xl sm:text-6xl text-[#A25050] tracking-wide" style={{ textShadow: '0 2px 10px rgba(162,80,80,0.1)' }}>
            Better Together
          </h3>
          <p className="font-cormorant text-soft-gold text-sm sm:text-lg tracking-widest font-medium px-4">
            "And We created you in pairs" Quran 78:8
          </p>
        </motion.div>
      </div>
    </section>
  )
}
export default Portraits
