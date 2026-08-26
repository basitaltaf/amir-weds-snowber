import React, { useEffect, useRef } from 'react'

interface Petal {
  x: number;
  y: number;
  r: number; // size radius
  d: number; // speed
  opacity: number;
  angle: number;
  angleSpeed: number;
  swing: number;
  swingSpeed: number;
  color: string;
  isBurst?: boolean;
  vx?: number;
  vy?: number;
  type?: 'petal' | 'sparkle';
  initialOpacity?: number;
}

interface PetalsCanvasProps {
  triggerBurst?: boolean;
  burstOrigin?: { x: number; y: number } | null;
}

export const PetalsCanvas: React.FC<PetalsCanvasProps> = ({ triggerBurst = false, burstOrigin = null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const petalsRef = useRef<Petal[]>([])
  const prevTriggerRef = useRef<boolean>(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const colors = [
      'rgba(23, 52, 93, 0.35)',    // Deep Royal Navy
      'rgba(216, 232, 248, 0.55)', // Light blue
      'rgba(250, 248, 243, 0.45)', // Ivory
      'rgba(200, 160, 74, 0.25)',  // Soft Gold
      'rgba(255, 218, 218, 0.35)'  // Pale Pink
    ]

    const petalCount = Math.min(75, Math.floor(width / 12))
    const initialPetals: Petal[] = []

    for (let i = 0; i < petalCount; i++) {
      initialPetals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 8 + 6,
        d: Math.random() * 0.4 + 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        angle: Math.random() * 360,
        angleSpeed: Math.random() * 0.015 - 0.007,
        swing: Math.random() * 15 + 10,
        swingSpeed: Math.random() * 0.008 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    petalsRef.current = initialPetals

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
      ctx.save()
      ctx.translate(p.x + Math.sin(p.angle) * p.swing, p.y)
      ctx.rotate(p.angle)
      ctx.beginPath()
      
      // Draw organic petal shape
      ctx.moveTo(0, -p.r)
      ctx.quadraticCurveTo(p.r * 1.3, -p.r * 0.6, p.r * 0.3, p.r)
      ctx.quadraticCurveTo(-p.r * 1.3, p.r * 0.6, 0, -p.r)
      
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity
      ctx.fill()
      ctx.restore()
    }

    const update = () => {
      ctx.clearRect(0, 0, width, height)
      const currentPetals = petalsRef.current

      for (let i = 0; i < currentPetals.length; i++) {
        const p = currentPetals[i]
        
        if (p.isBurst && p.vx !== undefined && p.vy !== undefined) {
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.05 // Gravity pull
          p.vx *= 0.985 // Air resistance friction
          p.vy *= 0.985
        } else {
          p.y += p.d
          p.x += Math.sin(p.angle * p.swingSpeed) * 0.15
        }
        p.angle += p.angleSpeed

        // If offscreen
        if (p.y > height + 20) {
          if (p.isBurst) {
            // Remove burst particles once offscreen to return to normal density
            currentPetals.splice(i, 1)
            i--
            continue
          } else {
            p.y = -20
            p.x = Math.random() * width
            p.r = Math.random() * 8 + 6
            p.d = Math.random() * 0.4 + 0.2
            p.opacity = Math.random() * 0.5 + 0.2
            p.angle = Math.random() * 360
          }
        }

        drawPetal(ctx, p)
      }

      animationFrameId = requestAnimationFrame(update)
    }

    update()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Listen to triggerBurst
  useEffect(() => {
    if (triggerBurst && !prevTriggerRef.current) {
      const canvas = canvasRef.current
      if (!canvas) return
      const width = canvas.width
      const height = canvas.height

      const goldColors = [
        'rgba(200, 160, 74, 0.95)',   // Rich Gold
        'rgba(218, 165, 32, 0.9)',    // Goldenrod
        'rgba(255, 215, 0, 0.95)',    // Bright Gold
        'rgba(250, 244, 211, 0.9)',   // Pale champagne gold
        'rgba(23, 52, 93, 0.85)',     // Deep Royal Navy blue (celebratory accent)
        'rgba(255, 255, 255, 0.85)'   // White spark
      ]

      const burstCount = 180
      const burstPetals: Petal[] = []

      // Spawn all petals directly from the designated origin or center of the viewport
      const spawnX = burstOrigin ? burstOrigin.x : width / 2
      const spawnY = burstOrigin ? burstOrigin.y : height / 2

      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 8 + 4 // explosive velocity vectors

        const opacity = Math.random() * 0.7 + 0.3
        const type = 'petal'

        burstPetals.push({
          x: spawnX,
          y: spawnY,
          r: Math.random() * 6 + 5,
          d: Math.random() * 0.4 + 0.2, // fallback speed
          opacity: opacity,
          initialOpacity: opacity,
          type: type,
          angle: Math.random() * 360,
          angleSpeed: Math.random() * 0.05 - 0.025,
          swing: Math.random() * 20 + 10,
          swingSpeed: Math.random() * 0.01 + 0.005,
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
          isBurst: true,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2 // upward vector bias
        })
      }

      // Add to running petals ref
      petalsRef.current = [...petalsRef.current, ...burstPetals]
    }
    prevTriggerRef.current = triggerBurst
  }, [triggerBurst, burstOrigin])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-35"
      aria-hidden="true"
    />
  )
}
export default PetalsCanvas
