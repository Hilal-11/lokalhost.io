// app/(mobile)/layout.tsx
import { ReactNode } from 'react'
import Header from "@/app/header"

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      {children}
    </>
  )
}