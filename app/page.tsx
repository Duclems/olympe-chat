'use client'

import { Suspense } from 'react'
import ChatContainer from '@/components/ChatContainer'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <Suspense fallback={<div className="h-screen" style={{ backgroundColor: 'transparent' }} />}>
        <ChatContainer />
      </Suspense>
    </main>
  )
}

