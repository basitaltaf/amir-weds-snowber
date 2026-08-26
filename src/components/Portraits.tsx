import React from 'react'
import { motion } from 'framer-motion'
import type { TranslationSet } from '../lib/translations'

interface PortraitsProps {
  t: TranslationSet;
  config?: any;
}

export const Portraits: React.FC<PortraitsProps> = ({ t, config }) => {
  const currentLang = document.documentElement.lang || 'en'
  const groomLabel = currentLang === 'ur' ? 'دولہا' : 'Groom'
  const brideLabel = currentLang === 'ur' ? 'دلہن' : 'Bride'

  const groomImg = config?.portraits?.groom || '/groom.png'
  const brideImg = config?.portraits?.bride || '/bride.png'

  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-6 bg-ivory overflow-hidden flex items-center justify-center min-h-[500px]">
      
      {/* Background Celestial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-soft-gold/15 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      {/* Decorative floral/dust particles (simulated with tiny dots) */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-soft-gold/40 rounded-full blur-[1px]" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-soft-gold/30 rounded-full blur-[1px]" />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-soft-gold/20 rounded-full blur-[2px]" />

      <div className="max-w-4xl mx-auto relative z-10 text-center w-full">
        {/* Section Title */}
        <div className="mb-16 sm:mb-24">
          <span className="text-soft-gold font-inter text-[10px] tracking-[0.3em] uppercase block mb-3">
            {t.heart}
          </span>
          <h2 className="font-cormorant text-3xl sm:text-5xl text-navy font-semibold tracking-wide uppercase">
            {currentLang === 'ur' ? 'دولہا اور دلہن' : 'The Bride & Groom'}
          </h2>
          <div className="h-[1px] w-24 bg-soft-gold/30 mx-auto mt-6" />
        </div>

        {/* Side-by-Side Floating Portrait Cards */}
        <div className="flex flex-row justify-center items-center relative max-w-2xl mx-auto w-full perspective-[1200px]">
          
          {/* Groom Portrait Card (Tilted Left) */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: -15, rotateZ: -8 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0, rotateZ: -5 }}
            whileHover={{ scale: 1.05, rotateZ: -2, zIndex: 40, y: -10 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            className="relative bg-ivory p-2.5 sm:p-4 pb-12 sm:pb-16 rounded-sm border border-soft-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.15)] shadow-navy/20 w-44 sm:w-72 aspect-[3.2/4.5] z-10 origin-bottom-right group cursor-pointer"
          >
            {/* Masking Tape effect */}
            <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-3 sm:h-5 bg-white/70 shadow-sm backdrop-blur-sm rotate-2 border border-black/5 z-20" />
            
            <div className="relative w-full h-full overflow-hidden rounded-sm bg-navy/5">
              <img
                src={groomImg}
                alt={groomLabel}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Inner photo shadow/border */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-sm pointer-events-none mix-blend-overlay" />
            </div>
            
            {/* Elegant Caption */}
            <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 text-center">
              <span className="font-playfair text-navy text-[10px] sm:text-xs tracking-[0.3em] font-bold uppercase block opacity-80">
                {groomLabel}
              </span>
            </div>
          </motion.div>
 


          {/* Bride Portrait Card (Tilted Right, overlapping) */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: 15, rotateZ: 8 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0, rotateZ: 5 }}
            whileHover={{ scale: 1.05, rotateZ: 2, zIndex: 40, y: -10 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="relative bg-ivory p-2.5 sm:p-4 pb-12 sm:pb-16 rounded-sm border border-soft-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.15)] shadow-navy/20 w-44 sm:w-72 aspect-[3.2/4.5] z-30 -ml-8 sm:-ml-16 origin-bottom-left group cursor-pointer"
          >
            {/* Masking Tape effect */}
            <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-3 sm:h-5 bg-white/70 shadow-sm backdrop-blur-sm -rotate-3 border border-black/5 z-20" />

            <div className="relative w-full h-full overflow-hidden rounded-sm bg-navy/5">
              <img
                src={brideImg}
                alt={brideLabel}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Inner photo shadow/border */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-sm pointer-events-none mix-blend-overlay" />
            </div>
            
            {/* Elegant Caption */}
            <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 text-center">
              <span className="font-playfair text-navy text-[10px] sm:text-xs tracking-[0.3em] font-bold uppercase block opacity-80">
                {brideLabel}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
export default Portraits
