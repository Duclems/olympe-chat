'use client'

import { useState, useEffect } from 'react'
import SplitText from '@/components/SplitText'

const messages = [
  "J'arrive",
  "Bientôt là",
  "En route",
  "Presque prêt",
  "Ça arrive",
  "Dans un instant",
]

const citations = [
  "Les chauves-souris peuvent vivre jusqu'à 30 ans dans la nature",
  "Au Moyen Âge, les chauves-souris étaient associées aux ténèbres et à la sorcellerie",
  "Les chauves-souris sont les seuls mammifères capables de voler activement",
  "Au XIIIe siècle, on croyait que les chauves-souris portaient malheur",
  "Les chauves-souris peuvent manger jusqu'à 1000 moustiques en une heure",
  "Dans l'Antiquité, les chauves-souris étaient vénérées comme symboles de renaissance",
  "Les chauves-souris utilisent l'écholocation pour naviguer dans l'obscurité",
  "Au Moyen Âge, on pensait que les chauves-souris étaient des créatures du diable",
  "Les chauves-souris représentent 20% de toutes les espèces de mammifères",
  "Les châteaux médiévaux abritaient souvent des colonies de chauves-souris",
]

export default function IntroPage() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentCitationIndex, setCurrentCitationIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const fontSize = 96 // Taille assez grosse, similaire aux pseudos
  const citationFontSize = 24 // Très petit

  const getTextColor = () => {
    return '#f5e7ff'
  }

  // Changer le message toutes les 5 secondes avec transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        setIsVisible(true)
      }, 300) // Délai pour la transition
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Changer la citation toutes les 20 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCitationIndex((prev) => (prev + 1) % citations.length)
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-2xl w-full px-8">
        <div className="w-full text-center flex flex-col gap-1">
          <div 
            key={`message-${currentMessageIndex}`}
            style={{
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              position: 'relative',
            }}
          >
            {isVisible && (
              <SplitText
                key={`split-${currentMessageIndex}`}
                text={messages[currentMessageIndex]}
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
                  color: getTextColor(),
                  fontWeight: 700,
                  fontFamily: '"UnifrakturCook", cursive',
                  fontStyle: 'normal',
                  display: 'inline-block',
                  lineHeight: '1.2',
                }}
              />
            )}
          </div>
          <div
            key={currentCitationIndex}
            style={{
              fontSize: `${citationFontSize}px`,
              color: getTextColor(),
              fontWeight: 'bold',
              fontFamily: '"TASA Explorer", sans-serif',
              fontOpticalSizing: 'auto',
              fontStyle: 'normal',
              opacity: 0.7,
              marginTop: '0.25rem',
            }}
          >
            {citations[currentCitationIndex]}
          </div>
        </div>
      </div>
    </div>
  )
}
