/**
 * Fonction utilitaire pour obtenir le basePath
 * Utilise __NEXT_DATA__ pour récupérer le basePath configuré par Next.js
 */
export const getBasePath = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_PATH || ''
  }
  
  // Essayer de récupérer depuis __NEXT_DATA__ (données Next.js)
  if ((window as any).__NEXT_DATA__) {
    const nextData = (window as any).__NEXT_DATA__
    if (nextData.assetPrefix) {
      return nextData.assetPrefix
    }
  }
  
  // Détecter depuis l'URL actuelle
  const path = window.location.pathname
  if (path.startsWith('/olympe-chat')) {
    return '/olympe-chat'
  }
  
  // Fallback: utiliser la variable d'environnement (disponible au build)
  return process.env.NEXT_PUBLIC_BASE_PATH || ''
}
