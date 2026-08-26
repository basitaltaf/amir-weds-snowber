import React, { useEffect, useRef, useState } from 'react'
import { RiMusic2Fill, RiMusic2Line } from 'react-icons/ri'

interface MusicPlayerProps {
  playRequested: boolean;
  config?: any;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ playRequested, config }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Use the customizable background music track
  let musicUrl = config?.music?.musicUrl || '/ishq.mp3'
  
  // Migration: If the user has the old default saved in their local storage, force it to the new one
  if (musicUrl.includes('Aaja Sanam') || musicUrl.includes('background_music')) {
    musicUrl = '/ishq.mp3'
  }

  useEffect(() => {
    let isMounted = true
    // Create audio element
    const audio = new Audio(musicUrl)
    audio.preload = 'auto' // Force the browser to start buffering immediately
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio
    
    // Explicitly tell the browser to begin loading the file over the network
    audio.load()

    if (isPlaying) {
      audio.play().catch(() => {
        if (isMounted) setIsPlaying(false)
      })
    }

    return () => {
      isMounted = false
      audio.pause()
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicUrl])

  useEffect(() => {
    let isMounted = true
    if (playRequested && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          if (isMounted) setIsPlaying(true)
        })
        .catch((err) => {
          console.warn('Autoplay prevented by browser. Click to play.', err)
        })
    }
    return () => {
      isMounted = false
    }
  }, [playRequested])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.error('Audio playback failed:', err)
        })
    }
  };

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] md:bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] right-4 md:right-6 z-40">
      <button
        onClick={togglePlay}
        className={`h-12 rounded-full flex items-center justify-center border border-soft-gold/30 shadow-lg hover:shadow-xl hover:border-soft-gold hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden px-3.5 ${
          isPlaying
            ? 'w-28 bg-ivory text-soft-gold shadow-soft-gold/15'
            : 'w-12 bg-ivory text-navy/70 shadow-black/10'
        }`}
        title={isPlaying ? 'Mute Music' : 'Play Music'}
        aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
      >
        <div className="flex items-center justify-center">
          {isPlaying ? (
            <RiMusic2Fill className="w-4 h-4 animate-[spin_6s_linear_infinite]" />
          ) : (
            <RiMusic2Line className="w-4 h-4 animate-pulse" />
          )}

          {/* Animated Gold Audio Waveform visualizer */}
          {isPlaying && (
            <div className="flex items-end gap-[3px] h-5 pl-2.5 border-l border-soft-gold/25 pr-0.5 select-none pointer-events-none ml-2">
              <span className="w-[2px] bg-soft-gold rounded-full animate-[soundbar_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
              <span className="w-[2px] bg-soft-gold rounded-full animate-[soundbar_1.1s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
              <span className="w-[2px] bg-soft-gold rounded-full animate-[soundbar_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
              <span className="w-[2px] bg-soft-gold rounded-full animate-[soundbar_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
export default MusicPlayer
