import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import RootLayout from '@/app/layout'
import "./globals.css"
import { HomePage } from '@/components/drake_libs/component/home-page'
 
const Page: NextPageWithLayout = () => {
  return <>
    <HomePage />
  </>
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