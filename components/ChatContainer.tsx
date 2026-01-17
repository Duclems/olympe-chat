'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import MessageList from './MessageList'
import { TWITCH_CHANNEL, getThemeColor, THEME_COLORS } from '@/config'

// Fonction utilitaire pour obtenir le basePath
const getBasePath = (): string => {
  // Utiliser la variable d'environnement si disponible
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH
  }
  // Sinon, détecter depuis l'URL actuelle
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/olympe-chat')) {
      return '/olympe-chat'
    }
  }
  return ''
}

export interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  color?: string
  badges?: Record<string, string>
  emotes?: string | Record<string, string[]>
}

export default function ChatContainer() {
  const searchParams = useSearchParams()
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [channel, setChannel] = useState('')
  const clientRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isConnectingRef = useRef<boolean>(false)

  // Récupérer le paramètre limit de l'URL (par défaut: pas de limite)
  const messageLimit = searchParams.get('limit')
  const maxMessages = messageLimit ? parseInt(messageLimit, 10) : null

  // Récupérer le paramètre borderWidth de l'URL (par défaut: pas de limite de largeur)
  const borderWidthParam = searchParams.get('borderWidth')
  const borderWidth = borderWidthParam ? parseInt(borderWidthParam, 10) : null

  // Récupérer le paramètre fontSize de l'URL (par défaut: 16px)
  const fontSizeParam = searchParams.get('fontSize')
  const fontSize = fontSizeParam ? parseInt(fontSizeParam, 10) : 16

  // Récupérer le paramètre offsetLeft de l'URL (par défaut: 0px)
  const offsetLeftParam = searchParams.get('offsetLeft')
  const offsetLeft = offsetLeftParam ? parseInt(offsetLeftParam, 10) : 0

  // Récupérer le paramètre spaceBetween de l'URL (par défaut: 64px = 4rem)
  const spaceBetweenParam = searchParams.get('spaceBetween')
  const spaceBetween = spaceBetweenParam ? parseInt(spaceBetweenParam, 10) : 64

  // Récupérer le paramètre paddingTop de l'URL (par défaut: 64px = 4rem)
  const paddingTopParam = searchParams.get('paddingTop')
  const paddingTop = paddingTopParam ? parseInt(paddingTopParam, 10) : 64

  // Récupérer le paramètre messageTimeout de l'URL (par défaut: null = pas de timeout)
  const messageTimeoutParam = searchParams.get('messageTimeout')
  const messageTimeout = messageTimeoutParam ? parseInt(messageTimeoutParam, 10) : null

  // État pour les thèmes chargés depuis le fichier JSON
  const [themes, setThemes] = useState<any[]>([])
  const [themesLoaded, setThemesLoaded] = useState(false)
  
  // Charger les thèmes depuis le fichier JSON
  useEffect(() => {
    fetch(`${getBasePath()}/data/themes.json`)
      .then(response => response.json())
      .then(data => {
        setThemes(data.themes || [])
        setThemesLoaded(true)
      })
      .catch(error => {
        console.error('Erreur lors du chargement des thèmes:', error)
        setThemesLoaded(true)
      })
  }, [])
  
  // Obtenir la couleur de thème selon la date actuelle et les thèmes configurés
  const themeColor = themesLoaded ? getThemeColor(themes) : THEME_COLORS.default

  // Filtrer les messages selon la limite
  const displayedMessages = maxMessages 
    ? messages.slice(-maxMessages) 
    : messages

  const scrollToBottom = () => {
    // Ne pas faire défiler automatiquement - laisser les messages s'ajouter en dessous
    // Le premier message reste toujours en haut
  }

  useEffect(() => {
    // Ne pas faire défiler automatiquement
  }, [messages])

  // Fonction pour déconnecter toutes les connexions existantes
  const disconnectAll = () => {
    if (clientRef.current) {
      try {
        clientRef.current.removeAllListeners()
        clientRef.current.disconnect()
      } catch (err) {
        console.error('Erreur lors de la déconnexion:', err)
      }
      clientRef.current = null
    }
    setIsConnected(false)
    isConnectingRef.current = false
  }

  // Connexion automatique au chargement (une seule fois)
  useEffect(() => {
    if (TWITCH_CHANNEL) {
      // S'assurer qu'il n'y a aucune connexion existante
      disconnectAll()
      // Attendre un peu avant de se connecter pour s'assurer que la déconnexion est terminée
      setTimeout(() => {
        connectToChat(TWITCH_CHANNEL)
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectToChat = async (channelName: string) => {
    // Tuer toutes les connexions existantes avant de créer une nouvelle
    disconnectAll()

    // Attendre un peu pour s'assurer que la déconnexion est terminée
    await new Promise(resolve => setTimeout(resolve, 200))

    // Empêcher les connexions multiples pendant le processus de connexion
    if (isConnectingRef.current) {
      console.log('Une connexion est déjà en cours, annulation...')
      return
    }

    isConnectingRef.current = true

    const channelFormatted = channelName.startsWith('#')
      ? channelName
      : `#${channelName}`

    // Import dynamique de tmi.js
    const tmiModule = await import('tmi.js')
    const Client = (tmiModule as any).Client || (tmiModule as any).default?.Client || (tmiModule as any).default

    if (!Client) {
      console.error('Impossible de charger tmi.js')
      return
    }

    const client = new Client({
      options: { debug: false },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: 'justinfan12345',
        password: 'oauth:',
      },
      channels: [channelFormatted],
    })

    client.on('message', (channel: string, tags: any, message: string, self: boolean) => {
      // Ne pas afficher les messages de olympebat
      const username = (tags['display-name'] || tags.username || '').toLowerCase()
      if (username === 'olympebat') {
        console.log('💬 Message de olympebat:', message)
        return
      }
      
      // Ne pas afficher les commandes (messages commençant par !)
      const messageTrimmed = message.trim()
      if (messageTrimmed.startsWith('!')) {
        return
      }
      
      const chatMessage: ChatMessage = {
        id: `${tags.id || Date.now()}-${Math.random()}`,
        username: tags['display-name'] || tags.username || 'Anonymous',
        message: message,
        timestamp: new Date(parseInt(tags['tmi-sent-ts'] || Date.now().toString())),
        color: tags.color || '#FFFFFF',
        badges: tags.badges || {},
        emotes: tags.emotes || undefined,
      }
      setMessages((prev) => [...prev, chatMessage])
    })

    client.on('connected', () => {
      console.log('Connecté au chat Twitch:', channelName)
      setIsConnected(true)
      setChannel(channelName)
      isConnectingRef.current = false
    })

    client.on('disconnected', (reason: string) => {
      console.log('Déconnecté du chat:', reason)
      setIsConnected(false)
      isConnectingRef.current = false
      if (clientRef.current === client) {
        clientRef.current = null
      }
    })

    client.connect().catch((err: any) => {
      console.error('Erreur de connexion:', err)
      setIsConnected(false)
      isConnectingRef.current = false
      if (clientRef.current === client) {
        clientRef.current = null
      }
    })

    clientRef.current = client
  }

  const disconnectFromChat = () => {
    disconnectAll()
    setChannel('')
    setMessages([])
  }

  useEffect(() => {
    return () => {
      disconnectAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col h-screen relative">
      <div className="flex-1 flex flex-col w-full">
        <MessageList 
          messages={displayedMessages} 
          messagesEndRef={messagesEndRef} 
          borderWidth={borderWidth} 
          fontSize={fontSize} 
          offsetLeft={offsetLeft} 
          themeColor={themeColor}
          selectedTheme={undefined}
          spaceBetween={spaceBetween}
          paddingTop={paddingTop}
          messageTimeout={messageTimeout}
        />
      </div>
    </div>
  )
}

