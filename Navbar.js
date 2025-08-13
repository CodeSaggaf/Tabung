import Link from 'next/link'
import { useLang, t } from '@/lib/langStore'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { lang, setLang } = useLang()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <nav className="w-full border-b border-white/10">
      <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-3">
        <img src="/logo.svg" alt="Tabung" className="w-7 h-7" />
        <Link href="/" className="text-xl font-semibold tracking-wide">Tabung</Link>
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-600/20 border border-green-500/40 text-green-300">
          {t(lang,'beta')}
        </span>
        <div className="ml-auto flex items-center gap-3">
          {mounted && (
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-gray-800 border border-white/10 rounded px-2 py-1 text-sm"
              aria-label={t(lang,'language')}
            >
              <option value="en">{t(lang,'english')}</option>
              <option value="bm">{t(lang,'malay')}</option>
            </select>
          )}
          <Link href="/feedback" className="text-sm underline decoration-dotted">
            {t(lang,'feedback')}
          </Link>
        </div>
      </div>
    </nav>
  )
}
