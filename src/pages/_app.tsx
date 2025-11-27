import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import RootLayout from './layout'
import { ReactQueryProvider } from '@/lib/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '@/lib/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()
 
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  emotionCache?: EmotionCache
}
 
export default function MyApp({ Component, pageProps, router, emotionCache = clientSideEmotionCache }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => RootLayout({ children: page }))

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider>
        <ReactQueryProvider>
          {getLayout(<Component {...pageProps} key={router.asPath} />)}
        </ReactQueryProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}