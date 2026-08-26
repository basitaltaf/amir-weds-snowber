import React from 'react'

export const LuxuryDivider: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4 my-6 opacity-75 select-none" aria-hidden="true">
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-soft-gold/50 to-soft-gold" />
      <span className="text-soft-gold text-base">❦</span>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-soft-gold/50 to-soft-gold" />
    </div>
  )
}
export default LuxuryDivider
