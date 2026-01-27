'use client'

import { useState, useRef, useEffect } from 'react'
import SplitText from '@/components/SplitText'
import { getBasePath } from '@/lib/basePath'

export default function ElementsPage() {
  const [isFlapping, setIsFlapping] = useState(false)
  const leftWingRef = useRef<HTMLImageElement>(null)
  const rightWingRef = useRef<HTMLImageElement>(null)
  const fontSize = 16

  // Animation des ailes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    let animationTimeoutId: NodeJS.Timeout | null = null
    let isMounted = true

    const triggerFlap = () => {
      if (!isMounted) return
      setIsFlapping(true)
      if (leftWingRef.current && rightWingRef.current) {
        leftWingRef.current.style.animation = 'none'
        rightWingRef.current.style.animation = 'none'
        // Force reflow
        void leftWingRef.current.offsetWidth
        void rightWingRef.current.offsetWidth
        leftWingRef.current.style.animation = ''
        rightWingRef.current.style.animation = ''
      }
      // Attendre la fin de l'animation (2s) avant de réinitialiser
      animationTimeoutId = setTimeout(() => {
        if (isMounted) {
          setIsFlapping(false)
        }
      }, 2000)
    }

    // Déclencher immédiatement au montage
    triggerFlap()

    const scheduleNextFlap = () => {
      if (!isMounted) return
      // Intervalle aléatoire entre 5 et 10 secondes (minimum 5 secondes, maximum 10 secondes)
      const delay = 5000 + Math.random() * 5000
      timeoutId = setTimeout(() => {
        if (isMounted) {
          triggerFlap()
          scheduleNextFlap()
        }
      }, delay)
    }

    scheduleNextFlap()

    // Cleanup function
    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (animationTimeoutId) {
        clearTimeout(animationTimeoutId)
      }
    }
  }, [])

  const getLightShadowColor = () => {
    return 'rgba(122, 13, 200, 0.5)'
  }

  const getLightTextColor = () => {
    return '#f5e7ff'
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'transparent' }}>
      {/* Cercle en haut à gauche */}
      <div
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 10,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          border: '4px solid #1e0332',
          boxShadow: `inset 0 0 10px 0 ${getLightShadowColor()}, inset 0 0 0 6px rgba(30, 3, 50, 0.25), inset 0 0 0 10px rgba(30, 3, 50, 0.15)`,
        }}
      />

      {/* Texte "Chat" avec ailes en bas à droite */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.1rem',
            paddingTop: '0.2rem',
          }}
        >
          {/* Aile gauche */}
          <img
            ref={leftWingRef}
            src={`${getBasePath()}/images/icones/ailes.svg`}
            alt=""
            className={isFlapping ? 'animate-wing-flap-left' : ''}
            style={{
              width: `${fontSize * 3}px`,
              height: `${fontSize * 3}px`,
              objectFit: 'contain',
              transformOrigin: 'center center',
              transform: 'translateX(10px) translateY(-24px)',
              zIndex: 1,
              position: 'relative',
            }}
          />
          {/* Cadre du pseudo */}
          <div
            className="overflow-visible select-none rounded-3xl"
            style={{
              backgroundColor: '#1e0332',
              border: '4px solid #1e0332',
              boxShadow: `inset 0 0 10px 0 ${getLightShadowColor()}, inset 0 0 0 6px rgba(30, 3, 50, 0.25), inset 0 0 0 10px rgba(30, 3, 50, 0.15)`,
              padding: '0.25rem 1rem',
              zIndex: 2,
              position: 'relative',
            }}
          >
            <SplitText
              text="Chat"
              tag="span"
              className="unifrakturcook-bold"
              delay={30}
              duration={0.8}
              ease="power1.out"
              splitType="chars"
              from={{ opacity: 0, y: 15, scale: 0.9 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              immediate={true}
              style={{
                fontSize: `${fontSize}px`,
                color: getLightTextColor(),
                fontWeight: 700,
                fontFamily: '"UnifrakturCook", cursive',
                fontStyle: 'normal',
                paddingTop: '0.3rem',
                display: 'inline-block',
              }}
            />
          </div>
          {/* Aile droite (inversée) */}
          <img
            ref={rightWingRef}
            src={`${getBasePath()}/images/icones/ailes.svg`}
            alt=""
            className={isFlapping ? 'animate-wing-flap-right' : ''}
            style={{
              width: `${fontSize * 3}px`,
              height: `${fontSize * 3}px`,
              objectFit: 'contain',
              transformOrigin: 'center center',
              transform: 'scaleX(-1) translateX(10px) translateY(-24px)',
              zIndex: 1,
              position: 'relative',
            }}
          />
        </div>
        {/* Barre en dessous */}
        <div
          className="rounded-3xl"
          style={{
            backgroundColor: '#1e0332',
            border: '4px solid #1e0332',
            boxShadow: `inset 0 0 10px 0 ${getLightShadowColor()}, inset 0 0 0 6px rgba(30, 3, 50, 0.25), inset 0 0 0 10px rgba(30, 3, 50, 0.15)`,
            height: '8px',
            width: '100%',
            maxWidth: '400px',
          }}
        />
      </div>
    </div>
  )
}
