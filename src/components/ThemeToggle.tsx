import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMoonLine, RiSunLine, RiCloseLine } from 'react-icons/ri'

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Show tooltip every time the website is opened, delay a bit so it pops up after load
    const timer = setTimeout(() => setShowTooltip(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setIsDark(newIsDark)
    
    // Dismiss tooltip on interaction
    if (showTooltip) {
      setShowTooltip(false)
    }
  }

  const dismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowTooltip(false)
  }

  return (
    <div className="fixed top-[calc(env(safe-area-inset-top)+1.5rem)] right-6 z-[60] flex items-center gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-gradient-to-br from-[#E2B753] to-[#C8A04A] text-[#17345D] px-4 py-2 rounded-xl text-[11px] font-inter font-bold tracking-wider shadow-[0_8px_25px_rgba(200,160,74,0.35)] flex items-center gap-2.5 border border-[#F4D075]"
          >
            <span>Try {isDark ? 'Light' : 'Dark'} Mode!</span>
            <button 
              onClick={dismissTooltip} 
              className="hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 active:scale-95"
            >
              <RiCloseLine className="w-3.5 h-3.5" />
            </button>
            {/* Arrow pointing right */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#C8A04A] border-r border-t border-[#F4D075] rotate-45 rounded-sm shadow-[2px_-2px_4px_rgba(200,160,74,0.1)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={toggleTheme}
        className="p-3 rounded-full bg-ivory backdrop-blur-md border border-soft-gold/30 shadow-lg text-navy hover:text-soft-gold transition-colors duration-300 flex items-center justify-center cursor-pointer relative z-10"
        aria-label="Toggle Theme"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDark ? (
          <RiSunLine className="w-5 h-5" />
        ) : (
          <RiMoonLine className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  )
}
