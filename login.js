import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { useLang, t } from '@/lib/langStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { lang } = useLang()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      router.replace('/')
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 rounded-lg border border-white/10">
      <h1 className="text-xl font-semibold mb-4">
        {isSignup ? t(lang,'signup') : t(lang,'login')}
      </h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full bg-gray-800 border border-white/10 rounded px-3 py-2"
          placeholder={t(lang,'email')}
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          className="w-full bg-gray-800 border border-white/10 rounded px-3 py-2"
          placeholder={t(lang,'password')}
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full rounded bg-green-600 hover:bg-green-500 py-2">
          {isSignup ? t(lang,'signup') : t(lang,'login')}
        </button>
      </form>
      <div className="flex items-center gap-2 mt-4">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs opacity-60 uppercase">{t(lang,'or')}</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>
      <button
        onClick={()=>setIsSignup(!isSignup)}
        className="mt-3 w-full text-sm underline decoration-dotted"
      >
        {isSignup ? t(lang,'login') : t(lang,'signup')}
      </button>
      <button
        onClick={()=>router.push('/')}
        className="mt-3 w-full text-sm underline decoration-dotted"
      >
        {t(lang,'toDashboard')}
      </button>
    </div>
  )
}
