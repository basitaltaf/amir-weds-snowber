import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RiHeartFill } from 'react-icons/ri'

interface CalendarSectionProps {
  language: string;
  config?: any;
  guestName?: string | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ language, config, guestName }) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const targetString = config?.dates?.countdownTarget || '2026-10-01T17:00:00'
    const weddingDate = new Date(targetString).getTime()
    const difference = weddingDate - Date.now()
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }
    return timeLeft
  }, [config?.dates?.countdownTarget])

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  // Google Calendar URL generator removed

  // Calendar calculations for September 2026
  // September 2026 starts on Tuesday (index 1 if Monday is 0)
  // Days in September: 30
  const daysInMonth = 30
  const startOffset = 1 // Monday=0, Tuesday=1, Wednesday=2, Thursday=3, Friday=4, Saturday=5, Sunday=6
  const calendarCells = Array.from({ length: startOffset + daysInMonth })

  const weekDays = language === 'en' 
    ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    : ['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار']

  const monthName = language === 'en' 
    ? 'September 2026'
    : 'ستمبر ۲۰۲۶'

  const sectionHeading = language === 'en'
    ? 'WE INVITE YOU TO CELEBRATE WITH US ON:'
    : 'ہم آپ کو اپنے ساتھ خوشیاں منانے کی دعوت دیتے ہیں:'

  // RSVP buttons removed

  // Convert numbers to Urdu representation if needed
  const formatNumber = (num: number) => {
    if (language === 'en') return String(num)
    const easternDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return String(num).split('').map(digit => {
      const parsed = parseInt(digit, 10)
      return isNaN(parsed) ? digit : easternDigits[parsed]
    }).join('')
  }

  return (
    <section className="relative py-8 sm:py-12 px-6 bg-ivory text-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-soft-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-10 w-40 h-40 bg-soft-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Invitation Header */}
        {/* Guest Name Greeting */}
        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="text-soft-gold text-sm tracking-[0.2em] font-inter uppercase mb-2">To Our Dear Guest</div>
            <div className="font-signature text-4xl sm:text-5xl text-navy font-bold tracking-wide border-b border-soft-gold/30 pb-3 px-8 inline-block capitalize">
              {guestName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-navy font-inter tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs md:text-sm uppercase mb-10"
        >
          {sectionHeading}
        </motion.h2>
        
        {/* Date Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center mb-10 bg-navy/5 p-5 sm:p-6 rounded-2xl border border-soft-gold/20 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm w-full max-w-[340px]"
        >
          <span className="font-cormorant text-[10px] sm:text-xs tracking-[0.2em] text-navy/60 font-semibold uppercase mb-2">
            {language === 'en' ? 'Wedding Dates' : 'شادی کی تاریخیں'}
          </span>
          <span className="font-playfair text-xl sm:text-2xl text-navy tracking-wide font-medium mb-4 text-center">
            {language === 'en' ? config?.dates?.mainDateEn || 'September 23 & 24, 2026' : config?.dates?.mainDateUr || '۲۳ اور ۲۴ ستمبر ۲۰۲۶'}
          </span>

          <div className="w-12 h-[1px] bg-soft-gold/40 mb-4"></div>

          {/* Countdown phrase */}
          <div className="text-navy/80 text-xs font-lora text-center">
            <span className="text-[8px] tracking-widest uppercase text-soft-gold font-inter block mb-1.5 font-semibold">
              {language === 'en' ? 'Counting Down' : 'شمارشِ معکوس'}
            </span>
            <p className="font-playfair italic text-lg sm:text-xl tracking-wide text-navy">
              {language === 'en' ? (
                `${timeLeft.days} days, ${timeLeft.hours} hours`
              ) : (
                `${formatNumber(timeLeft.days)} دن ${formatNumber(timeLeft.hours)} گھنٹے`
              )}
            </p>
          </div>
        </motion.div>

        {/* Monthly Calendar Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-[340px] bg-ivory border-2 border-soft-gold/15 p-5 sm:p-6 rounded-3xl shadow-lg relative"
        >
          {/* subtle gold accent corner */}
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-soft-gold/40 rounded-tr-3xl -m-[2px]"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-soft-gold/40 rounded-bl-3xl -m-[2px]"></div>

          {/* Calendar Month Header */}
          <div className="font-playfair text-navy text-base sm:text-lg font-semibold mb-6 tracking-widest uppercase">
            {monthName}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-3 gap-x-1 sm:gap-x-2 text-center text-xs font-lora text-navy/70">
            {/* Weekdays */}
            {weekDays.map((day) => (
              <span key={day} className="font-inter text-[9px] sm:text-[10px] text-soft-gold font-bold uppercase tracking-wider mb-2">
                {day}
              </span>
            ))}

            {/* Calendar Cells */}
            {calendarCells.map((_, index) => {
              const dayNumber = index - startOffset + 1
              const isDate = dayNumber > 0 && dayNumber <= daysInMonth
              const isWeddingDay = dayNumber === 23 || dayNumber === 24

              return (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center relative select-none"
                >
                  {isDate && (
                    <>
                      {isWeddingDay ? (
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-ivory z-10 group cursor-default">
                          <RiHeartFill className="absolute inset-0 w-full h-full text-soft-gold drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
                          <span className="relative z-10 font-bold font-inter text-[10px] sm:text-[11px]">
                            {formatNumber(dayNumber)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-navy/80 hover:text-navy hover:font-bold transition-all duration-300 cursor-default text-[11px] sm:text-xs">
                          {formatNumber(dayNumber)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
export default CalendarSection
