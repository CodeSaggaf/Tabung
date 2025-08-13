import '@/styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Tabung - Beta</title>
      </Head>

      {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
        <Script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />
      )}

      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Component {...pageProps} />
      </main>
    </>
  )
}
