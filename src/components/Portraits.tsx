import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseLine, RiZoomInLine } from 'react-icons/ri'
import type { TranslationSet } from '../lib/translations'

interface PortraitsProps {
  t: TranslationSet;
  config?: any;
}

export const Portraits: React.FC<PortraitsProps> = ({ config }) => {
  const [activeImage, setActiveImage] = useState<'groom' | 'bride' | null>(null)
  
  // Body scroll lock
  useEffect(() => {
    const lenis = (window as any).lenis
    if (activeImage) {
      document.body.style.overflow = 'hidden'
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
    return () => {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
  }, [activeImage])

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
          {/* Separator */}
          <div className="flex items-center justify-center mt-5 sm:mt-6">
            <div className="h-[1px] w-24 sm:w-40 bg-soft-gold/40" />
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
              <div 
                onClick={() => setActiveImage('groom')}
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-navy/5 shadow-sm border border-soft-gold/20 relative group cursor-pointer"
              >
                <img 
                  src={groomImg} 
                  alt={groomLabel}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300 flex items-center justify-center">
                  <RiZoomInLine className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none mix-blend-overlay" />
              </div>
              <span className="font-cormorant text-soft-gold text-sm sm:text-base tracking-[0.15em] uppercase font-bold">
                {groomLabel}
              </span>
            </div>

            {/* Bride Photo */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div 
                onClick={() => setActiveImage('bride')}
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-navy/5 shadow-sm border border-soft-gold/20 relative group cursor-pointer"
              >
                <img 
                  src={brideImg} 
                  alt={brideLabel}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300 flex items-center justify-center">
                  <RiZoomInLine className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none mix-blend-overlay" />
              </div>
              <span className="font-cormorant text-soft-gold text-sm sm:text-base tracking-[0.15em] uppercase font-bold">
                {brideLabel}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Separator */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="h-[1px] w-24 sm:w-40 bg-soft-gold/40" />
        </div>

        {/* Quotes Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center gap-4 sm:gap-6"
        >
          <h3 className="font-signature text-4xl sm:text-6xl text-red-600 tracking-wide" style={{ textShadow: '0 2px 10px rgba(220,38,38,0.1)' }}>
            Better Together
          </h3>
          <p className="font-cormorant text-soft-gold text-sm sm:text-lg tracking-widest font-medium px-4">
            "And We created you in pairs" Quran 78:8
          </p>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {createPortal(
        <AnimatePresence>
          {activeImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-ivory/95 z-[100] flex items-center justify-center p-4 select-none backdrop-blur-sm"
              onClick={() => setActiveImage(null)}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-6 right-6 text-navy/70 hover:text-soft-gold p-2 bg-navy/5 rounded-full backdrop-blur-md border border-navy/10 hover:border-soft-gold/50 cursor-pointer transition-all duration-300 z-50"
              >
                <RiCloseLine className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative max-w-xl max-h-[85dvh] flex flex-col justify-center items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={activeImage === 'groom' ? groomImg : brideImg}
                  alt={activeImage === 'groom' ? groomLabel : brideLabel}
                  className="max-w-full max-h-[75dvh] object-contain rounded-2xl border border-soft-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                />
                
                <p className="font-playfair text-navy/90 tracking-widest uppercase text-center mt-6 text-sm sm:text-base font-bold">
                  {activeImage === 'groom' ? groomLabel : brideLabel}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}
export default Portraits
