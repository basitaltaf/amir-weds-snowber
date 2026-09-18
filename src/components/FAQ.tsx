import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiAddLine, RiSubtractLine } from 'react-icons/ri'

import type { WeddingConfig } from '../lib/supabase'

export const FAQ: React.FC<{ config: WeddingConfig }> = ({ config }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  
  const faqData = config.faqs || []

  return (
    <section className="relative py-6 sm:py-8 px-6 bg-ivory overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-soft-gold font-inter text-[10px] tracking-[0.3em] uppercase block mb-2">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-navy font-semibold tracking-wide">
            Frequently Asked Questions
          </h2>
          <div className="h-[1px] w-20 bg-soft-gold/30 mx-auto mt-4" />
        </div>

        {/* Accordion Loop */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="bg-navy/5 border border-soft-gold/20 rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-soft-gold/40"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <span className="font-playfair text-navy text-xs sm:text-sm font-semibold tracking-wide pr-4">
                    {item.q}
                  </span>
                  <span className="text-soft-gold shrink-0">
                    {isOpen ? (
                      <RiSubtractLine className="w-5 h-5 transition-transform duration-300" />
                    ) : (
                      <RiAddLine className="w-5 h-5 transition-transform duration-300" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-soft-gold/10 text-navy/70 font-lora text-[11px] sm:text-xs leading-relaxed italic">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default FAQ
