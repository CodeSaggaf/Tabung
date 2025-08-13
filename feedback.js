import { useState } from 'react'
import { useLang, t } from '@/lib/langStore'

export default function Feedback() {
  const [sent, setSent] = useState(false)
  const { lang } = useLang()
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{t(lang,'feedback')}</h1>
      {!formId && (
        <div className="p-3 mb-4 rounded bg-yellow-500/10 border border-yellow-500/40 text-yellow-200 text-sm">
          Set <code>NEXT_PUBLIC_FORMSPREE_ID</code> in your env to enable email submissions.
        </div>
      )}
      {!sent ? (
        <form
          action={formId ? `https://formspree.io/f/${formId}` : "#"}
          method="POST"
          onSubmit={()=>setSent(true)}
          className="space-y-3"
        >
          <input name="name" placeholder="Name" className="w-full bg-gray-800 border border-white/10 rounded px-3 py-2" />
          <input name="email" placeholder="Email" type="email" className="w-full bg-gray-800 border border-white/10 rounded px-3 py-2" />
          <textarea name="message" placeholder="Your message" className="w-full bg-gray-800 border border-white/10 rounded px-3 py-2 h-32" />
          <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">Send</button>
        </form>
      ) : (
        <p className="text-green-300">Thanks! Your feedback was submitted.</p>
      )}
      <p className="mt-6 text-sm opacity-70">Feedback will be emailed via Formspree. Suggested recipient: CodeSaggaf@gmail.com.</p>
    </div>
  )
}
