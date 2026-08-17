"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface Template {
  id: string
  template_name: string
  template_images: string[]
  template_price: string
}

async function fetchTemplates(): Promise<Template[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('templates')
    .select('id, template_name, template_images, template_price')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

const TemplatesBlockList = () => {
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  })

  if (isLoading) {
  return (
    <div className="w-full container max-w-[1580px] pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 animate-pulse"
          >
            {/* inner image box */}
            <div className="w-full h-[220px] rounded-xl bg-neutral-200 dark:bg-neutral-900" />

            {/* footer */}
            <div className="flex items-center justify-between pt-3 px-1">
              <div className="flex items-center gap-2">
                {/* browser dots */}
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-800" />
                </div>
                <div className="h-2 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              </div>
              <div className="h-4 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
  if (error) return (
    <div className="py-20 text-center">
      <p className="text-sm font-mono text-red-400">Error loading templates.</p>
    </div>
  )

  if (!templates || templates.length === 0) return (
    <div className="py-20 text-center">
      <p className="text-sm font-mono text-neutral-400">No templates found.</p>
    </div>
  )

  return (
    <div className="w-full container max-w-[1580px] pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {templates.map((template) => (
          <Link
            key={template.id}
            href={`/templates/template/${template.id}`}
            className={cn(
              "group relative flex flex-col",
              // ── Outer card (the mat/frame) ──
              "rounded-2xl p-3",
              "bg-neutral-50 dark:bg-neutral-900",
              "border border-neutral-200/80 dark:border-neutral-800",
              "shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]",
              "dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
              "hover:border-neutral-300 dark:hover:border-neutral-700",
              "hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
              "dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
              "hover:-translate-y-1",
              "transition-all duration-300 ease-out"
            )}
          >
            {/* ── Inner image box (floats inside the mat) ── */}
            <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700">
              {template.template_images?.[0] ? (
               <Image
                src={template.template_images[0]}
                alt={template.template_name}
                width={400}
                height={300}
                className="w-full object-cover transition-transform duration-500 absolute -top-10"
              />  
                ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono text-neutral-400">No preview</span>
                </div>
              )}

              {/* bottom fade inside inner box */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none" />

              {/* Hover overlay */}
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-neutral-950/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                  View Template →
                </span>
              </div>
            </div>

            {/* ── Footer inside outer card ── */}
            <div className="flex items-center justify-between pt-3 px-1">
              <div className="flex items-center gap-2 min-w-0">
                {/* browser dots */}
                <div className="flex gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-300 dark:bg-red-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 dark:bg-yellow-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 dark:bg-green-800" />
                </div>
                <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 truncate">
                  {template.template_name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TemplatesBlockList