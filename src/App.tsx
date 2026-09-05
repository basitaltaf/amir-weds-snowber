import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { RiArrowLeftLine, RiWifiOffLine } from 'react-icons/ri'
import Lenis from 'lenis'
import { translations } from './lib/translations'
import type { Language } from './lib/translations'

// Component Imports
import { PetalsCanvas } from './components/PetalsCanvas'
import { MusicPlayer } from './components/MusicPlayer'
import { LandingPage } from './components/LandingPage'
import { Hero } from './components/Hero'
import { Parents } from './components/Parents'
import { Events } from './components/Events'
import { Gallery } from './components/Gallery'
import { Portraits } from './components/Portraits'
import { Venue } from './components/Venue'
import { RSVP } from './components/RSVP'
import { Guestbook } from './components/Guestbook'
import { Footer } from './components/Footer'
import { LuxuryDivider } from './components/LuxuryDivider'
import { CalendarSection } from './components/CalendarSection'
import { FAQ } from './components/FAQ'
import { Memorial } from './components/Memorial'
import { AdminDashboard } from './components/AdminDashboard'
import { BottomNav } from './components/BottomNav'
import { ThemeToggle } from './components/ThemeToggle'
import { settingsApi, visitsApi, isSupabaseConfigured, supabase, DEFAULT_CONFIG } from './lib/supabase'
import type { WeddingConfig } from './lib/supabase'

function App() {
  const language: Language = 'en'
  const [isOpened, setIsOpened] = useState(() => sessionStorage.getItem('isOpened') === 'true')
  const [playMusic, setPlayMusic] = useState(false)
  const [burstPetals, setBurstPetals] = useState(false)
  const [guestName, setGuestName] = useState<string | null>(() => sessionStorage.getItem('guestName'))
  const [showSlowNetworkWarning, setShowSlowNetworkWarning] = useState(false)
  const [currentView, setCurrentView] = useState<'invite' | 'admin'>(
    window.location.hash === '#/admin' ? 'admin' : 'invite'
  )
  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_CONFIG)

  // Fetch customizable details on mount
  useEffect(() => {
    // Guest Link Parsing
    const params = new URLSearchParams(window.location.search)
    let rawGuest = params.get('guest')
    if (rawGuest) {
      try {
        rawGuest = decodeURIComponent(rawGuest.replace(/\+/g, ' ')).trim()
      } catch (e) {
        // Fallback silently
      }
    }
    if (rawGuest && rawGuest.length > 0) {
      setGuestName(rawGuest)
      sessionStorage.setItem('guestName', rawGuest)
    }

    const startTime = Date.now()
    const loadSettings = async () => {
      const res = await settingsApi.fetch()
      if (res.success && res.data) {
        setConfig(res.data)
      }
      
      // Slow internet warning
      const fetchTime = Date.now() - startTime
      const connection = (navigator as any).connection
      if (fetchTime > 3000 || (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g'))) {
        setShowSlowNetworkWarning(true)
        setTimeout(() => setShowSlowNetworkWarning(false), 8000)
      }
    }
    loadSettings()

    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public:settings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
          loadSettings()
        })
        .subscribe()

      return () => {
        supabase?.removeChannel(channel)
      }
    }
  }, [])

  // Tracking logic
  useEffect(() => {
    // Only track once per session
    if (sessionStorage.getItem('hasTrackedVisit')) return;

    const trackVisit = async () => {
      try {
        let city = 'Unknown';
        let country = 'Unknown';
        let ip = 'Unknown';

        // Try to fetch location safely
        try {
          const res = await fetch('https://ipapi.co/json/', { method: 'GET' });
          if (res.ok) {
            const data = await res.json();
            city = data.city || 'Unknown';
            country = data.country_name || 'Unknown';
            ip = data.ip || 'Unknown';
          }
        } catch (e) {
          console.warn('Geolocation failed');
        }

        // Get guest name from state or session
        const name = sessionStorage.getItem('guestName') || 'Unknown Guest';

        await visitsApi.record({
          guest_name: name,
          city,
          country,
          ip_address: ip,
          device_info: navigator.userAgent
        });

        sessionStorage.setItem('hasTrackedVisit', 'true');
      } catch (err) {
        console.error('Tracking error:', err);
      }
    };

    trackVisit();
  }, [])

  // Listen to hash change routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/admin') {
        setCurrentView('admin')
      } else {
        setCurrentView('invite')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Top page scroll indicator progress hooks
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Get guest name from URL parameters (e.g. ?guest=Basit)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const guest = params.get('guest')
    if (guest) {
      setGuestName(guest)
    }
  }, [])

  // Sync document RTL/LTR properties when language changes
  useEffect(() => {
    const t = translations[language]
    document.documentElement.dir = t.dir
    document.documentElement.lang = language
  }, [language])

  // Initialize Lenis Smooth Scroll when opened
  useEffect(() => {
    if (!isOpened) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false
    })

    ;(window as any).lenis = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [isOpened])

  const [burstOrigin, setBurstOrigin] = useState<{ x: number, y: number } | null>(null)

  const triggerPetalBurst = (x?: number, y?: number) => {
    if (x !== undefined && y !== undefined) {
      setBurstOrigin({ x, y })
    } else {
      setBurstOrigin(null)
    }
    setBurstPetals(true)
    setTimeout(() => {
      setBurstPetals(false)
    }, 150)
  }

  const handleOpening = () => {
    triggerPetalBurst()
    setPlayMusic(true)
  }

  const handleOpenInvitation = () => {
    setIsOpened(true)
    sessionStorage.setItem('isOpened', 'true')
  }

  const handleGoBack = () => {
    setIsOpened(false)
    sessionStorage.removeItem('isOpened')
    setPlayMusic(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const t = translations[language]

  if (currentView === 'admin') {
    return <AdminDashboard config={config} onConfigChange={setConfig} />
  }

  return (
    <div className="min-h-[100dvh] bg-ivory text-navy selection:bg-soft-gold/30 selection:text-navy overflow-hidden">
      {/* Floating Canvas Floral Petals */}
      <PetalsCanvas triggerBurst={burstPetals} burstOrigin={burstOrigin} />

      {/* Floating Controllers (Visible globally) */}
      <MusicPlayer config={config} playRequested={playMusic} />
      {isOpened && <ThemeToggle />}
      
      {/* Back Button */}
      {isOpened && (
        <button
          onClick={handleGoBack}
          className="fixed top-4 left-4 z-50 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full text-navy shadow-lg border border-white/30 hover:bg-white/40 hover:scale-105 transition-all duration-300"
          aria-label="Go back to envelope"
        >
          <RiArrowLeftLine className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Slow Network Banner */}
      <AnimatePresence>
        {showSlowNetworkWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-amber-200 flex items-center gap-2"
          >
            <RiWifiOffLine className="text-amber-500 w-4 h-4" />
            <span className="text-xs text-navy font-medium">Slow connection. Media may take longer to load.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold Top Scroll Progress bar (Fades & follows reading progress) */}
      {isOpened && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-soft-gold via-soft-gold to-navy z-50 origin-left"
          style={{
            scaleX,
            transformOrigin: t.dir === 'rtl' ? 'right' : 'left'
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <LandingPage
            key="cover"
            onOpen={handleOpenInvitation}
            onOpening={handleOpening}
            guestName={guestName}
            language={language}
            t={t}
            config={config}
          />
        ) : (
          <motion.div
            key="main-site"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full relative z-30"
          >
            {/* Hero Banner */}
            <Hero t={t} config={config} />

            {/* Luxury flourish divider */}
            <LuxuryDivider />

            {/* Calendar and Countdown Section */}
            <CalendarSection language={language} config={config} guestName={guestName} />

            {/* Luxury flourish divider */}
            <LuxuryDivider />

            {/* Families Section */}
            <Parents t={t} config={config} />

            {/* Timelines / Events Section */}
            <Events t={t} config={config} />

            {/* Bride & Groom Portraits */}
            <Portraits t={t} config={config} />

            {/* Masonry Picture Gallery */}
            <Gallery t={t} config={config} />

            {/* Maps & Address Section */}
            <Venue t={t} config={config} />

            {/* RSVP Submission Card */}
            <RSVP t={t} defaultGuestName={guestName} onRsvpSuccess={triggerPetalBurst} />

            {/* Guestbook comment wall */}
            <Guestbook t={t} onBlessingSuccess={triggerPetalBurst} />

            {/* In Loving Memory Section */}
            <Memorial config={config} />

            {/* Luxury flourish divider */}
            <LuxuryDivider />

            {/* FAQ Accordion Section */}
            <FAQ />

            {/* Share & Thank you footer */}
            <Footer config={config} />

            {/* Bottom Sticky Navigation */}
            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
