import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiSparklingLine, RiCalendarEventLine, RiImage2Line, RiMailLine } from 'react-icons/ri'

const navItems = [
  { id: 'invite-section', label: 'Invite', icon: RiSparklingLine },
  { id: 'events-section', label: 'Events', icon: RiCalendarEventLine },
  { id: 'gallery-section', label: 'Gallery', icon: RiImage2Line },
  { id: 'rsvp-section', label: 'RSVP', icon: RiMailLine }
]

export const BottomNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('invite-section')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show nav after a short delay so it doesn't pop in immediately upon opening
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '-15% 0px -35% 0px', // Widened intersection area to catch shorter sections reliably
        threshold: 0
      }
    )

    navItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    setActiveSection(id) // Immediately update visual active state
    const el = document.getElementById(id)
    if (el && (window as any).lenis) {
      (window as any).lenis.scrollTo(el, { offset: -50, duration: 1.2 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pointer-events-none"
        >
          <div className="bg-ivory/95 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center justify-between gap-6 pointer-events-auto border-t border-b border-soft-gold/30">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-12"
                >
                  {/* Active Indicator Background */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-[#ffd457] rounded-[16px] z-0 h-10 w-12 top-[-4px]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <div className={`relative z-10 flex items-center justify-center ${isActive ? 'text-[#17345D] pt-1' : 'text-navy/60'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <span
                    className={`relative z-10 text-[9px] font-inter uppercase tracking-wider font-semibold transition-colors duration-300 mt-1 ${
                      isActive ? 'text-navy font-bold' : 'text-navy/60'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
