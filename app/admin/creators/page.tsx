import { isAdminHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminCreatorsPage() {
  const host = (await headers()).get('host') || ''
  
  if (!isAdminHost(host)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>404 - Not Found</h1>
        <p>Admin area is only accessible from the admin host.</p>
      </div>
    )
  }
  
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin - Creators</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Creator management coming soon.
      </p>
    </div>
  )
}


