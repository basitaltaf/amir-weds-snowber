import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine, RiCamera2Line, RiUploadCloud2Line } from 'react-icons/ri'
import type { TranslationSet } from '../lib/translations'
import { guestUploadsApi, supabase, isSupabaseConfigured } from '../lib/supabase'
import type { GuestUpload } from '../lib/supabase'

interface GalleryProps {
  t: TranslationSet;
  config?: any;
}

export const Gallery: React.FC<GalleryProps> = ({ t, config }) => {
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<'guest' | 'official'>('guest')
  
  // Guest uploads states
  const [guestUploads, setGuestUploads] = useState<GuestUpload[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploaderName, setUploaderName] = useState('')
  const [uploaderCaption, setUploaderCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isUploadPrivate, setIsUploadPrivate] = useState(false)
  const [activeGuestImg, setActiveGuestImg] = useState<{ src: string, label: string } | null>(null)
  const [isAllGuestsOpen, setIsAllGuestsOpen] = useState(false)

  const publicGuestUploads = guestUploads.filter(up => !up.isPrivate)

  const images = config?.gallery || [
    { src: '/gallery_1.png', alt: 'Wedding Couple' },
    { src: '/gallery_2.png', alt: 'Ceremony Decor' },
    { src: '/gallery_3.png', alt: 'Floral Arrangements' },
    { src: '/gallery_4.png', alt: 'Venue Details' }
  ]

  useEffect(() => {
    const fetchUploads = async () => {
      const res = await guestUploadsApi.list()
      if (res.success && res.data) {
        setGuestUploads(res.data)
      }
    }
    fetchUploads()

    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public:guest_uploads')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_uploads' }, () => {
          fetchUploads()
        })
        .subscribe()
      return () => {
        supabase?.removeChannel(channel)
      }
    }
  }, [])

  const openLightbox = (idx: number) => {
    setActiveImageIdx(idx)
  }

  const closeLightbox = () => {
    setActiveImageIdx(null)
  }

  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveImageIdx((prev) => prev !== null ? (prev + 1) % images.length : null)
    } else {
      setActiveImageIdx((prev) => prev !== null ? (prev - 1 + images.length) % images.length : null)
    }
  }, [images.length])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Limit file size to 2MB to fit comfortably in localStorage
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please upload a file smaller than 2MB.")
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedFile(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadSubmit = async () => {
    if (!uploaderName.trim()) {
      alert("Please enter your name!")
      return
    }
    if (!selectedFile) {
      alert("Please select a photo to upload!")
      return
    }
    
    setIsUploading(true)
    const res = await guestUploadsApi.create({
      guest_name: uploaderName,
      image_url: selectedFile,
      caption: uploaderCaption,
      isPrivate: isUploadPrivate
    })
    setIsUploading(false)
    
    if (res.success && res.data) {
      setUploadSuccess(true)
      const updated = await guestUploadsApi.list()
      if (updated.success && updated.data) {
        setGuestUploads(updated.data)
      }
      setTimeout(() => {
        setIsUploadOpen(false)
        setUploaderName('')
        setUploaderCaption('')
        setSelectedFile(null)
        setUploadSuccess(false)
      }, 1500)
    } else {
      alert("Upload failed! Please try again with a smaller image.")
    }
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIdx === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') navigateLightbox('next')
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIdx, navigateLightbox])

  // Centralized body scroll locking hook for modals
  useEffect(() => {
    const lenis = (window as any).lenis
    if (isAllGuestsOpen || isUploadOpen || activeImageIdx !== null || activeGuestImg !== null) {
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
  }, [isAllGuestsOpen, isUploadOpen, activeImageIdx, activeGuestImg])

  const currentLang = document.documentElement.lang || 'en'

  return (
    <section id="gallery-section" className="relative py-6 sm:py-8 px-6 bg-ivory overflow-hidden">
      {/* Decorative Gold Dividers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-soft-gold/20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-soft-gold/20" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <span className="text-soft-gold font-inter text-[10px] tracking-[0.3em] uppercase block mb-2">
            {t.heart}
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-navy font-semibold tracking-wide">
            {t.galleryTitle}
          </h2>
          <div className="h-[1px] w-20 bg-soft-gold/30 mx-auto mt-4" />
        </div>

        {/* Modern Pill Tab Navigation */}
        <div className="flex items-center justify-center mb-16 select-none">
          <div className="relative flex bg-navy/5 border border-soft-gold/30 p-1.5 rounded-full shadow-inner">
            <button
              onClick={() => setActiveSubTab('guest')}
              className={`relative z-10 px-6 py-2.5 rounded-full font-playfair text-xs sm:text-sm tracking-widest uppercase transition-colors duration-500 font-bold ${
                activeSubTab === 'guest' ? 'text-ivory' : 'text-navy/60 hover:text-navy'
              }`}
            >
              {activeSubTab === 'guest' && (
                <motion.div
                  layoutId="galleryTab"
                  className="absolute inset-0 bg-navy rounded-full -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {currentLang === 'ur' ? 'مہمانوں کے کلکس' : 'Guest Clicks'}
            </button>

            <button
              onClick={() => setActiveSubTab('official')}
              className={`relative z-10 px-6 py-2.5 rounded-full font-playfair text-xs sm:text-sm tracking-widest uppercase transition-colors duration-500 font-bold ${
                activeSubTab === 'official' ? 'text-ivory' : 'text-navy/60 hover:text-navy'
              }`}
            >
              {activeSubTab === 'official' && (
                <motion.div
                  layoutId="galleryTab"
                  className="absolute inset-0 bg-navy rounded-full -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {currentLang === 'ur' ? 'شادی کے لمحات' : 'Official Memories'}
            </button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {activeSubTab === 'official' ? (
            <motion.div
              key="official-album"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center space-y-12 py-8"
            >
              {/* Polaroid Stack Container for Official */}
              <div className="relative w-full max-w-sm h-80 sm:h-96 flex items-center justify-center">
                {images.slice(0, 4).reverse().map((img: any, idx: number, arr: any[]) => {
                  const rotations = [-6, 4, -2, 3];
                  const isTop = idx === arr.length - 1;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: rotations[idx % 4] }}
                      whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                      onClick={() => openLightbox(images.length - 1 - idx)} // since array is reversed, adjust the index for lightbox
                      className={`absolute bg-ivory p-3 pb-12 sm:p-4 sm:pb-16 rounded-sm shadow-xl border border-gray-200 cursor-pointer transition-all duration-300 w-56 sm:w-64 aspect-[3/4] ${isTop ? 'z-10' : 'z-0'}`}
                      style={{ transformOrigin: 'center bottom' }}
                    >
                      <div className="w-full h-full bg-gray-100 overflow-hidden relative">
                        <img 
                          src={img.src} 
                          alt={img.alt} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center px-4">
                        <p className="font-lora italic text-navy/80 text-xs sm:text-sm truncate">
                          {img.alt || 'Official Memory'}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Action Buttons underneath the stack */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md px-6">
                <button
                  onClick={() => openLightbox(0)}
                  className="w-full py-3.5 bg-navy/5 backdrop-blur-sm text-navy rounded-full text-xs font-bold uppercase tracking-widest border border-soft-gold/30 shadow-sm hover:shadow-md hover:bg-navy/10 transition-all duration-300 flex items-center justify-center"
                >
                  View Gallery ({images.length})
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="guest-album"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center space-y-12 py-8"
            >
              {/* Polaroid Stack Container */}
              <div className="relative h-64 md:h-80 w-full max-w-[280px] md:max-w-sm mx-auto flex items-center justify-center">
                
                {/* Check if there are any uploads */}
                {publicGuestUploads.length > 0 ? (
                  publicGuestUploads.slice(0, 4).reverse().map((up, idx, arr) => {
                    // Random-ish rotations based on index for the stack effect
                    const rotations = [-6, 4, -2, 3];
                    const isTop = idx === arr.length - 1;
                    return (
                      <motion.div
                        key={up.id || idx}
                        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                        animate={{ opacity: 1, scale: 1, rotate: rotations[idx % 4] }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                        onClick={() => setActiveGuestImg({ src: up.image_url, label: `${up.guest_name}: "${up.caption || ''}"` })}
                        className={`absolute bg-ivory p-3 pb-12 sm:p-4 sm:pb-16 rounded-sm shadow-xl border border-gray-200 cursor-pointer transition-all duration-300 w-56 sm:w-64 aspect-[3/4] ${isTop ? 'z-10' : 'z-0'}`}
                        style={{ transformOrigin: 'center bottom' }}
                      >
                        <div className="w-full h-full bg-gray-100 overflow-hidden relative">
                          <img 
                            src={up.image_url} 
                            alt={up.guest_name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center px-4">
                          <p className="font-lora italic text-navy/80 text-xs sm:text-sm truncate">
                            {up.caption ? `"${up.caption}"` : `By ${up.guest_name}`}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  /* Empty state stack */
                  [1, 2, 3].map((_, idx) => (
                    <motion.div
                      key={`empty-${idx}`}
                      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: [-6, 4, -2][idx] }}
                      className="absolute bg-ivory p-3 pb-12 sm:p-4 sm:pb-16 rounded-sm shadow-xl border border-gray-200 w-56 sm:w-64 aspect-[3/4] flex flex-col"
                    >
                      <div className="w-full h-full bg-ivory/50 border border-soft-gold/20 flex flex-col items-center justify-center gap-2">
                        <RiCamera2Line className="w-8 h-8 text-soft-gold/40" />
                        <span className="font-inter text-[9px] uppercase tracking-widest text-navy/40 font-semibold">Awaiting Photo</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Action Buttons underneath the stack */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md px-6">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="w-full sm:w-1/2 py-3.5 bg-navy text-ivory rounded-full text-xs font-bold uppercase tracking-widest border border-soft-gold/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RiCamera2Line className="w-5 h-5 text-soft-gold" />
                  {currentLang === 'ur' ? 'تصویر شیئر کریں' : 'Share a Click'}
                </button>

                <button
                  onClick={() => setIsAllGuestsOpen(true)}
                  disabled={publicGuestUploads.length === 0}
                  className={`w-full sm:w-1/2 py-3.5 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest border border-soft-gold/30 shadow-sm transition-all duration-300 flex items-center justify-center ${
                    publicGuestUploads.length === 0 
                      ? 'bg-navy/5 text-navy/30 cursor-not-allowed opacity-50' 
                      : 'bg-navy/5 text-navy hover:shadow-md hover:bg-navy/10 cursor-pointer'
                  }`}
                >
                  View All ({publicGuestUploads.length})
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Browse all guest clicks catalog popup modal */}
        {createPortal(
          <AnimatePresence>
            {isAllGuestsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-navy/90 backdrop-blur-md z-55 flex items-center justify-center p-4 select-none"
                onClick={() => setIsAllGuestsOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-ivory border border-soft-gold/30 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl flex flex-col gap-4 text-left max-h-[80dvh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsAllGuestsOpen(false)}
                    className="absolute top-4 right-4 text-navy/60 hover:text-soft-gold cursor-pointer transition-all duration-300 z-50"
                  >
                    <RiCloseLine className="w-6 h-6" />
                  </button>

                  <div className="text-center pb-2 border-b border-soft-gold/15">
                    <h3 className="font-playfair text-lg text-navy font-semibold">Guest Clicks Gallery</h3>
                    <p className="text-[10px] text-navy/60 tracking-wider uppercase mt-1 font-semibold">Moments captured by our friends & family</p>
                  </div>

                  {/* Scrollable grid of uploads */}
                  <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    {publicGuestUploads.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-navy/40">
                        <RiCamera2Line className="w-12 h-12 mb-2 opacity-50" />
                        <p className="font-playfair text-lg">No public photos yet</p>
                        <p className="text-[10px] uppercase tracking-widest mt-1">Be the first to share a memory!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 pb-20">
                        {publicGuestUploads.map((up, idx) => (
                          <div
                            key={up.id || idx}
                            className="relative aspect-square rounded-xl overflow-hidden border border-soft-gold/15 cursor-pointer group"
                            onClick={() => {
                              setActiveGuestImg({ src: up.image_url, label: `${up.guest_name}: "${up.caption || ''}"` })
                            }}
                          >
                            <img src={up.image_url} alt={up.guest_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1.5 text-center">
                              <span className="text-[9px] text-ivory font-semibold block truncate">{up.guest_name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
        {/* Upload Modal */}
        {createPortal(
          <AnimatePresence>
            {isUploadOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-navy/80 backdrop-blur-md z-55 flex items-center justify-center p-4 select-none"
                onClick={() => setIsUploadOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-ivory border border-soft-gold/30 rounded-2xl w-full max-w-md p-6 relative shadow-2xl flex flex-col gap-4 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsUploadOpen(false)}
                    className="absolute top-4 right-4 text-navy/60 hover:text-soft-gold cursor-pointer transition-all duration-300 z-50"
                  >
                    <RiCloseLine className="w-6 h-6" />
                  </button>

                  <div className="text-center pb-2 border-b border-soft-gold/15">
                    <h3 className="font-playfair text-lg text-navy font-semibold">Share Your Best Click</h3>
                    <p className="text-[10px] text-navy/60 tracking-wider uppercase mt-1">Help us preserve our wedding memories</p>
                  </div>

                  {/* File Selection Box */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-navy/60 font-bold uppercase tracking-wider block">Upload Photo</label>
                    <div className="relative border border-dashed border-soft-gold/40 hover:border-soft-gold rounded-xl p-6 bg-navy/5 text-center cursor-pointer transition-colors group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                      />
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-ivory border border-soft-gold/25">
                            <img src={selectedFile} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold">Photo loaded successfully!</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <RiUploadCloud2Line className="w-8 h-8 text-soft-gold group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] text-navy/70 font-semibold">Click to select a photo</span>
                          <span className="text-[8px] text-navy/40">JPEG, PNG up to 2MB</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guest Name input */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-navy/60 font-bold uppercase tracking-wider block">Your Name</label>
                    <input
                      type="text"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-ivory border border-soft-gold/25 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold text-navy"
                    />
                  </div>

                  {/* Caption input */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-navy/60 font-bold uppercase tracking-wider block">Caption (Optional)</label>
                    <input
                      type="text"
                      value={uploaderCaption}
                      onChange={(e) => setUploaderCaption(e.target.value)}
                      placeholder="e.g. Beautiful couple!"
                      className="w-full bg-ivory border border-soft-gold/25 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold text-navy"
                    />
                  </div>

                  {/* Privacy Toggle */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] text-navy/60 font-bold uppercase tracking-wider block">Privacy</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="privacy"
                          checked={!isUploadPrivate}
                          onChange={() => setIsUploadPrivate(false)}
                          className="w-3.5 h-3.5 text-soft-gold accent-soft-gold border-soft-gold/30 focus:ring-soft-gold cursor-pointer"
                        />
                        <span className="text-[10px] text-navy/70 group-hover:text-navy transition-colors font-medium">
                          Public (Website Album)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="privacy"
                          checked={isUploadPrivate}
                          onChange={() => setIsUploadPrivate(true)}
                          className="w-3.5 h-3.5 text-soft-gold accent-soft-gold border-soft-gold/30 focus:ring-soft-gold cursor-pointer"
                        />
                        <span className="text-[10px] text-navy/70 group-hover:text-navy transition-colors font-medium">
                          Private (Only Couple)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleUploadSubmit}
                    disabled={isUploading || uploadSuccess}
                    className="w-full py-3 bg-navy text-ivory rounded-xl text-xs font-bold uppercase tracking-widest border border-soft-gold/30 hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <span>Uploading...</span>
                    ) : uploadSuccess ? (
                      <span className="text-emerald-300 font-semibold">Uploaded Successfully!</span>
                    ) : (
                      <span>Submit to Guest Album</span>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Regular Lightbox Modal */}
        {createPortal(
          <AnimatePresence>
            {activeImageIdx !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-navy/95 z-55 flex items-center justify-center p-4 select-none"
                onClick={closeLightbox}
              >
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 text-ivory/80 hover:text-soft-gold p-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hover:border-soft-gold/50 cursor-pointer transition-all duration-300 z-50"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>

                {/* Prev Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox('prev');
                  }}
                  className="absolute left-6 text-ivory/80 hover:text-soft-gold p-3 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hover:border-soft-gold/50 cursor-pointer transition-all duration-300 z-40"
                >
                  <RiArrowLeftSLine className="w-6 h-6" />
                </button>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox('next');
                  }}
                  className="absolute right-6 text-ivory/80 hover:text-soft-gold p-3 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hover:border-soft-gold/50 cursor-pointer transition-all duration-300 z-40"
                >
                  <RiArrowRightSLine className="w-6 h-6" />
                </button>

                {/* Lightbox Content Container */}
                <motion.div
                  key={activeImageIdx}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative max-w-xl max-h-[80dvh] flex flex-col justify-center items-center"
                  onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing lightbox
                >
                  <img
                    src={images[activeImageIdx].src}
                    alt={images[activeImageIdx].alt}
                    className="max-w-full max-h-[70dvh] object-contain rounded-2xl border border-soft-gold/20 shadow-2xl"
                  />
                  
                  <p className="font-playfair text-ivory/90 tracking-widest text-center italic mt-4 text-sm sm:text-base">
                    {images[activeImageIdx].alt}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Guest Image Lightbox */}
        {createPortal(
          <AnimatePresence>
            {activeGuestImg !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-navy/95 z-55 flex items-center justify-center p-4 select-none"
                onClick={() => setActiveGuestImg(null)}
              >
                <button
                  onClick={() => setActiveGuestImg(null)}
                  className="absolute top-6 right-6 text-ivory/80 hover:text-soft-gold p-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hover:border-soft-gold/50 cursor-pointer transition-all z-50"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative max-w-xl max-h-[80dvh] flex flex-col justify-center items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={activeGuestImg.src}
                    alt="Guest Upload"
                    className="max-w-full max-h-[70dvh] object-contain rounded-2xl border border-soft-gold/20 shadow-2xl"
                  />
                  <p className="font-playfair text-ivory/90 tracking-widest text-center italic mt-4 text-sm">
                    {activeGuestImg.label}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  )
}
export default Gallery
