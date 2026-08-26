import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Language, TranslationSet } from '../lib/translations'

interface LandingPageProps {
  onOpen: () => void;
  onOpening?: () => void;
  guestName: string | null;
  language: Language;
  t: TranslationSet;
  config?: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpen, onOpening, guestName, language, t, config }) => {
  const [isOpening, setIsOpening] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleOpen = () => {
    onOpening?.()
    setIsOpening(true)
    // Reset tilt on click
    setRotateX(0)
    setRotateY(0)
    // Synchronize unmounting with the split-gate slide animation duration (0.3s delay + 1.2s duration = 1.5s total)
    setTimeout(() => {
      onOpen()
    }, 1500)
  }

  // 3D Parallax Card tilt calculation on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    
    // Limits tilt rotation to max 12 degrees for an elegant feel
    setRotateX(-y / (box.height / 24))
    setRotateY(x / (box.width / 24))
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  // 3D center-folding panel variants for premium open reveal
  const leftPanelVariants = {
    initial: { rotateY: 0, x: '0%', opacity: 1 },
    animate: {
      rotateY: isOpening ? -110 : 0,
      x: isOpening ? '-20%' : '0%',
      opacity: isOpening ? 0 : 1,
      transition: {
        delay: 0.2,
        duration: 1.3,
        ease: [0.25, 1, 0.5, 1] as any // elegant ease-out
      }
    }
  }

  const rightPanelVariants = {
    initial: { rotateY: 0, x: '0%', opacity: 1 },
    animate: {
      rotateY: isOpening ? 110 : 0,
      x: isOpening ? '20%' : '0%',
      opacity: isOpening ? 0 : 1,
      transition: {
        delay: 0.2,
        duration: 1.3,
        ease: [0.25, 1, 0.5, 1] as any
      }
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      style={{ perspective: 1500, transformStyle: 'preserve-3d' }}
    >
      {/* Left Split Gate Panel */}
      <motion.div
        variants={leftPanelVariants}
        initial="initial"
        animate="animate"
        className="absolute left-0 top-0 w-1/2 h-full bg-inverse-card border-r border-soft-gold/25 z-10 overflow-hidden"
        style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
      >
        {/* Background gold specks pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C8A04A_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Left Monogram Crest Half */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 pointer-events-none transition-transform duration-1000 ease-out"
             style={{ transform: isOpening ? 'translate(50%, -50%) rotateY(-20deg) scale(0.95)' : 'translate(50%, -50%) rotate(0deg) scale(1)' }}>
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#C8A04A] fill-navy filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
            {/* Left half outer circle */}
            <path d="M50 5 A45 45 0 0 0 50 95" stroke="currentColor" strokeWidth="1" />
            <path d="M50 10 A40 40 0 0 0 50 90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            {/* Initial A */}
            <text x="40" y="58" textAnchor="end" fill="currentColor" fontSize="24" fontFamily="'Playfair Display', serif" fontStyle="italic">A</text>
          </svg>
        </div>
      </motion.div>

      {/* Right Split Gate Panel */}
      <motion.div
        variants={rightPanelVariants}
        initial="initial"
        animate="animate"
        className="absolute right-0 top-0 w-1/2 h-full bg-inverse-card border-l border-soft-gold/25 z-10 overflow-hidden"
        style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
      >
        {/* Background gold specks pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C8A04A_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Right Monogram Crest Half */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none transition-transform duration-1000 ease-out"
             style={{ transform: isOpening ? 'translate(-50%, -50%) rotateY(20deg) scale(0.95)' : 'translate(-50%, -50%) rotate(0deg) scale(1)' }}>
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#C8A04A] fill-navy filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
            {/* Right half outer circle */}
            <path d="M50 5 A45 45 0 0 1 50 95" stroke="currentColor" strokeWidth="1" />
            <path d="M50 10 A40 40 0 0 1 50 90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            {/* Initial S */}
            <text x="60" y="58" textAnchor="start" fill="currentColor" fontSize="24" fontFamily="'Playfair Display', serif" fontStyle="italic">S</text>
          </svg>
        </div>
      </motion.div>

      {/* Centered Invitation Card with 3D Parallax Tilt */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.55 : 1,
          filter: isOpening ? 'blur(12px)' : 'blur(0px)',
          rotateX: isOpening ? -10 : rotateX,
          rotateY: isOpening ? 0 : rotateY,
          transition: {
            opacity: { duration: 0.8, ease: 'easeIn' },
            scale: { duration: 1.0, ease: [0.76, 0, 0.24, 1] as any },
            filter: { duration: 0.8, ease: 'easeIn' },
            rotateX: { duration: 0.1, ease: 'easeOut' },
            rotateY: { duration: 0.1, ease: 'easeOut' }
          }
        }}
        initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: 10, rotateY: 0, filter: 'blur(0px)' }}
        className="w-full max-w-[420px] aspect-[4/6] bg-ivory rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-soft-gold/40 p-8 flex flex-col justify-between items-center text-center relative z-20 overflow-hidden mx-4 perspective-1000 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Watercolor Floral Border Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.14] pointer-events-none bg-no-repeat bg-contain bg-center mix-blend-multiply"
          style={{ backgroundImage: 'url(/floral_border.png)' }}
        />

        {/* Gold Inner Border Line */}
        <div className="absolute inset-4 border border-soft-gold/25 rounded-xl pointer-events-none" />
        <div className="absolute inset-5 border border-soft-gold/15 rounded-lg border-dashed pointer-events-none" />

        {/* Card Body */}
        <div className="flex-1 flex flex-col justify-between py-6 relative z-10">
          {/* Arabic Salam */}
          <motion.div 
            className="text-navy text-lg sm:text-xl font-amiri select-none tracking-wide"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            dir="rtl"
          >
            السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
          </motion.div>

          {/* Names */}
          <div className="my-4 select-none">
            {guestName && (
              <motion.p
                className="text-navy/70 font-inter text-xs tracking-widest uppercase mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {t.guestGreeting} <span className="font-semibold text-[#C8A04A]">{guestName}</span>
              </motion.p>
            )}
            
            <motion.h1
              className="font-signature text-5xl sm:text-7xl text-navy font-bold tracking-wide leading-tight my-2 select-none capitalize"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              {config?.couple ? (
                language === 'en' ? (
                  <>
                    {config.couple.groom.charAt(0).toUpperCase() + config.couple.groom.slice(1)}
                    <span className="block text-xl text-[#C8A04A] font-cormorant my-1">&amp;</span>
                    {config.couple.bride.charAt(0).toUpperCase() + config.couple.bride.slice(1)}
                  </>
                ) : (
                  `${config.couple.groom.charAt(0).toUpperCase() + config.couple.groom.slice(1)} اور ${config.couple.bride.charAt(0).toUpperCase() + config.couple.bride.slice(1)}`
                )
              ) : (
                language === 'en' ? (
                  <>
                    Amir
                    <span className="block text-xl text-[#C8A04A] font-cormorant my-1">&amp;</span>
                    Snowber
                  </>
                ) : (
                  t.groomAndBride
                )
              )}
            </motion.h1>
          </div>

          {/* Invitation Text */}
          <motion.div
            className="text-xs sm:text-sm text-navy/80 font-cormorant leading-relaxed tracking-wider px-4 flex flex-col gap-1 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <p className="italic">{language === 'en' ? 'Together with their families' : t.invitationCoverGreeting.split('\n')[0]}</p>
            <p>{language === 'en' ? 'Request the honor of your gracious presence' : t.invitationCoverGreeting.split('\n')[1]}</p>
            <p className="text-[#C8A04A] font-semibold uppercase tracking-widest text-[10px] mt-2">
              {language === 'en' ? 'Wedding Invitation' : t.invitationCoverGreeting.split('\n')[2]}
            </p>
          </motion.div>

          {/* Button wrapper */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <button
              onClick={handleOpen}
              className="relative group px-8 py-3 rounded-full bg-navy text-ivory font-inter text-xs font-semibold tracking-widest uppercase shadow-[0_4px_20px_rgba(250,248,243,0.3)] border border-soft-gold/30 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,160,74,0.4)] hover:border-soft-gold hover:scale-105"
            >
              {/* Glossy hover shine effect */}
              <span className="absolute inset-0 block w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
              <span className="relative z-10">{t.openInvitationBtn}</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default LandingPage
