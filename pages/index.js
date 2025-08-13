import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import Savings from '@/components/Savings'
import { useRouter } from 'next/router'
import { useLang, t } from '@/lib/langStore'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { lang } = useLang()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }
      setUser(session.user)
      setLoading(false)
    }
    init()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login')
      else setUser(session.user)
    })
    return () => subscription.unsubscribe()
  }, [router])

  if (loading) return <p className="opacity-70">Loading…</p>

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-800 border border-white/10">
          {t(lang,'logout')}
        </button>
      </div>
      <Savings user={user} />
    </div>
  )
}
