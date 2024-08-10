import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import RootLayout from '@/app/layout'
import "./globals.css"
 
const Page: NextPageWithLayout = () => {
  return <p>hello world</p>
}
 
Page.getLayout = function getLayout(page: ReactElement) {
  return (
   <div>
   <RootLayout>
    {page}
   </RootLayout>
   </div>
  )
}
 
export default Page