"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  IconDeviceMobile, IconLayoutGrid, IconPalette, IconDeviceTablet,
  IconChevronDown, IconSearch, IconCommand, IconX, IconAdjustmentsHorizontal,
  IconLayoutDashboard, IconPackage, IconChartBar, IconCreditCard,
  IconSettings, IconBell, IconHelp, IconBrandGithub, IconLogout,
  IconPin, IconHeart, IconActivity, IconTrendingUp,
  IconBrandApple, IconBrandAndroid, IconPlus,
  IconCarouselHorizontal, IconCards, IconToggleLeft,
  IconArrowBarUp, IconUserCircle, IconLayoutBottombar,
  IconBrandReact, IconBolt, IconBrandStripe, IconDatabase,
  IconSparkles, IconStar, IconCoin, IconDiscount2, IconCurrencyDollar,
  IconComponents, IconDeviceIpad, IconAppWindow, IconShieldLock,
  IconMoon, IconMap, IconBrandFlutter, IconFilter,
  IconArrowLeft, IconArrowRight, IconBox, IconTemplate, IconBrush, IconLayout,
  IconEye, IconCalendarTime, IconClock, IconCheck, IconPlayerPlay, IconDownload,
  IconLayoutNavbar, IconLoader2, IconLayoutList, IconBrandInstagram, IconWorld,
  IconMail, IconLink, IconExternalLink, IconBook, IconArticle,
  IconLock,
  IconRocket,
} from "@tabler/icons-react"
import { motion, AnimatePresence } from "motion/react"
import { useUser } from "@/hooks/useUser"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes"
import { Iphone } from "@/components/ui/iphone"
import { useProducts, type SectionType, type Product } from "@/hooks/useProducts"
import SocialDock from "@/components/landing/SocialDock"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarSection {
  key: SectionType
  label: string
  icon: React.ElementType
  defaultOpen: boolean
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { key: "apps",    label: "Mobile Apps", icon: IconDeviceMobile, defaultOpen: true  },
  { key: "blocks",  label: "UI Blocks",   icon: IconLayoutGrid,   defaultOpen: true  },
  { key: "designs", label: "UI Designs",  icon: IconPalette,      defaultOpen: true },
  { key: "screens", label: "UI Screens",  icon: IconDeviceTablet, defaultOpen: true },
]

// ─── Filter chip config ───────────────────────────────────────────────────────

const FILTER_GROUPS = [
  {
    label: "Platform", icon: IconDeviceMobile,
    chips: [
      { label: "React Native", icon: IconBrandReact },
      { label: "Flutter",      icon: IconBrandFlutter },
      { label: "iOS only",     icon: IconBrandApple },
      { label: "Android only", icon: IconBrandAndroid },
      { label: "Expo",         icon: IconBolt },
    ],
  },
  {
    label: "Price", icon: IconCoin,
    chips: [
      { label: "Free",     icon: IconCoin },
      { label: "On sale",  icon: IconDiscount2 },
      { label: "Under $25", icon: IconCurrencyDollar },
    ],
  },
  {
    label: "Highlights", icon: IconSparkles,
    chips: [
      { label: "Featured",      icon: IconStar },
      { label: "Top selling",   icon: IconTrendingUp },
      { label: "New this week", icon: IconBolt },
      { label: "Top rated",     icon: IconStar },
    ],
  },
  {
    label: "Type", icon: IconComponents,
    chips: [
      { label: "UI Blocks",  icon: IconComponents },
      { label: "UI Screens", icon: IconDeviceIpad },
      { label: "Full App",   icon: IconAppWindow },
    ],
  },
  {
    label: "Includes", icon: IconFilter,
    chips: [
      { label: "Dark mode",      icon: IconMoon },
      { label: "With auth",      icon: IconShieldLock },
      { label: "With payments",  icon: IconCreditCard },
      { label: "Maps",           icon: IconMap },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayPrice(product: Product) {
  if (product.is_free) return "Free"
  if (product.discount_price) return `$${product.discount_price}`
  return `$${product.price}`
}

function originalPrice(product: Product) {
  if (product.is_free || !product.discount_price) return null
  return `$${product.price}`
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800 ${className}`} />
  )
}

// ─── FiltersDialog ────────────────────────────────────────────────────────────

function FiltersDialog({ onClose }: { onClose: () => void }) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  const toggleFilter = (label: string) =>
    setActiveFilters(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-white/60 dark:bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[500px] bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <IconAdjustmentsHorizontal size={15} className="text-neutral-500 dark:text-neutral-400" />
            <span className="text-[13px] font-sans font-semibold text-neutral-800 dark:text-neutral-200">Filters</span>
            {activeFilters.size > 0 && (
              <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {activeFilters.size} active
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <IconX size={13} className="text-neutral-400" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-5">
          {FILTER_GROUPS.map(group => {
            const GroupIcon = group.icon
            return (
              <div key={group.label}>
                <p className="text-[11px] font-sans font-semibold text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-1.5">
                  <GroupIcon size={11} />{group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.chips.map(chip => {
                    const ChipIcon = chip.icon
                    const on = activeFilters.has(chip.label)
                    return (
                      <button
                        key={chip.label}
                        onClick={() => toggleFilter(chip.label)}
                        className={`flex items-center gap-1.5 text-[12px] font-sans px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                          on
                            ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-900 font-medium"
                            : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500"
                        }`}
                      >
                        <ChipIcon size={12} />{chip.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
          <button onClick={() => setActiveFilters(new Set())} className="text-[12px] font-sans text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            Clear all
          </button>
          <button onClick={onClose} className="text-[13px] font-sans font-semibold px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 transition-colors">
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── SearchDialog ─────────────────────────────────────────────────────────────

function SearchDialog({ onClose, products }: { onClose: () => void; products: Product[] }) {
  const [query, setQuery] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose])

  const filtered = products.filter(p =>
    query.length < 2 ||
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.category ?? "").toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  return (
    <>
      <AnimatePresence>
        {filtersOpen && <FiltersDialog onClose={() => setFiltersOpen(false)} />}
      </AnimatePresence>

      <div className="fixed inset-0 z-40 bg-white/60 dark:bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[600px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800">
            <IconSearch size={16} className="text-neutral-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search apps, blocks, screens…"
              className="flex-1 bg-transparent text-[14px] font-sans text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 outline-none"
            />
            <button
              onClick={e => { e.stopPropagation(); setFiltersOpen(true) }}
              className="flex items-center gap-1.5 text-[12px] font-sans px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-400 transition-all"
            >
              <IconAdjustmentsHorizontal size={13} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700">Esc</span>
          </div>

          <div className="max-h-[340px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-[13px] font-sans text-neutral-400 text-center py-8">No results found</p>
            ) : (
              filtered.map(product => (
                <motion.div
                  key={product.id}
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    {product.icon_url
                      ? <img src={product.icon_url} alt={product.name} className="w-full h-full object-cover" />
                      : <IconBox size={16} className="text-neutral-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-sans font-medium text-neutral-800 dark:text-neutral-200">{product.name}</p>
                    <p className="text-[11px] font-sans text-neutral-400">{product.category} · {product.tech_stack?.slice(0, 2).join(" · ")}</p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded px-1.5 py-0.5">
                    {displayPrice(product)}
                  </span>
                </motion.div>
              ))
            )}
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800">
            {[["↑↓", "navigate"], ["↵", "open"], ["Esc", "close"]].map(([k, l]) => (
              <span key={k} className="flex items-center gap-1 text-[11px] font-sans text-neutral-400">
                <kbd className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded px-1">{k}</kbd>
                {l}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  )
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

interface LeftSidebarProps {
  activeSection: SectionType
  activeSlug: string | null
  onSelect: (section: SectionType, slug: string) => void
  onSectionChange: (section: SectionType) => void
  sectionData: Record<SectionType, Product[]>
}

function LeftSidebar({ activeSection, activeSlug, onSelect, onSectionChange, sectionData }: LeftSidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(SIDEBAR_SECTIONS.map(s => [s.key, s.defaultOpen]))
  )
  const { theme, setTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User"
  const initials    = displayName.slice(0, 2).toUpperCase()
  const avatarUrl   = user?.user_metadata?.avatar_url as string | undefined

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div className="w-[260px] flex-shrink-0 h-screen flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        {/* Back to home */}
        
        <Link href="/"
          className="group inline-flex items-center gap-1.5 text-[11px] font-sans text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 mb-3"
        >
          <IconArrowLeft
            size={13}
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          />
          Back to home
        </Link>

        {/* Brand */}
        <span className="font-sans font-bold text-[15px] text-neutral-900 dark:text-neutral-100 tracking-tight block">
          lokalhost<span className="text-neutral-400 dark:text-neutral-500">.io</span>
        </span>
        <p className="text-[12px] font-sans text-neutral-400 dark:text-neutral-500 mt-0.5">Mobile resources</p>

        <div className="h-px mt-4 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Tree nav */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-1 space-y-0.5">
        {SIDEBAR_SECTIONS.map(section => {
          const Icon    = section.icon
          const isOpen  = open[section.key]
          const items   = sectionData[section.key] ?? []

          return (
            <div key={section.key}>
              {/* Section header */}
              <button
                onClick={() => {
                  setOpen(p => ({ ...p, [section.key]: !p[section.key] }))
                  onSectionChange(section.key)
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors duration-150 group"
              >
                <Icon size={15} className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 flex-shrink-0 transition-colors" />
                <span className="text-[12.5px] font-sans font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 flex-1 text-left transition-colors">
                  {section.label}
                </span>
                <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                  <IconChevronDown size={13} className="text-neutral-400 dark:text-neutral-600" />
                </motion.div>
              </button>

              {/* Items */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 mt-0.5 pl-1 border-l border-neutral-200 dark:border-neutral-800 pb-1">
                      {items.length === 0 ? (
                        // Skeleton placeholders while loading
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-2">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-3 flex-1 rounded" />
                          </div>
                        ))
                      ) : (
                        <>
                          {/* "All" item */}
                          <motion.button
                            onClick={() => onSectionChange(section.key)}
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-lg text-left transition-colors duration-150 group/item ${
                              activeSection === section.key && activeSlug === null
                                ? "bg-neutral-200 dark:bg-neutral-800"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                            }`}
                          >
                            <IconLayoutList size={14} className={`flex-shrink-0 transition-colors ${activeSection === section.key && activeSlug === null ? "text-neutral-700 dark:text-neutral-200" : "text-neutral-400 dark:text-neutral-500"}`} />
                            <span className={`text-[13px] font-sans flex-1 truncate transition-colors ${activeSection === section.key && activeSlug === null ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-600 dark:text-neutral-400"}`}>
                              All {section.label}
                            </span>
                          </motion.button>
                          {items.map(item => {
                          const isActive = activeSection === section.key && activeSlug === item.slug
                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => onSelect(section.key, item.slug)}
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-lg text-left transition-colors duration-150 group/item ${
                                isActive
                                  ? "bg-neutral-200 dark:bg-neutral-800"
                                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                              }`}
                            >
                              <Icon size={14} className={`flex-shrink-0 transition-colors ${isActive ? "text-neutral-700 dark:text-neutral-200" : "text-neutral-400 dark:text-neutral-500"}`} />
                              <span className={`text-[13px] font-sans flex-1 truncate transition-colors ${isActive ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-600 dark:text-neutral-400"}`}>
                                {item.name}
                              </span>
                              {item.discount_price && (
                                <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex-shrink-0">
                                  SALE
                                </span>
                              )}
                            </motion.button>
                          )
                        })}
                        </>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* User profile */}
      <div ref={profileRef} className="relative border-t border-neutral-200 dark:border-neutral-800 px-3 py-3 flex-shrink-0">
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-full left-2 right-2 mb-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* User info */}
              <div className="p-3.5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {avatarUrl
                      ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      : <span className="text-[13px] font-bold text-neutral-600 dark:text-neutral-300">{initials}</span>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-sans font-semibold text-neutral-800 dark:text-neutral-200 truncate">{displayName}</p>
                    <p className="text-[11px] font-sans text-neutral-400 truncate">{user?.email}</p>
                  </div>
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Admin</span>
                </div>
              </div>

              {/* Menu */}
              <div className="py-1.5 px-1.5 space-y-0.5">
                {[
                  { icon: IconLayoutDashboard, label: "Dashboard",     href: "/dashboard" },
                  { icon: IconPackage,         label: "My Products",   href: "/products" },
                  { icon: IconChartBar,        label: "Analytics",     href: "/analytics" },
                  { icon: IconCreditCard,      label: "Billing",       href: "/billing" },
                  { icon: IconSettings,        label: "Settings",      href: "/settings" },
                  { icon: IconBell,            label: "Notifications", href: "/notifications", badge: 3 },
                  { icon: IconHelp,            label: "Help & Docs",   href: "/docs" },
                  { icon: IconBrandGithub,     label: "GitHub",        href: "#", external: true },
                ].map(item => {
                  const MenuIcon = item.icon
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 group/menu"
                    >
                      <MenuIcon size={14} className="text-neutral-400 group-hover/menu:text-neutral-700 dark:group-hover/menu:text-neutral-300 transition-colors flex-shrink-0" />
                      <span className="text-[13px] font-sans text-neutral-700 dark:text-neutral-300 group-hover/menu:text-neutral-900 dark:group-hover/menu:text-neutral-100 flex-1 transition-colors">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {item.badge}
                        </span>
                      )}
                      {item.external && <span className="text-[11px] text-neutral-400">↗</span>}
                    </motion.a>
                  )
                })}
              </div>

              {/* Theme switcher */}
              <div className="px-3 py-2.5 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-sans text-neutral-500 dark:text-neutral-400 flex-1">Theme</span>
                  <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    {(["light", "dark", "system"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`text-[11px] font-sans px-2.5 py-1 capitalize transition-all ${
                          theme === t
                            ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logout */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 p-1.5">
                <motion.button
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group/logout"
                >
                  <IconLogout size={14} className="text-neutral-400 group-hover/logout:text-neutral-700 dark:group-hover/logout:text-neutral-300 transition-colors" />
                  <span className="text-[13px] font-sans text-neutral-600 dark:text-neutral-400 group-hover/logout:text-neutral-900 dark:group-hover/logout:text-neutral-100 transition-colors">
                    Log out
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setProfileOpen(v => !v)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              : <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{initials}</span>
            }
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-sans font-medium text-neutral-800 dark:text-neutral-200 truncate">{displayName}</p>
            <p className="text-[11px] font-sans text-neutral-400 truncate">{user?.email}</p>
          </div>
          <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <IconChevronDown size={13} className="text-neutral-400" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  )
}

// ─── Middle Column ────────────────────────────────────────────────────────────

interface MiddleColumnProps {
  section: SectionType
  activeSlug: string | null
  product: Product | null
  onSelect: (section: SectionType, slug: string) => void
  onOpenSearch: () => void
  onBack: () => void
}

const SECTION_LABEL: Record<SectionType, string> = {
  apps:    "Mobile Apps",
  blocks:  "UI Blocks",
  designs: "UI Designs",
  screens: "UI Screens",
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5 border-b border-r border-neutral-200 dark:border-neutral-800">
      <Skeleton className="w-full aspect-[9/16] max-w-[200px] mx-auto" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  )
}

function MiddleColumn({ section, activeSlug, product, onSelect, onOpenSearch, onBack }: MiddleColumnProps) {
  const { data: products, loading } = useProducts(section)
  const [filtersOpen, setFiltersOpen] = useState(false)


  return (
    <div className="flex-1 min-w-0 h-screen flex flex-col border-r border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-black">
      <AnimatePresence>
        {filtersOpen && <FiltersDialog onClose={() => setFiltersOpen(false)} />}
      </AnimatePresence>

      {/* Sticky top bar */}
      <div className="flex-shrink-0 px-4 pt-4 pb-0 bg-white dark:bg-black border-b border-neutral-100 dark:border-neutral-800">
        {/* Search bar */}
        <div className="flex items-center gap-2 pb-3">
          <button
            onClick={onOpenSearch}
            className="flex-1 h-10 flex items-center gap-3 px-3.5 py-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all text-left"
          >
            <IconSearch size={15} className="text-neutral-400 flex-shrink-0" />
            <span className="flex-1 text-[13px] font-sans text-neutral-400">Search {SECTION_LABEL[section].toLowerCase()}…</span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-1.5 py-0.5">
              <IconCommand size={10} />K
            </span>
          </button>
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center justify-center w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-400 transition-colors"
          >
            <IconAdjustmentsHorizontal size={20} className="text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-8 pt-4">
        {product ? (
          <ProductDetailView product={product} section={section} onBack={onBack} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden divide-x divide-y divide-neutral-200 dark:divide-neutral-800">
                  {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <IconBox size={32} className="text-neutral-300 dark:text-neutral-700" />
                  <p className="text-[14px] font-sans text-neutral-400">No {SECTION_LABEL[section].toLowerCase()} yet</p>
                </div>
              ) : (
                <>
                    <>
                      <p className="text-[11px] font-sans font-semibold  tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">
                        ✦ Featured
                      </p>
                      <div className="grid grid-cols-2 xl:grid-cols-3 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden divide-x divide-y divide-neutral-200 dark:divide-neutral-800 mb-6">
                        {products.map((product, i) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isActive={activeSlug === product.slug}
                            index={i}
                            section={section}
                            onSelect={onSelect}
                          />
                        ))}
                      </div>
                    </>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product
  isActive: boolean
  index: number
  section: SectionType
  onSelect: (section: SectionType, slug: string) => void
}

function ProductCard({ product, isActive, index, section, onSelect }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={() => onSelect(section, product.slug)}
      className={`w-full group cursor-pointer flex flex-col items-center justify-center gap-4 p-2 transition-colors duration-200 ${
        isActive
          ? "bg-neutral-50 dark:bg-neutral-900/80"
          : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
      }`}
    >
      {/* Featured badge */}
      {product.is_featured && (
        <span className="self-end text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r from-orange-500 to-red-500 font-mono">
          Featured
        </span>
      )}

      <div className="w-full flex flex-wrap justify-center items-center rounded-xl overflow-hidden mx-auto">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 * 0.04 }}
          className="mx-auto w-full group cursor-pointer flex flex-wrap justify-center flex-col items-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors duration-200"
        >
          {/* iPhone mockup */}
          <div className="w-[280px] relative mx-auto flex justify-center overflow-hidden items-center">
            <Iphone
              videoSrc="/keepVideo.mp4"
              className="w-full h-full"
            />
          </div>
        </motion.div>
    </div>

      {/* Info */}
      <div className="w-full space-y-2 px-5 relative">
        <div className="flex items-center gap-2 relative">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            {product.icon_url
              ? <img src={product.icon_url} alt={product.name} className="w-full h-full object-cover" />
              : <IconBox size={14} className="text-neutral-400" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-sans font-semibold text-neutral-800 dark:text-neutral-200 truncate leading-tight">
              {product.name}
            </p>
            <p className="text-[10px] font-sans text-neutral-400 truncate">{product.category}</p>
          </div>
        </div>

        {product.tagline && (
          <p className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
            {product.tagline}
          </p>
        )}

        {/* Stack pills */}
        {product.tech_stack && product.tech_stack.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {product.tech_stack.slice(0, 3).map(s => (
              <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price + platform */}
        <div className="absolute top-0 right-0 flex-col items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {originalPrice(product) && (
              <span className="text-[11px] text-neutral-400 line-through font-mono">{originalPrice(product)}</span>
            )}
            <span className="text-[13px] font-semibold font-mono text-neutral-800 dark:text-neutral-200">
              {displayPrice(product)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {product.platform?.includes("iOS") && <IconBrandApple size={12} className="text-neutral-400" />}
            {product.platform?.includes("Android") && <IconBrandAndroid size={12} className="text-neutral-400" />}
            <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <IconArrowRight size={12} className="text-neutral-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return Intl.NumberFormat().format(n)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

// ─── Product Detail View (middle column) ──────────────────────────────────────

function ProductDetailView({ product, section, onBack }: { product: Product; section: SectionType; onBack: () => void }) {
  const [selectedImage, setSelectedImage] = useState(0)

  const hasVideo = !!product.preview_video_url
  const images = product.preview_images ?? []
  const hasGallery = hasVideo || images.length > 0

  return (
    <div className="w-full mx-auto space-y-6 p-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] font-sans text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors group"
      >
        <IconArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Back to all
      </button>
       {/* ── IMAGE GALLERY ── */}
        {hasGallery && (
          <div className="space-y-3">
            {hasVideo ? (
              <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <video
                  src={product.preview_video_url!}
                  className="w-full h-auto object-cover bg-neutral-100 dark:bg-neutral-900"
                  autoPlay loop muted playsInline
                />
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-mono flex items-center gap-1.5">
                  <IconPlayerPlay size={11} /> Preview
                </div>
              </div>
            ) : images.length === 1 ? (
              <div className="rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 bg-neutral-100 dark:bg-neutral-900 flex items-end justify-center min-h-[300px] max-h-[780px] pt-5 px-5">
                <img
                  src={images[0]}
                  alt=""
                  className="w-full h-full object-contain max-h-[780px] rounded-t-[2rem]"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Main image */}
                <div className="rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 bg-neutral-100 dark:bg-neutral-900 flex items-end justify-center min-h-[300px] max-h-[780px] pt-5 px-5">
                  <img
                    src={images[selectedImage]}
                    alt=""
                    className="w-full h-full object-contain max-h-[780px] transition-opacity duration-300 rounded-t-[2rem]"
                  />
                </div>
                {/* Thumbnails */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide mt-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-14 h-24 rounded-xl transition-all duration-200 bg-neutral-100 dark:bg-neutral-800 flex items-end justify-center pt-1.5 px-1.5 ${
                        i === selectedImage
                          ? "ring-2 ring-neutral-900 dark:ring-neutral-100 shadow-md scale-105"
                          : "ring-1 ring-neutral-200 dark:ring-neutral-700 opacity-50 hover:opacity-90 hover:shadow-sm"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain rounded-t-[0.6rem]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* Fallback: thumbnail_url */}
      {!hasGallery && product.thumbnail_url && (
        <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/10">
          <img src={product.thumbnail_url} alt={product.name} className="w-full max-h-64 object-cover bg-neutral-100 dark:bg-neutral-900" />
        </div>
      )}

      {/* ── MAIN TWO-COLUMN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* ─── LEFT COLUMN (3/5) ─── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700 overflow-hidden">
              {product.icon_url
                ? <img src={product.icon_url} alt={product.name} className="w-full h-full object-cover" />
                : <IconBox size={24} className="text-neutral-400" />
              }
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[20px] font-sans font-bold text-neutral-900 dark:text-neutral-100 leading-tight tracking-tight">
                  {product.name}
                </p>
                {product.is_featured && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm font-mono">
                    Featured
                  </span>
                )}
              </div>
              {product.tagline && (
                <p className="text-[13px] font-sans text-neutral-400 mt-1 leading-snug">{product.tagline}</p>
              )}
              {product.category && (
                <span className="inline-block mt-2 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 ring-1 ring-neutral-200 dark:ring-neutral-700">
                  {product.category}
                </span>
              )}
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700 hover:shadow-md hover:ring-neutral-300 dark:hover:ring-neutral-600 transition-all active:scale-[0.97]">
              <IconDownload size={14} className="text-neutral-500" />
              <span className="text-[12px] font-sans font-medium text-neutral-700 dark:text-neutral-300">Download Code</span>
            </button>
            <a href="#" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700 hover:shadow-md hover:ring-neutral-300 dark:hover:ring-neutral-600 transition-all active:scale-[0.97]">
              <IconBrandGithub size={14} className="text-neutral-500" />
              <span className="text-[12px] font-sans font-medium text-neutral-700 dark:text-neutral-300">View on GitHub</span>
            </a>
            {product.docs_slug && (
              <a href={`/docs/${product.docs_slug}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700 hover:shadow-md hover:ring-neutral-300 dark:hover:ring-neutral-600 transition-all active:scale-[0.97]">
                <IconBook size={14} className="text-neutral-500" />
                <span className="text-[12px] font-sans font-medium text-neutral-700 dark:text-neutral-300">View Docs</span>
              </a>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-[10px] font-mono font-semibold text-neutral-400  tracking-widest mb-2">About</p>
              <p className="text-[13px] font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <p className="text-[10px] font-mono font-semibold text-neutral-400  tracking-widest mb-2.5">Features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 ring-1 ring-orange-200 dark:ring-orange-800">
                      <IconCheck size={10} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-[12px] font-sans text-neutral-600 dark:text-neutral-400 leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <p className="text-[10px] font-mono font-semibold text-neutral-400  tracking-widest mb-2.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map(t => (
                  <span key={t} className="text-[10px] font-sans px-3 py-1 rounded-full bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ─── RIGHT COLUMN (2/5) ─── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Price Card */}
          <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <p className="text-[10px] font-mono  tracking-widest text-neutral-400 mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                {originalPrice(product) && (
                  <span className="text-[14px] text-neutral-400 line-through font-mono">{originalPrice(product)}</span>
                )}
                <span className="text-[28px] font-bold font-mono text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {displayPrice(product)}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <button className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[14px] font-sans font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
                Purchase Now
              </button>
              {product.pages_count != null && (
                <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700">
                  <IconLayoutList size={13} className="text-neutral-400" />
                  <span className="text-[12px] font-mono text-neutral-600 dark:text-neutral-400">{product.pages_count} pages included</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Rating",   value: product.rating.toString(), icon: IconStar,        suffix: "" },
              { label: "Downloads", value: formatNumber(product.downloads), icon: IconTrendingUp,   suffix: "" },
              { label: "Reviews",  value: formatNumber(product.reviews_count), icon: IconHeart,      suffix: "" },
              { label: "Views",    value: formatNumber(product.views), icon: IconEye,        suffix: "" },
            ].map(s => {
              const StatIcon = s.icon
              return (
                <div key={s.label} className="bg-white dark:bg-neutral-900 rounded-xl p-3.5 text-center shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
                  <StatIcon size={15} className="text-neutral-400 mx-auto mb-1.5" />
                  <p className="text-[20px] font-bold font-mono text-neutral-900 dark:text-neutral-100 leading-none">
                    {s.value}{s.suffix}
                  </p>
                  <p className="text-[9px] font-sans text-neutral-400  tracking-wider mt-1">{s.label}</p>
                </div>
              )
            })}
          </div>

          {/* Tech Stack */}
          {product.tech_stack && product.tech_stack.length > 0 && (
            <div className="rounded-xl bg-white dark:bg-neutral-900 p-3.5 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
              <p className="text-[9px] font-mono font-semibold text-neutral-400  tracking-widest mb-2.5">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {product.tech_stack.map(s => (
                  <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 ring-1 ring-neutral-200 dark:ring-neutral-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Platform */}
          {product.platform && product.platform.length > 0 && (
            <div className="rounded-xl bg-white dark:bg-neutral-900 p-3.5 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
              <p className="text-[9px] font-mono font-semibold text-neutral-400  tracking-widest mb-2.5">Platform</p>
              <div className="flex flex-wrap gap-2">
                {product.platform.map(p => {
                  const isIos = p.toLowerCase() === "ios"
                  return (
                    <div key={p} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700">
                      {isIos ? <IconBrandApple size={12} className="text-neutral-500" /> : <IconBrandAndroid size={12} className="text-neutral-500" />}
                      <span className="text-[11px] font-sans text-neutral-600 dark:text-neutral-400">{p}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="rounded-xl bg-white dark:bg-neutral-900 p-3.5 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 space-y-2.5">
            <p className="text-[9px] font-mono font-semibold text-neutral-400  tracking-widest">Details</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center ring-1 ring-neutral-200 dark:ring-neutral-700 flex-shrink-0">
                  <IconCalendarTime size={11} className="text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-mono text-neutral-400  tracking-wider">Released</p>
                  <p className="text-[12px] font-mono text-neutral-700 dark:text-neutral-300 truncate">{formatDate(product.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center ring-1 ring-neutral-200 dark:ring-neutral-700 flex-shrink-0">
                  <IconClock size={11} className="text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-mono text-neutral-400  tracking-wider">Updated</p>
                  <p className="text-[12px] font-mono text-neutral-700 dark:text-neutral-300 truncate">{formatDate(product.updated_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center ring-1 ring-neutral-200 dark:ring-neutral-700 flex-shrink-0">
                  <IconBox size={11} className="text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-mono text-neutral-400  tracking-wider">Status</p>
                  <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full mt-0.5 ${
                    product.status === "published"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800"
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Right Panel ─────────────────────────────────────────────────────────────

function RightPanel() {
  const links = [
    { label: "Web Components", href: "/components", icon: IconComponents },
    { label: "Pricing",        href: "/pricing",    icon: IconCreditCard },
    { label: "Templates",      href: "/templates",  icon: IconTemplate },
    { label: "Documentation",  href: "/docs",       icon: IconBook },
    { label: "Blog",           href: "/blog",       icon: IconArticle },
  ]

  const socialLinks = [
    { label: "GitHub",    href: "https://github.com/hila-11",       icon: IconBrandGithub },
    { label: "Instagram", href: "https://instagram.com/hila_11",    icon: IconBrandInstagram },
    { label: "Website",   href: "https://hila-11.com",              icon: IconWorld },
    { label: "Email",     href: "mailto:hello@hila-11.com",         icon: IconMail },
  ]

  return (
    <div className="w-[280px] flex-shrink-0 h-screen flex flex-col bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-5 space-y-6">

        {/* Navigation */}
        <div>
          <p className="text-[11px] font-sans font-semibold text-neutral-400 tracking-widest mb-3">PAGES</p>
          <div>
            {links.map(link => {
              const Icon = link.icon
              return (
                
                <a key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                >
                  <Icon size={15} className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 flex-shrink-0 transition-colors" />
                  <span className="text-[12.5px] font-sans text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 flex-1 transition-colors">
                    {link.label}
                  </span>
                  <IconExternalLink size={12} className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 transition-colors flex-shrink-0" />
                </a>
              )
            })}
          </div>
        </div>

        {/* ── PROMO BOXES ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-sans font-semibold text-neutral-400 tracking-widest">EXPLORE</p>

          {/* Templates box */}
          
            <a href="/templates"
            className="group block relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-950"
          >
            {/* gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-yellow-950/20" />
            {/* decorative blobs */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-orange-300/40 to-yellow-300/30 blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400/20 to-orange-300/10 blur-lg" />

            <div className="relative p-4">
              {/* icon badge */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200 dark:shadow-orange-900 mb-3">
                <IconTemplate size={17} className="text-white" />
              </div>
              <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 leading-tight mb-1">
                Ready-made Templates
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug mb-3">
                Launch faster with production-ready Next.js templates built for real products.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400 group-hover:gap-2.5 transition-all duration-200">
                Browse Templates <IconArrowRight size={12} />
              </span>
            </div>
          </a>

          {/* Components box */}
          
          <a href="/docs/components"
            className="group block relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-100 dark:hover:shadow-cyan-950">
            {/* gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/40 dark:via-sky-950/30 dark:to-blue-950/20" />
            {/* decorative blobs */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-300/40 to-sky-300/30 blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400/20 to-cyan-300/10 blur-lg" />

            <div className="relative p-4">
              {/* icon badge */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-md shadow-cyan-200 dark:shadow-cyan-900 mb-3">
                <IconComponents size={17} className="text-white" />
              </div>
              <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 leading-tight mb-1">
                UI Components
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug mb-3">
                Copy-paste web components crafted with Tailwind & Framer Motion. Free + Pro.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 group-hover:gap-2.5 transition-all duration-200">
                Explore Components <IconArrowRight size={12} />
              </span>
            </div>
          </a>
          {/* Boilerplates box — coming soon */}
          <div className="group relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 cursor-not-allowed">
            {/* coming soon pill */}
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-700">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Coming Soon
              </span>
            </div>

            <div className="relative p-4 opacity-75">
              {/* icon badge */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md shadow-violet-200 dark:shadow-violet-900 mb-3">
                <IconRocket size={17} className="text-white" />
              </div>
              <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 leading-tight mb-1">
                SaaS Boilerplates
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug mb-3">
                Full-stack SaaS starters with auth, billing, and DB — ship your idea in hours.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-400 dark:text-violet-500">
                <IconLock size={11} /> Launching soon
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Footer: social dock */}
      <div className="flex-shrink-0 px-4 py-4 space-y-3">
        <div className="flex items-center gap-1">
          <SocialDock />
        </div>
      </div>
    </div>
  )
}

// ─── Root page — data orchestration ──────────────────────────────────────────

export const dynamic = "force-dynamic"

function Mobile() {
  const [activeSection, setActiveSection] = useState<SectionType>("apps")
  const [activeSlug, setActiveSlug]       = useState<string | null>(null)
  const [searchOpen, setSearchOpen]       = useState(false)
  const { user } = useUser()

  // Pre-fetch all sections for the sidebar tree
  const appsData    = useProducts("apps")
  const blocksData  = useProducts("blocks")
  const designsData = useProducts("designs")
  const screensData = useProducts("screens")

  const sectionData: Record<SectionType, Product[]> = {
    apps:    appsData.data,
    blocks:  blocksData.data,
    designs: designsData.data,
    screens: screensData.data,
  }

  const totals = {
    apps:    appsData.data.length,
    blocks:  blocksData.data.length,
    designs: designsData.data.length,
    screens: screensData.data.length,
  }

  // Currently selected product (for middle column)
  const allProducts = sectionData[activeSection]
  const activeProduct = activeSlug ? allProducts.find(p => p.slug === activeSlug) ?? null : null

  const handleSelect = useCallback((section: SectionType, slug: string) => {
    setActiveSection(section)
    setActiveSlug(slug)
  }, [])

  const handleSectionChange = useCallback((section: SectionType) => {
    setActiveSection(section)
    setActiveSlug(null)
  }, [])

  // ⌘K shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [])

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      <AnimatePresence>
        {searchOpen && (
          <SearchDialog
            onClose={() => setSearchOpen(false)}
            products={allProducts}
          />
        )}
      </AnimatePresence>

      <LeftSidebar
        activeSection={activeSection}
        activeSlug={activeSlug}
        onSelect={handleSelect}
        onSectionChange={handleSectionChange}
        sectionData={sectionData}
      />

      <MiddleColumn
        section={activeSection}
        activeSlug={activeSlug}
        product={activeProduct}
        onSelect={handleSelect}
        onOpenSearch={() => setSearchOpen(true)}
        onBack={() => setActiveSlug(null)}
      />

      <RightPanel />
    </div>
  )
}

export default Mobile