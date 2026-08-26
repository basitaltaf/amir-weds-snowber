import React, { useRef } from 'react'

interface FooterProps {
  config?: any;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const clickCount = useRef(0)

  const handleLogoClick = () => {
    clickCount.current += 1
    if (clickCount.current >= 5) {
      window.location.hash = '#/admin'
      clickCount.current = 0
    }
  }

  const contacts = React.useMemo(() => {
    const rawContacts = config?.emergencyContacts || []
    if (typeof window === 'undefined') return rawContacts

    const params = new URLSearchParams(window.location.search)
    const contactParam = params.get('contact')
    if (!contactParam) return rawContacts

    const indices = contactParam.split(',').map(idx => parseInt(idx.trim(), 10)).filter(idx => !isNaN(idx))
    if (indices.length === 0) return rawContacts

    return rawContacts.filter((_: any, idx: number) => indices.includes(idx))
  }, [config])

  return (
    <footer className="relative pt-12 pb-32 px-6 overflow-hidden">
      {/* Subtle gold line accent at top */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-soft-gold to-transparent" />

      {/* Emergency Contacts Left Corner */}
      {contacts.length > 0 && (
        <div className="md:absolute md:bottom-8 md:left-8 text-center md:text-left text-navy/60 font-inter text-[9px] tracking-widest uppercase mb-6 md:mb-0 select-none space-y-1 relative z-30">
          <span className="text-soft-gold font-bold block mb-1">Emergency Contacts:</span>
          {contacts.map((c: any, i: number) => (
            <div key={i} className="flex flex-col md:flex-row md:gap-2">
              <span>{c.name}:</span>
              <a href={`tel:${c.phone}`} className="text-soft-gold hover:underline normal-case tracking-normal">{c.phone}</a>
            </div>
          ))}
        </div>
      )}



      <div className="max-w-3xl mx-auto text-center relative z-20 flex flex-col items-center">
        
        {/* Monogram / Logo */}
        <div 
          onClick={handleLogoClick}
          className="w-14 h-14 rounded-full border border-soft-gold/25 flex items-center justify-center font-playfair text-lg text-soft-gold italic mb-5 select-none cursor-pointer hover:border-soft-gold/50 hover:bg-white/5 transition-all duration-300"
          title="Secret entry portal"
        >
          A&S
        </div>

        {/* Playfair Names */}
        <h2 className="font-playfair text-2xl sm:text-3xl tracking-wide text-navy mb-6 select-none">
          Amir & Snowbar
        </h2>

        {/* Islamic Marriage Blessing */}
        <div className="flex flex-col items-center max-w-xl mb-6 select-none">
          {/* Arabic Dua */}
          <p className="font-serif text-xl sm:text-2xl text-soft-gold mb-3.5 leading-relaxed text-center" dir="rtl">
            بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
          </p>
          
          {/* Translation */}
          <p className="font-lora text-xs sm:text-sm text-navy/70 italic text-center mb-1 leading-relaxed max-w-md px-4">
            “May Allah bless you, shower His blessings upon you, and bring you together in goodness.”
          </p>
          
          {/* Citation Source */}
          <span className="font-inter text-[8px] tracking-widest text-navy/50 uppercase block mt-1">
            — Sunan Abi Dawud & Jami’ at-Tirmidhi
          </span>
        </div>

        <div className="h-[1px] w-32 bg-soft-gold/15 mb-6" />

        {/* Subtle decorative glyph */}
        <span className="text-soft-gold/20 text-base mt-3 mb-3 select-none">❦</span>

        {/* Legal Credits Center */}
        <div className="text-center text-navy/50 font-inter text-[9px] tracking-widest uppercase select-none space-y-1 relative z-30">
          <div>&copy; {new Date().getFullYear()} Amir & Snowber. All Rights Reserved.</div>
          <div className="text-[8px] normal-case text-navy/60 tracking-wider">
            Designed & Developed with ❤️ by{' '}
            <a 
              href="https://github.com/basitaltaf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-soft-gold hover:underline font-semibold"
            >
              Basit Altaf
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
export default Footer
