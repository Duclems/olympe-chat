import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customNames } = body

    if (!Array.isArray(customNames)) {
      return NextResponse.json(
        { error: 'customNames doit être un tableau' },
        { status: 400 }
      )
    }

    // Construire le contenu CSV
    const csvLines = ['pseudonyme;rename']
    customNames.forEach(({ pseudonyme, rename }) => {
      if (pseudonyme && pseudonyme.trim()) {
        csvLines.push(`${pseudonyme.trim()};${(rename || '').trim()}`)
      }
    })

    const csvContent = csvLines.join('\n') + '\n'

    // Écrire dans le fichier data/custom-names.csv
    const filePath = join(process.cwd(), 'data', 'custom-names.csv')
    await writeFile(filePath, csvContent, 'utf-8')

    // Également écrire dans public/data/custom-names.csv pour le chargement côté client
    const publicFilePath = join(process.cwd(), 'public', 'data', 'custom-names.csv')
    await writeFile(publicFilePath, csvContent, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des custom names:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}
