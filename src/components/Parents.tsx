import React from 'react'
import { motion } from 'framer-motion'
import type { TranslationSet } from '../lib/translations'

interface ParentsProps {
  t: TranslationSet;
  config?: any;
}

export const Parents: React.FC<ParentsProps> = ({ t, config }) => {
  return (
    <section className="relative py-6 sm:py-8 px-6 bg-ivory overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#C8A04A_1.5px,transparent_1.5px)] [background-size:32px_32px]" />

      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Elegant Gold-Bordered Family Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] bg-navy/5 border border-soft-gold/25 p-8 sm:p-12 rounded-3xl shadow-xl shadow-navy/5 backdrop-blur-md text-center relative overflow-hidden"
        >
          {/* Ornate corner brackets */}
          <div className="absolute top-5 left-5 w-5 h-5 border-t border-l border-soft-gold/30 pointer-events-none" />
          <div className="absolute top-5 right-5 w-5 h-5 border-t border-r border-soft-gold/30 pointer-events-none" />
          <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l border-soft-gold/30 pointer-events-none" />
          <div className="absolute bottom-5 right-5 w-5 h-5 border-b border-r border-soft-gold/30 pointer-events-none" />

          {/* Monogram Crest (M - Mir Family Wreath) */}
          <div className="flex justify-center mb-6 select-none animate-pulse">
            <svg className="w-20 h-20 text-soft-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer thin gold dashed ring */}
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
              {/* Inner thin solid gold ring */}
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.0" />
              
              {/* Left Laurel Wreath Branch */}
              <path d="M32 65 C26 55 26 40 33 28 C31 35 29 45 32 55" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              {/* Leaves on left branch */}
              <path d="M30 32 C26 31 24 27 25 23 C28 25 29 29 30 32 Z" fill="currentColor" opacity="0.75" />
              <path d="M28 42 C23 41 21 37 23 33 C26 35 27 39 28 42 Z" fill="currentColor" opacity="0.75" />
              <path d="M28 52 C23 52 21 48 22 44 C25 45 27 49 28 52 Z" fill="currentColor" opacity="0.75" />
              <path d="M31 60 C27 62 24 59 24 55 C27 55 29 58 31 60 Z" fill="currentColor" opacity="0.75" />
              
              {/* Right Laurel Wreath Branch */}
              <path d="M68 65 C74 55 74 40 67 28 C69 35 71 45 68 55" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              {/* Leaves on right branch */}
              <path d="M70 32 C74 31 76 27 75 23 C72 25 71 29 70 32 Z" fill="currentColor" opacity="0.75" />
              <path d="M72 42 C77 41 79 37 77 33 C74 35 73 39 72 42 Z" fill="currentColor" opacity="0.75" />
              <path d="M72 52 C77 52 79 48 78 44 C75 45 73 49 72 52 Z" fill="currentColor" opacity="0.75" />
              <path d="M69 60 C73 62 76 59 76 55 C73 55 71 58 69 60 Z" fill="currentColor" opacity="0.75" />

              {/* Decorative stars / dots at bottom */}
              <circle cx="50" cy="78" r="1.5" fill="currentColor" />
              <circle cx="44" cy="77" r="1.0" fill="currentColor" />
              <circle cx="56" cy="77" r="1.0" fill="currentColor" />

              {/* Home Logo Vector */}
              <path 
                d="M38 51 L50 40 L62 51 M42 51 L42 62 L58 62 L58 51 M47 62 L47 55 C47 53.5 53 53.5 53 55 L53 62" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M56 45 L56 41 L58 41 L58 47" 
                stroke="currentColor" 
                strokeWidth="1.0" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

          {/* Subtitle */}
          <span className="text-soft-gold font-inter text-[9px] sm:text-[10px] tracking-[0.35em] uppercase block mb-3 font-semibold">
            {t.familyDividerText}
          </span>
          
          {/* Main Title (Groom's Family) */}
          <h2 className="font-playfair text-2xl sm:text-3xl text-navy font-normal mb-6 tracking-wide">
            {t.groomParentsHeader}
          </h2>

          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-soft-gold/50 to-transparent mx-auto mb-8" />

          {/* Parents List */}
          <ul className="space-y-4">
            {(config?.family?.groomSide || t.groomParents).map((parent: string, idx: number) => (
              <li key={idx} className="font-cormorant text-lg sm:text-xl text-navy/90 italic tracking-wider leading-relaxed">
                {parent}
              </li>
            ))}
          </ul>
        </motion.div>

      </div>
    </section>
  )
}
