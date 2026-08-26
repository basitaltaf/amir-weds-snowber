import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { TranslationSet } from '../lib/translations'

interface HeroProps {
  t: TranslationSet;
  config?: any;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Hero: React.FC<HeroProps> = ({ t, config }) => {
  const calculateTimeLeft = useCallback(() => {
    const target = new Date(config?.dates?.countdownTarget || '2026-09-23T00:00:00').getTime()
    const now = new Date().getTime()
    const difference = target - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }, [config?.dates?.countdownTarget])

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    // Recalculate immediately if target date changes
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return (
    <section id="invite-section" className="relative min-h-[90dvh] w-full flex flex-col px-4 sm:px-6 py-24 sm:py-10 text-center bg-ivory overflow-hidden">
      {/* Decorative Gold Frame */}
      <div className="absolute inset-4 sm:inset-8 md:inset-16 border border-soft-gold/30 rounded-2xl pointer-events-none z-10" />
      <div className="absolute inset-6 sm:inset-10 md:inset-20 border border-soft-gold/15 rounded-xl pointer-events-none z-10" />



      <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center justify-center my-auto w-full">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-soft-gold font-inter text-xs tracking-[0.25em] uppercase mb-6"
        >
          {config?.hero ? (
            t.dir === 'rtl' ? config.hero.subtitleUr : config.hero.subtitleEn
          ) : (
            t.heroGreeting
          )}
        </motion.p>

        {/* Decorative Golden Card containing Bismillah Calligraphy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="px-8 py-5 md:px-12 md:py-8 border border-soft-gold/30 rounded-2xl relative flex items-center justify-center bg-navy/5 shadow-lg shadow-navy/5 mb-6 sm:mb-10"
        >
          <div className="absolute inset-2 border border-soft-gold/20 rounded-xl" />
          <span className="text-[60px] sm:text-[80px] text-navy opacity-90 hover:scale-105 transition-transform duration-500 select-none leading-none flex items-center justify-center">
            ﷽
          </span>
        </motion.div>


        {/* Signature Couple Names */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1.2 }}
          className="font-signature text-5xl sm:text-7xl md:text-8xl text-navy font-bold tracking-wide leading-tight mb-2 sm:mb-4 capitalize"
        >
          {config?.couple ? (
            t.dir === 'rtl' ? `${config.couple.groom.charAt(0).toUpperCase() + config.couple.groom.slice(1)} اور ${config.couple.bride.charAt(0).toUpperCase() + config.couple.bride.slice(1)}` : `${config.couple.groom.charAt(0).toUpperCase() + config.couple.groom.slice(1)} & ${config.couple.bride.charAt(0).toUpperCase() + config.couple.bride.slice(1)}`
          ) : (
            t.groomAndBride
          )}
        </motion.h1>

        {/* Divider SVG line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '80px' }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1 }}
          className="h-[1px] bg-soft-gold my-4 sm:my-6"
        />

        {/* Wedding Date Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-center gap-1 mb-6 sm:mb-10"
        >
          <span className="font-cormorant text-soft-gold tracking-widest text-sm uppercase font-semibold">
            {t.weddingDateLabel}
          </span>
          <span className="font-playfair text-lg text-navy tracking-widest">
            {config?.dates ? (
              t.dir === 'rtl' ? config.dates.mainDateUr : config.dates.mainDateEn
            ) : (
              t.weddingDateValue
            )}
          </span>
        </motion.div>

        {/* Animated Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 bg-navy/5 border border-soft-gold/15 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl shadow-navy/5"
        >
          {/* Days */}
          <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px]">
            <span className="font-cormorant text-2xl sm:text-3xl text-navy font-light leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="font-inter text-[9px] sm:text-[10px] text-soft-gold tracking-widest uppercase mt-2">
              {t.days}
            </span>
          </div>
          
          {/* Hours */}
          <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px] border-l border-soft-gold/15">
            <span className="font-cormorant text-2xl sm:text-3xl text-navy font-light leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="font-inter text-[9px] sm:text-[10px] text-soft-gold tracking-widest uppercase mt-2">
              {t.hours}
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px] border-l border-soft-gold/15">
            <span className="font-cormorant text-2xl sm:text-3xl text-navy font-light leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="font-inter text-[9px] sm:text-[10px] text-soft-gold tracking-widest uppercase mt-2">
              {t.minutes}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
