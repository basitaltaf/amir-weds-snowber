import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiChatHeartFill, RiSendPlaneFill, RiLoader4Line } from 'react-icons/ri'
import type { TranslationSet } from '../lib/translations'
import { guestbookApi, supabase, isSupabaseConfigured } from '../lib/supabase'
import type { GuestbookEntry } from '../lib/supabase'

interface GuestbookProps {
  t: TranslationSet;
  onBlessingSuccess?: (x?: number, y?: number) => void;
}

export const Guestbook: React.FC<GuestbookProps> = ({ t, onBlessingSuccess }) => {
  const formCardRef = useRef<HTMLDivElement>(null)
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isAllWishesOpen, setIsAllWishesOpen] = useState(false)

  // Scroll lock for modal catalog
  useEffect(() => {
    const lenis = (window as any).lenis
    if (isAllWishesOpen) {
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
  }, [isAllWishesOpen])

  // Fetch entries
  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await guestbookApi.fetchAll()
      if (response.success && response.data) {
        setEntries(response.data)
      }
    } catch (err) {
      console.error('Error fetching guestbook:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public:guestbook')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, () => {
          fetchEntries()
        })
        .subscribe()
      return () => {
        supabase?.removeChannel(channel)
      }
    }
  }, [])

  const playSuccessChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(880, ctx.currentTime) // bright A5 bell note
      osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.05) // chime sweep
      
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(440, ctx.currentTime) // warm A4 base note
      
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35) // rapid decay
      
      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 0.35)
      osc2.stop(ctx.currentTime + 0.35)
    } catch (err) {
      console.error("Synthesizer chime play failed:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await guestbookApi.submit({ name, message })
      if (response.success && response.data) {
        setEntries((prev) => [response.data!, ...prev])
        playSuccessChime()
        
        let spawnX = window.innerWidth / 2
        let spawnY = window.innerHeight / 2
        if (formCardRef.current) {
          const rect = formCardRef.current.getBoundingClientRect()
          spawnX = rect.left + rect.width / 2
          spawnY = rect.top + rect.height / 2
        }
        
        if (onBlessingSuccess) onBlessingSuccess(spawnX, spawnY)

        setName('')
        setMessage('')
      } else {
        setErrorMessage('Failed to submit your blessing. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setErrorMessage('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const currentLang = document.documentElement.lang || 'en'
  const leaveBlessingText = currentLang === 'ur' ? 'نیک خواہشات کا اظہار' : currentLang === 'ar' ? 'اترك دعاءً للعروسين' : 'Leave a Blessing'
  const namePlaceholder = currentLang === 'ur' ? 'آپ کا نام' : currentLang === 'ar' ? 'الاسم الكريم' : 'Your name'

  return (
    <section className="relative py-6 sm:py-8 px-6 bg-ivory overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-soft-gold font-inter text-[10px] tracking-[0.3em] uppercase block mb-2">
            {t.heart}
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-navy font-semibold tracking-wide">
            {t.guestbookTitle}
          </h2>
          <p className="font-lora text-xs sm:text-sm text-navy/70 mt-3 max-w-md mx-auto leading-relaxed">
            {t.guestbookSubtitle}
          </p>
          <div className="h-[1px] w-20 bg-soft-gold/30 mx-auto mt-4" />
        </div>

        <div className="flex flex-col items-center gap-8 max-w-xl mx-auto">
          
          {/* Post blessing form */}
          <motion.div
            ref={formCardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-navy/5 border border-soft-gold/20 p-6 rounded-2xl shadow-lg shadow-navy/5 backdrop-blur-md"
          >
            <h3 className="font-playfair text-lg text-navy font-semibold mb-6 flex items-center gap-2">
              <RiChatHeartFill className="text-soft-gold w-5 h-5" />
              <span>{leaveBlessingText}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="gb_name" className="text-soft-gold font-inter text-[9px] font-semibold uppercase tracking-wider">
                  {t.guestbookNameLabel}
                </label>
                <input
                  type="text"
                  id="gb_name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-navy/5 border border-soft-gold/20 rounded-xl px-4 py-2.5 text-navy text-sm font-lora placeholder-navy/40 focus:outline-none focus:border-soft-gold focus:bg-navy/10 transition-all duration-300 shadow-inner"
                  placeholder={namePlaceholder}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label htmlFor="gb_message" className="text-soft-gold font-inter text-[9px] font-semibold uppercase tracking-wider">
                  {t.guestbookMessageLabel}
                </label>
                <textarea
                  id="gb_message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-navy/5 border border-soft-gold/20 rounded-xl px-4 py-2.5 text-navy text-sm font-lora placeholder-navy/40 focus:outline-none focus:border-soft-gold focus:bg-navy/10 transition-all duration-300 shadow-inner resize-none"
                  placeholder={t.guestbookMessagePlaceholder}
                />
              </div>

              {errorMessage && (
                <div className="text-red-500 text-xs text-center">{errorMessage}</div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative group py-3.5 rounded-full bg-navy text-ivory font-inter text-[10px] font-semibold tracking-widest uppercase shadow-[0_4px_25px_rgba(23,52,93,0.25)] border border-soft-gold/20 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,160,74,0.3)] hover:border-soft-gold hover:scale-102 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <RiLoader4Line className="w-4 h-4 animate-spin text-soft-gold" />
                ) : (
                  <>
                    <RiSendPlaneFill className="w-3.5 h-3.5 text-soft-gold" />
                    <span>{t.sendBlessingBtn}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* List of blessings */}
          <div className="w-full space-y-4">
            <AnimatePresence initial={false}>
              {isLoading && entries.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <RiLoader4Line className="w-8 h-8 animate-spin text-soft-gold" />
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-soft-gold/20 rounded-2xl bg-navy/5">
                  <p className="font-lora text-sm italic text-navy/60">{t.noBlessingsYet}</p>
                </div>
              ) : (
                <>
                  {/* Render up to 4 latest blessings */}
                  {entries.slice(0, 4).map((entry, idx) => (
                    <motion.div
                      key={entry.id || idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6 }}
                      className="relative bg-navy/5 border border-soft-gold/15 p-6 rounded-2xl shadow-sm shadow-navy/5"
                    >
                      <div className="absolute top-4 right-6 text-soft-gold/20 text-4xl font-serif leading-none select-none">
                        ”
                      </div>
                      <div className="flex justify-between items-start mb-2 pr-6">
                        <h4 className="font-playfair text-base text-navy font-semibold">
                          {entry.name}
                        </h4>
                        <span className="font-inter text-[9px] text-soft-gold uppercase tracking-wider">
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                      <p className="font-lora text-sm text-navy/80 italic leading-relaxed whitespace-pre-line">
                        {entry.message}
                      </p>
                    </motion.div>
                  ))}

                  {/* On fifth card: keep option of view all */}
                  {entries.length > 4 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setIsAllWishesOpen(true)}
                      className="w-full py-4 bg-navy/5 hover:bg-navy/10 border border-dashed border-soft-gold/30 hover:border-soft-gold rounded-2xl text-[10px] text-navy font-inter font-bold uppercase tracking-widest shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-101 select-none"
                    >
                      <span>View All Blessings (+{entries.length - 4})</span>
                    </motion.button>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* View All wishes popup modal */}
          {createPortal(
            <AnimatePresence>
              {isAllWishesOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-navy/90 backdrop-blur-md z-55 flex items-center justify-center p-4 select-none"
                  onClick={() => setIsAllWishesOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-ivory border border-soft-gold/30 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl flex flex-col gap-4 text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setIsAllWishesOpen(false)}
                      className="absolute top-4 right-4 text-navy/60 hover:text-soft-gold cursor-pointer transition-all duration-300 z-50"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <div className="text-center pb-2 border-b border-soft-gold/15">
                      <h3 className="font-playfair text-lg text-navy font-semibold">Wedding Guestbook</h3>
                      <p className="text-[10px] text-navy/60 tracking-wider uppercase mt-1 font-semibold">All blessings & wishes from our guests</p>
                    </div>

                    {/* Scrollable list of wishes */}
                    <div data-lenis-prevent className="max-h-[60dvh] overflow-y-auto pr-1 scrollbar-thin space-y-4">
                      {entries.map((entry, idx) => (
                        <div
                          key={entry.id || idx}
                          className="relative bg-navy/5 border border-soft-gold/15 p-5 rounded-xl shadow-xs"
                        >
                          <div className="absolute top-3 right-5 text-soft-gold/25 text-3xl font-serif leading-none select-none">
                            ”
                          </div>
                          <div className="flex justify-between items-start mb-1.5 pr-6">
                            <h4 className="font-playfair text-sm text-navy font-semibold">
                              {entry.name}
                            </h4>
                            <span className="font-inter text-[8px] text-soft-gold uppercase tracking-wider">
                              {formatDate(entry.created_at)}
                            </span>
                          </div>
                          <p className="font-lora text-xs text-navy/80 italic leading-relaxed whitespace-pre-line">
                            {entry.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}

        </div>
      </div>
    </section>
  )
}
