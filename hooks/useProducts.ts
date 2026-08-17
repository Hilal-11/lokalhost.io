"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

// ─── Shared base type from your DB schema ────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  icon_url: string | null
  thumbnail_url: string | null
  preview_images: string[] | null
  preview_video_url: string | null
  price: number
  is_free: boolean
  discount_price: number | null
  tech_stack: string[] | null
  platform: string[] | null
  category: string | null
  tags: string[] | null
  downloads: number
  views: number
  rating: number
  reviews_count: number
  features: string[] | null
  pages_count: number | null
  is_featured: boolean
  status: string
  docs_slug: string | null
  meta: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ─── Section types matching your sidebar ─────────────────────────────────────
export type SectionType = "apps" | "blocks" | "designs" | "screens"

const TABLE_MAP: Record<SectionType, string> = {
  apps: "apps",
  blocks: "blocks",
  designs: "designs",
  screens: "screens",
}

// ─── Generic hook — fetch all items for a section ────────────────────────────
export function useProducts(section: SectionType) {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    setLoading(true)
    setError(null)

    supabase
      .from(TABLE_MAP[section])
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setData(data ?? [])
        setLoading(false)
      })
  }, [section])

  return { data, loading, error }
}

// ─── Single product by slug ───────────────────────────────────────────────────
export function useProduct(section: SectionType, slug: string) {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    const supabase = createClient()
    setLoading(true)

    supabase
      .from(TABLE_MAP[section])
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setData(data)
        setLoading(false)
      })
  }, [section, slug])

  return { data, loading, error }
}