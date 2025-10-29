import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import RootLayout from './layout'
import { ReactQueryProvider } from '@/lib/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
 
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
 
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => RootLayout({ children: page }))

  return (
    <ThemeProvider>
      <ReactQueryProvider>
        {getLayout(<Component {...pageProps} />)}
      </ReactQueryProvider>
     </ThemeProvider>
  )
}