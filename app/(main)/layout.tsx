import { ReactNode } from 'react'
import GoToTop, { FeedbackMobile } from "@/components/GoToTop"
import { JsonLd } from "../jsonid"
import Header from "../header"
import  Footer  from '@/components/layout/footer'


export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd />
      <GoToTop />
      <div className="lg:hidden md:hidden flex"><FeedbackMobile /></div>
      <Header />
      {children}
      <Footer />
    </>
  )
}