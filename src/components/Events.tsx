import React from 'react'
import { motion } from 'framer-motion'
import { RiMapPin2Fill } from 'react-icons/ri'
import type { TranslationSet } from '../lib/translations'

interface EventsProps {
  t: TranslationSet;
  config?: any;
}

type EventKey = 'hinabandi' | 'masnandnishni' | 'reception_baraat';

export const Events: React.FC<EventsProps> = ({ t, config }) => {
  // Detect current language from document
  const currentLang = document.documentElement.lang || 'en'
  const langKey = currentLang === 'ur' ? 'ur' : 'en'

  const eventsList: { id: EventKey; label: string; icon: string }[] = [
    { id: 'hinabandi', label: t.hinabandi, icon: '❀' },
    { id: 'masnandnishni', label: t.masnandnishni, icon: '⚜' },
    { id: 'reception_baraat', label: t.reception_baraat, icon: '❦' }
  ]

  const unifiedEvents = eventsList.map((event) => {
    let data: any = t.eventsData?.[event.id] || {}
    
    if (config?.events?.[event.id]) {
      data = {
        title: event.id === 'hinabandi' ? t.hinabandi : event.id === 'masnandnishni' ? t.masnandnishni : t.reception_baraat,
        date: langKey === 'ur' ? config.events[event.id].dateUr : config.events[event.id].dateEn,
        time: config.events[event.id].time,
        venue: langKey === 'ur' ? config.venue.titleUr : config.venue.titleEn,
        mapUrl: config.venue.directionsUrl
      }
    }

    return { ...event, ...data }
  })

  return (
    <section id="events-section" className="relative py-6 sm:py-8 px-6 bg-ivory overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-20">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-soft-gold font-inter text-[10px] tracking-[0.3em] uppercase block mb-2">
            {t.weddingInvitation}
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-navy font-semibold tracking-wide uppercase">
            {currentLang === 'ur' ? 'تقریباتِ شادی کا شیڈول' : 'WEDDING FESTIVITIES SCHEDULE'}
          </h2>
          <div className="h-[1px] w-20 bg-soft-gold/30 mx-auto mt-4" />
        </div>

        {/* Vertical Schedule Timeline */}
        <div className="relative flex flex-col items-center py-4 w-full">
          
          {/* Central vertical timeline line */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-soft-gold/40 left-1/2 -translate-x-1/2 z-0" />

          <div className="w-full space-y-16 sm:space-y-20 relative z-10">
            {unifiedEvents.map((item, index) => (
              <motion.div
                key={`event-timeline-${index}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="grid grid-cols-12 items-center w-full"
              >
                {/* Left side: Time & Date */}
                <div className="col-span-5 flex flex-col items-end text-right pr-4 sm:pr-8">
                  <span className="font-inter text-[8px] sm:text-[10px] uppercase tracking-widest text-soft-gold mb-1 sm:mb-1.5 leading-tight">
                    {item.date}
                  </span>
                  <span className="font-cormorant text-lg sm:text-2xl text-navy/90 font-semibold tracking-wide">
                    {item.time}
                  </span>
                </div>

                {/* Center: Dot Marker */}
                <div className="col-span-2 flex justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-navy border-2 border-soft-gold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-ivory" />
                  </div>
                </div>

                {/* Right side: Activity & Venue */}
                <div className="col-span-5 flex flex-col items-start text-left pl-4 sm:pl-8">
                  <span className="font-playfair text-base sm:text-xl text-navy font-bold flex items-center gap-2">
                    {item.title}
                  </span>
                  <span className="font-lora text-xs sm:text-sm text-navy/70 italic mt-1 leading-relaxed">
                    {item.venue}
                  </span>
                  <a 
                    href={item.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-2 sm:mt-3 font-inter text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-soft-gold hover:text-navy hover:underline flex items-center gap-1 transition-colors relative z-20 cursor-pointer py-2 -my-2"
                  >
                    <RiMapPin2Fill className="w-3 h-3" /> 
                    {t.viewMap || 'View Location'}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
export default Events
