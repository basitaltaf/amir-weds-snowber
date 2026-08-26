import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMailSendFill, RiCheckDoubleLine, RiLoader4Line } from 'react-icons/ri'
import type { TranslationSet } from '../lib/translations'
import { rsvpApi } from '../lib/supabase'
import type { RSVPData } from '../lib/supabase'

interface RSVPProps {
  t: TranslationSet;
  defaultGuestName: string | null;
  onRsvpSuccess?: (x?: number, y?: number) => void;
}

export const RSVP: React.FC<RSVPProps> = ({ t, defaultGuestName, onRsvpSuccess }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<RSVPData>({
    guest_name: defaultGuestName || '',
    phone: '',
    num_guests: 1,
    attending: true,
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const currentLang = document.documentElement.lang || 'en'
  
  const rsvpReceivedText = currentLang === 'ur' ? 'دعوت نامہ موصول ہو گیا' : currentLang === 'ar' ? 'تم تأكيد الحضور بنجاح' : 'RSVP Received'
  const sendAnotherRsvpText = currentLang === 'ur' ? 'ایک اور جواب بھیجیں' : currentLang === 'ar' ? 'إرسال تأكيد آخر' : 'Send another RSVP'
  const namePlaceholder = currentLang === 'ur' ? 'مثلاً باسط الطاف' : currentLang === 'ar' ? 'مثال: باسط الطاف' : 'e.g. Basit Altaf'
  const guestUnitText = currentLang === 'ur' ? 'مہمان' : currentLang === 'ar' ? 'ضيف' : 'Guest'
  const guestsUnitText = currentLang === 'ur' ? 'مہمان' : currentLang === 'ar' ? 'ضيوف' : 'Guests'
  const messagePlaceholder = currentLang === 'ur' ? 'کوئی پیغام یا خصوصی ضروریات لکھیں...' : currentLang === 'ar' ? 'اترك رسالة أو متطلبات غذائية...' : 'Leave a message or dietary requirements...'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'num_guests' ? parseInt(value, 10) || 1 : value
    }))
  }

  const handleAttendingChange = (willAttend: boolean) => {
    setFormData((prev) => ({
      ...prev,
      attending: willAttend
    }))
  }

  const playSuccessTick = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(880, ctx.currentTime) // bright A5 bell frequency
      osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.05) // upward chime slide
      
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(440, ctx.currentTime) // warm A4 body frequency
      
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35) // decay chime
      
      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 0.35)
      osc2.stop(ctx.currentTime + 0.35)
    } catch (err) {
      console.error("Synthesizer tick play failed:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.guest_name.trim()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await rsvpApi.submit(formData)
      if (response.success) {
        setSubmitStatus('success')
        playSuccessTick()
        
        let spawnX = window.innerWidth / 2
        let spawnY = window.innerHeight / 2
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect()
          spawnX = rect.left + rect.width / 2
          spawnY = rect.top + rect.height / 2
        }
        
        if (onRsvpSuccess) onRsvpSuccess(spawnX, spawnY)
        setFormData({
          guest_name: defaultGuestName || '',
          phone: '',
          num_guests: 1,
          attending: true,
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (err) {
      console.error(err)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="rsvp-section" className="relative py-6 sm:py-8 px-6 bg-ivory overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-soft-gold font-inter text-[10px] tracking-[0.3em] uppercase block mb-2">
            {t.heart}
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-navy font-semibold tracking-wide">
            {t.rsvpTitle}
          </h2>
          <p className="font-lora text-xs sm:text-sm text-navy/70 mt-3 max-w-md mx-auto leading-relaxed">
            {t.rsvpSubtitle}
          </p>
          <div className="h-[1px] w-20 bg-soft-gold/30 mx-auto mt-4" />
        </div>

        {/* RSVP Container */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-navy/5 border border-soft-gold/20 p-6 sm:p-10 rounded-2xl shadow-xl shadow-navy/5 backdrop-blur-md"
        >
          {/* Inner decorative corner lines */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-soft-gold/30 pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-soft-gold/30 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-soft-gold/30 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-soft-gold/30 pointer-events-none" />

          <AnimatePresence mode="wait">
            {submitStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-soft-gold/15 flex items-center justify-center text-soft-gold mb-6 shadow-sm">
                  <RiCheckDoubleLine className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-xl text-navy font-medium mb-3">
                  {rsvpReceivedText}
                </h3>
                <p className="font-lora text-navy/80 text-sm leading-relaxed max-w-sm mb-6">
                  {t.rsvpSuccess}
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="px-6 py-2 rounded-full border border-soft-gold/30 text-xs font-inter uppercase tracking-widest text-navy hover:bg-navy hover:text-ivory hover:border-navy transition-colors duration-300"
                >
                  {sendAnotherRsvpText}
                </button>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Attending Toggle */}
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => handleAttendingChange(true)}
                    className={`flex-1 max-w-[180px] py-3 rounded-full font-inter text-[10px] font-semibold tracking-widest uppercase border transition-all duration-300 cursor-pointer shadow-sm ${
                      formData.attending
                        ? 'bg-navy text-ivory border-navy'
                        : 'bg-transparent text-navy/70 border-soft-gold/25 hover:border-soft-gold'
                    }`}
                  >
                    {t.attendingYes}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttendingChange(false)}
                    className={`flex-1 max-w-[180px] py-3 rounded-full font-inter text-[10px] font-semibold tracking-widest uppercase border transition-all duration-300 cursor-pointer shadow-sm ${
                      !formData.attending
                        ? 'bg-navy text-ivory border-navy'
                        : 'bg-transparent text-navy/70 border-soft-gold/25 hover:border-soft-gold'
                    }`}
                  >
                    {t.attendingNo}
                  </button>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="guest_name" className="text-soft-gold font-inter text-[10px] font-semibold uppercase tracking-wider">
                    {t.guestNameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="guest_name"
                    name="guest_name"
                    required
                    value={formData.guest_name}
                    onChange={handleChange}
                    className="w-full bg-navy/5 border border-soft-gold/20 rounded-xl px-4 py-3 text-navy text-base md:text-sm font-lora placeholder-navy/40 focus:outline-none focus:border-soft-gold focus:bg-navy/10 transition-all duration-300 shadow-inner"
                    placeholder={namePlaceholder}
                  />
                </div>

                {/* Phone & Guest Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-soft-gold font-inter text-[10px] font-semibold uppercase tracking-wider">
                      {t.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-navy/5 border border-soft-gold/20 rounded-xl px-4 py-3 text-navy text-base md:text-sm font-lora placeholder-navy/40 focus:outline-none focus:border-soft-gold focus:bg-navy/10 transition-all duration-300 shadow-inner"
                      placeholder="e.g. +92 300 1234567"
                    />
                  </div>

                  {/* Guest Count */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="num_guests" className="text-soft-gold font-inter text-[10px] font-semibold uppercase tracking-wider">
                      {t.numGuestsLabel}
                    </label>
                    <select
                      id="num_guests"
                      name="num_guests"
                      value={formData.num_guests}
                      onChange={handleChange}
                      disabled={!formData.attending}
                      className="w-full bg-navy/5 border border-soft-gold/20 rounded-xl px-4 py-3 text-navy text-sm font-lora focus:outline-none focus:border-soft-gold focus:bg-navy/10 transition-all duration-300 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? guestUnitText : guestsUnitText}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-soft-gold font-inter text-[10px] font-semibold uppercase tracking-wider">
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-navy/5 border border-soft-gold/20 rounded-xl px-4 py-3 text-navy text-base md:text-sm font-lora placeholder-navy/40 focus:outline-none focus:border-soft-gold focus:bg-navy/10 transition-all duration-300 shadow-inner resize-none"
                    placeholder={messagePlaceholder}
                  />
                </div>

                {/* Error Banner */}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center"
                  >
                    {t.rsvpError}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group py-3.5 rounded-full bg-navy text-ivory font-inter text-[10px] font-semibold tracking-widest uppercase shadow-[0_4px_25px_rgba(23,52,93,0.25)] border border-soft-gold/20 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,160,74,0.3)] hover:border-soft-gold hover:scale-102 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RiLoader4Line className="w-4 h-4 animate-spin text-soft-gold" />
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <RiMailSendFill className="w-4 h-4 text-soft-gold" />
                      <span>{t.submitRsvpBtn}</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
