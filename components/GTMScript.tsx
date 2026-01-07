'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GTMScript() {
  const pathname = usePathname()
  const [gtmId, setGtmId] = useState<string | null>(null)

  useEffect(() => {
    // Extract introducer slug from path (e.g., /intro1, /intro2)
    const match = pathname?.match(/^\/([^\/]+)/)
    
    if (match && match[1].startsWith('intro')) {
      const introducerSlug = match[1]
      
      // Fetch introducer's GTM ID
      fetch(`/api/introducers/gtm?slug=${introducerSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.gtm_id) {
            setGtmId(data.gtm_id)
          } else {
            // Fallback to default GTM
            setGtmId(process.env.NEXT_PUBLIC_GTM_ID || null)
          }
        })
        .catch(() => {
          // Fallback to default GTM
          setGtmId(process.env.NEXT_PUBLIC_GTM_ID || null)
        })
    } else {
      // Use default GTM for non-introducer pages
      setGtmId(process.env.NEXT_PUBLIC_GTM_ID || null)
    }
  }, [pathname])

  useEffect(() => {
    // Push page views to dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: pathname,
      })
    }
  }, [pathname])

  if (!gtmId) return null

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

// Extend Window type for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
  }
}
