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
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 bg-ivory dark:bg-navy overflow-hidden flex flex-col items-center justify-center min-h-[600px] z-10 transition-colors duration-500">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-soft-gold/15 dark:bg-ivory/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-20 text-center w-full flex flex-col items-center">
        
        {/* Header Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-cormorant text-3xl sm:text-5xl text-soft-gold font-semibold tracking-[0.15em] uppercase mb-4"
        >
          {currentLang === 'ur' ? 'دولہا اور دلہن' : 'The Bride & Groom'}
        </motion.h2>

        {/* Top Separator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 w-full mb-10"
        >
          <div className="h-[1px] w-12 sm:w-24 bg-soft-gold/30 dark:bg-ivory/20" />
          <span className="text-[#C55655] dark:text-[#E87A79] text-xs sm:text-sm">♥</span>
          <div className="h-[1px] w-12 sm:w-24 bg-soft-gold/30 dark:bg-ivory/20" />
        </motion.div>

        {/* Glassmorphism Container for Photos */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-soft-gold/40 dark:border-soft-gold/20 shadow-[0_15px_40px_rgba(200,160,74,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] rounded-3xl p-6 sm:p-10 w-full max-w-[90%] sm:max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10"
        >
          
          {/* Groom Container */}
          <div className="flex flex-col items-center group cursor-pointer w-full sm:w-1/2">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-navy/5 shadow-md">
              <img 
                src={groomImg} 
                alt={groomLabel} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-xl pointer-events-none mix-blend-overlay" />
            </div>
            <span className="mt-5 font-playfair text-soft-gold text-sm sm:text-base tracking-[0.25em] font-bold uppercase block transition-colors duration-300">
              {groomLabel}
            </span>
          </div>

          {/* Bride Container */}
          <div className="flex flex-col items-center group cursor-pointer w-full sm:w-1/2">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-navy/5 shadow-md">
              <img 
                src={brideImg} 
                alt={brideLabel} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-xl pointer-events-none mix-blend-overlay" />
            </div>
            <span className="mt-5 font-playfair text-soft-gold text-sm sm:text-base tracking-[0.25em] font-bold uppercase block transition-colors duration-300">
              {brideLabel}
            </span>
          </div>
          
        </motion.div>

        {/* Bottom Separator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-3 w-full mt-12 mb-6"
        >
          <div className="h-[1px] w-16 sm:w-28 bg-soft-gold/30 dark:bg-ivory/20" />
          <span className="text-[#C55655] dark:text-[#E87A79] text-sm sm:text-base">♥</span>
          <div className="h-[1px] w-16 sm:w-28 bg-soft-gold/30 dark:bg-ivory/20" />
        </motion.div>

        {/* Footer Typography */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <h3 className="font-signature text-5xl sm:text-6xl text-[#E3B0B0] dark:text-[#E8BDBD] opacity-90 -rotate-2">
            Better Together
          </h3>
          <p className="font-inter text-navy/60 dark:text-ivory/60 text-[9px] sm:text-[11px] tracking-[0.4em] uppercase font-semibold">
            Different Stories, Same Destination
          </p>
        </motion.div>
        
      </div>
    </section>
  )
}
export default Portraits
