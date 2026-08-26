import React from 'react'
import { motion } from 'framer-motion'
import { RiMapPin2Fill, RiExternalLinkLine, RiTaxiLine } from 'react-icons/ri'
import type { TranslationSet } from '../lib/translations'

interface VenueProps {
  t: TranslationSet;
  config?: any;
}

export const Venue: React.FC<VenueProps> = ({ t, config }) => {
  const lat = config?.venue?.lat ?? 34.498396
  const lng = config?.venue?.lng ?? 74.377186
  const directionsUrl = config?.venue?.directionsUrl || "https://maps.app.goo.gl/iqhyStgdMtokAgGq7"
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`

  return (
    <section className="relative py-6 sm:py-8 px-6 bg-ivory overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-soft-gold font-inter text-[10px] tracking-[0.3em] uppercase block mb-2">
            {t.weddingEvents}
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-navy font-semibold tracking-wide">
            {t.eventVenue}
          </h2>
          <div className="h-[1px] w-20 bg-soft-gold/30 mx-auto mt-4" />
        </div>

        <div className="flex flex-col gap-6 max-w-xl mx-auto items-center">
          
          {/* Location Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full bg-navy/5 border border-soft-gold/20 p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-lg shadow-navy/5"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-soft-gold/15 flex items-center justify-center text-soft-gold mb-6 shadow-xs">
                <RiMapPin2Fill className="w-5 h-5" />
              </div>

              <h3 className="font-playfair text-2xl text-navy font-normal tracking-wide mb-4">
                {config?.venue ? (
                  t.dir === 'rtl' ? config.venue.titleUr : config.venue.titleEn
                ) : (
                  t.venueResidenceTitle
                )}
              </h3>

              <div className="h-[1px] w-full bg-soft-gold/15 mb-6" />

              {/* Custom Wedding Invitation Poem */}
              <div className="font-lora text-navy/80 text-sm leading-relaxed mb-6 space-y-1 sm:space-y-2 italic">
                {(config?.venue
                  ? (t.dir === 'rtl' ? config.venue.poemLinesUr : config.venue.poemLinesEn)
                  : [t.venueInviteLine1, t.venueInviteLine2, t.venueInviteLine3, t.venueInviteLine4, t.venueInviteLine5, t.venueInviteLine6]
                ).map((line: string, idx: number) => (
                  <p 
                    key={idx} 
                    className={
                      idx === 3 
                        ? "font-playfair text-lg text-soft-gold tracking-widest font-semibold not-italic my-3" 
                        : (idx === 1 ? "font-semibold text-navy not-italic" : "")
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-full bg-navy text-ivory font-inter text-[10px] md:text-xs font-semibold tracking-widest uppercase hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                <RiTaxiLine className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
              
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 min-h-[44px] rounded-full border border-soft-gold/30 text-navy hover:text-soft-gold hover:border-soft-gold flex items-center justify-center transition-all duration-300"
                title="View on Google Maps"
              >
                <RiExternalLinkLine className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Embedded Google Map (Compact stack height) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-full h-[260px] border border-soft-gold/20 rounded-2xl overflow-hidden shadow-lg shadow-navy/5 bg-navy/5"
          >
            <iframe
              title="Wedding Venue Map Location"
              src={mapEmbedUrl}
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Luxury bottom ornament flourish */}
          <div className="col-span-12 flex justify-center mt-6">
            <span className="text-soft-gold/20 text-2xl select-none">❦</span>
          </div>

        </div>
      </div>
    </section>
  )
}
export default Venue
