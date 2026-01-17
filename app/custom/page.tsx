'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getBasePath } from '@/lib/basePath'

interface CustomName {
  pseudonyme: string
  rename: string
}

export default function CustomNamesPage() {
  const router = useRouter()
  const [customNames, setCustomNames] = useState<CustomName[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isProduction, setIsProduction] = useState(false)

  // Détecter si on est en production (sur GitHub Pages)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Si on est sur GitHub Pages, on a un basePath
      const basePath = getBasePath()
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      // On est en production si on a un basePath OU si on n'est pas sur localhost
      setIsProduction(basePath !== '' || (!isLocalhost && process.env.NODE_ENV === 'production'))
    }
  }, [])

  // Charger les custom names depuis le CSV
  useEffect(() => {
    fetch(`${getBasePath()}/data/custom-names.csv`)
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').filter(line => line.trim())
        const names: CustomName[] = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(';')
          if (values.length >= 2) {
            const pseudonyme = values[0].trim()
            const rename = values[1]?.trim() || ''
            if (pseudonyme) {
              names.push({ pseudonyme, rename })
            }
          }
        }

        setCustomNames(names)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erreur lors du chargement des custom names:', error)
        setLoading(false)
      })
  }, [])

  const handleAddRow = () => {
    setCustomNames([...customNames, { pseudonyme: '', rename: '' }])
  }

  const handleDeleteRow = (index: number) => {
    setCustomNames(customNames.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: 'pseudonyme' | 'rename', value: string) => {
    const updated = [...customNames]
    updated[index][field] = value
    setCustomNames(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Filtrer les lignes vides
      const validNames = customNames.filter(n => n.pseudonyme.trim())

      const response = await fetch(`${getBasePath()}/api/save-custom-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customNames: validNames }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pseudos sauvegardés avec succès !' })
        // Retirer les lignes vides après sauvegarde
        setCustomNames(validNames)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Erreur lors de la sauvegarde' })
      }
    } catch (error) {
      console.error('Erreur:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    } finally {
      setSaving(false)
    }
  }

  // Afficher un message si on est en production
  if (isProduction) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#1e0332' }}>
            Page non disponible
          </h1>
          <p className="text-xl mb-6" style={{ color: '#1e0332' }}>
            Cette page est uniquement disponible en développement local.
          </p>
          <p className="mb-6" style={{ color: '#666' }}>
            Pour gérer les pseudos personnalisés, veuillez exécuter l'application en local avec <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: '#1e0332', color: '#f5e7ff' }}
          >
            Retour au Chat
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: '#1e0332' }}>
            Gestion des Pseudos
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{ backgroundColor: '#1e0332', color: '#f5e7ff' }}
          >
            Retour au Chat
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={handleAddRow}
            className="px-4 py-2 rounded-lg font-semibold mr-2"
            style={{ backgroundColor: '#1e0332', color: '#f5e7ff' }}
          >
            + Ajouter un pseudo
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{
              backgroundColor: saving ? '#999' : '#7a0dc8',
              color: '#ffffff',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ border: '2px solid #1e0332' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e0332', color: '#f5e7ff' }}>
                <th className="p-3 text-left border" style={{ borderColor: '#1e0332' }}>
                  Pseudonyme Twitch
                </th>
                <th className="p-3 text-left border" style={{ borderColor: '#1e0332' }}>
                  Nom à afficher
                </th>
                <th className="p-3 text-center border" style={{ borderColor: '#1e0332', width: '100px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customNames.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center" style={{ color: '#1e0332' }}>
                    Aucun pseudo. Cliquez sur "Ajouter un pseudo" pour commencer.
                  </td>
                </tr>
              ) : (
                customNames.map((name, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                    <td className="p-3 border" style={{ borderColor: '#1e0332' }}>
                      <input
                        type="text"
                        value={name.pseudonyme}
                        onChange={(e) => handleChange(index, 'pseudonyme', e.target.value)}
                        placeholder="pseudonyme_twitch"
                        className="w-full p-2 rounded border"
                        style={{ borderColor: '#1e0332', color: '#1e0332' }}
                      />
                    </td>
                    <td className="p-3 border" style={{ borderColor: '#1e0332' }}>
                      <input
                        type="text"
                        value={name.rename}
                        onChange={(e) => handleChange(index, 'rename', e.target.value)}
                        placeholder="Nom à afficher (optionnel)"
                        className="w-full p-2 rounded border"
                        style={{ borderColor: '#1e0332', color: '#1e0332' }}
                      />
                    </td>
                    <td className="p-3 border text-center" style={{ borderColor: '#1e0332' }}>
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="px-3 py-1 rounded font-semibold"
                        style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f5e7ff', color: '#1e0332' }}>
          <p className="font-semibold mb-2">Instructions :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Le <strong>Pseudonyme Twitch</strong> est le nom exact de l'utilisateur sur Twitch (sensible à la casse)</li>
            <li>Le <strong>Nom à afficher</strong> est le nom qui remplacera le pseudonyme dans le chat (optionnel)</li>
            <li>Si le nom à afficher est vide, le pseudonyme original sera utilisé</li>
            <li>N'oubliez pas de cliquer sur "Sauvegarder" pour appliquer les modifications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
