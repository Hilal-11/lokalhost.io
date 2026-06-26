"use client"
import { useRef } from "react"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdSearch } from "react-icons/io";
import TemplateShimmerLoadingUI from '@/components/templateShimmerLoadingUI';
import { LuFigma } from "react-icons/lu";
import AnnoncementBadge from "@/components/landing/AnnoncementBadge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import react from "@/public/tech/react.jpeg"
import next from "@/public/tech/next.jpeg"
import tailwindX from "@/public/tech/tailwindX.webp"
import shadcn from "@/public/tech/shadcn.jpeg"
import ts from "@/public/tech/ts.jpeg"
import js from "@/public/tech/js.jpeg"
import { HiArrowNarrowRight } from "react-icons/hi";
import HoverExternalIcon from "@/components/landing/MicroComponents/HoverExternalIcon";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { motion, AnimatePresence } from "motion/react"
import { useQuery } from '@tanstack/react-query'; // ← Keep this as useQuery
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { IoSearchSharp } from 'react-icons/io5';
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RxCross2 } from 'react-icons/rx'
import { LuLayoutTemplate } from 'react-icons/lu'

import { SortTemplates } from "./sortTemplates";
import CTA from "@/components/landing/CTA";
import { usePathname } from "next/navigation";
import { Highlighter } from "@/components/ui/highlighter"
const techStackImages = [
    react,
    next,
    tailwindX,
    shadcn,
    ts,
    js,
]

interface AuthState {
  isLoggedIn: boolean;
  user: { name?: string; email?: string } | null;
  loading: boolean;
}

function Templates(){
    const convex = useConvex();
    
    const { data: templates, isLoading, isFetching, dataUpdatedAt } = useQuery({
        queryKey: ['templates'] as const,
        queryFn: async () => {
            const result = await convex.query(api.getTemplates.getTemplates);
            return result;
        },
    });
    const [searchQuery, setSearchQuery]     = useState('')
    const [filteredItems, setFilteredItems] = useState(templates ?? [])
    const [open, setOpen]                   = useState(false)
    const [focused, setFocused]             = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [activeFilter, setActiveFilter] = useState<'All' | 'Free' | 'Premium'>('All');
    
    const [state, setState] = useState<AuthState>({
        isLoggedIn: false,
        user: null,
        loading: true,
    });

    const filteredTemplates = templates?.filter((template) => {
        if (activeFilter === 'All') return true
        if (activeFilter === 'Free') return template?.projectPrize === 'Free'
        if (activeFilter === 'Premium') return template?.projectPrize !== 'Free'
        return true
    })  
     
    useEffect(() => {
        if (!templates) return
        const q = searchQuery.toLowerCase().trim()
        setFilteredItems(q ? templates.filter(({ projectName }) => projectName.toLowerCase().includes(q)) : templates)
    }, [searchQuery, templates])



    
    useEffect(() => {
        try {
        // Read from cookie instead of localStorage
        const match = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="));
        const token = match ? match.split("=")[1] : null;

        if (!token) {
            setState({ isLoggedIn: false, user: null, loading: false });
            return;
        }

        // Decode JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Check expiry
        const isExpired = payload.exp && payload.exp * 1000 < Date.now();
        if (isExpired) {
            setState({ isLoggedIn: false, user: null, loading: false });
            return;
        }

        setState({
            isLoggedIn: true,
            user: { name: payload.name, email: payload.email },
            loading: false,
        });
        } catch {
        setState({ isLoggedIn: false, user: null, loading: false });
        }
    }, []);



    useEffect(() => {
        if (!open) return
        setTimeout(() => inputRef.current?.focus(), 80)
        setSearchQuery('')
        if (templates) setFilteredItems(templates)
    }, [open, templates])

    const isFiltering  = searchQuery.length > 0
    const noResults    = isFiltering && filteredItems.length === 0
    const displayItems = filteredItems



    const ref = useRef<HTMLDivElement>(null);
    const onMouseDown = (e: React.MouseEvent) => {
        const slider = ref.current;
        if (!slider) return;

        const startX = e.pageX - slider.offsetLeft;
        const scrollLeft = slider.scrollLeft;

        const onMouseMove = (moveEvent: MouseEvent) => {
        const x = moveEvent.pageX - slider.offsetLeft;
        const walk = x - startX;
        slider.scrollLeft = scrollLeft - walk;
        };

        const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const router = useRouter();
    const pathname = usePathname();
    
    const handleOpen = (e: React.MouseEvent<HTMLElement>, templeteId: string) => {
        if (!state.isLoggedIn) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`); // ← fixed
            return;
        }
        if (state.isLoggedIn) {
            e.stopPropagation();
            router.push(`/templates/template/${templeteId}`);
        };
    };


    return (
        <div className="relative w-full container max-w-[1580px]">
            <div className="container pt-14 w-full h-auto">
                <AnnoncementBadge aboutBadge={"20 + Premium Templates and Designs by lokalhost.io"}/>
                <div className="lg:pt-8 pt-8 w-full lg:w-6xl h-auto mx-auto">
                    <div className="w-full lg:w-5xl mx-auto text-center lg:px-8">
                        <h1 className="font-sans font-bold text-2xl lg:text-5xl text-neutral-800 dark:text-neutral-200">A high quality collection of templates, websites and Blocks for everyone.</h1>
                    </div>
                </div>
                 <div className="flex flex-wrap justify-center items-center pt-3 pb-5 gap-3 lg:gap-6">
                    <button className="border-1 border-orange-400 cursor-pointer px-8 py-[9px] rounded-lg text-sm font-sans font-medium text-neutral-800 bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7] shadow-sm flex items-center justify-center gap-2"><span><LuFigma /></span> Get Full Access</button>
                </div>
            </div>  
            <section className="h-auto pt-4 mx-auto mt-10 mb-10">
                <div className="flex flex-wrap justify-between gap-2 items-center w-full pt-0 pb-4 ">
                    <SortTemplates />
                    <div className="flex lg:flex-nowrap flex-wrap items-center gap-1">
                    <ButtonGroup>
                        <Button 
                            variant={activeFilter === 'All' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('All')}
                            className={activeFilter === 'All' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            All
                        </Button>
                        <Button 
                            variant={activeFilter === 'Free' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Free')}
                            className={activeFilter === 'Free' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Free
                        </Button>
                        <Button 
                            variant={activeFilter === 'Premium' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Premium')}
                            className={activeFilter === 'Premium' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Premium
                        </Button>
                    </ButtonGroup>
                    </div>
                </div>     
                {!templates ? (
  <TemplateShimmerLoadingUI />
) : (
  /* ── Outer container with subtle border + shadow wrap ── */
  <div className="w-full bg-[#F9F9F9] dark:bg-black border rounded-[18px] p-4 lg:p-5">

    {/* ── Masonry grid ── */}
    <div className="[columns:1] lg:[columns:2] md:[columns:2] lg:gap-16 md:gap-8 gap-8">

      {filteredTemplates?.map((templete) => (
        <div
          key={templete.id}
          className="[break-inside:avoid] mb-3 relative group cursor-pointer"
          onClick={(e) => handleOpen(e, templete._id)}
        >
            
          <div
            className="mb-10 overflow-hidden relative p-4 lg:p-15 rounded-xl bg-white border dark:bg-neutral-950 transition-transform duration-200 hover:-translate-y-0.5 shadow-sm hover:mask-b-from-blue-500 hover:[mask-image:linear-gradient(to_bottom,blue_60%,transparent_95%)]"
          >
          <div className="min-w-0 relative lg:bottom-8 bottom-2">
                <Highlighter action="underline" color="#FF9800">
                    <h2 className="font-sans text-sm font-medium leading-tight tracking-normal text-neutral-800 dark:text-neutral-200 lg:text-xl">
                        <span className="bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 bg-clip-text text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-500">
                        {highlightMatch(templete.projectName, searchQuery)}
                        </span>
                    </h2>
                </Highlighter>
            </div>
            {/* ── Image fills fully, no fixed height ── */}
            <div
                className="relative z-20 w-full border rounded-xl overflow-hidden transition-transform duration-500 ease-out
                "
            >
                {templete.projectImages?.[0] && (
                <Image
                    src={templete.projectImages[0]}
                    alt={"Template preview"}
                    width={400}
                    height={800}
                    className="rounded-xl w-full h-auto object-cover block"
                />
                )}
            </div>

            {/* Image 1 */}
            {templete.projectImages?.[1] && (
                <Image
                src={templete.projectImages[1]}
                alt={"Template preview"}
                width={400}
                height={800}
                className="border absolute z-20 top-30 -right-30 lg:top-50 lg:-right-60 rounded-xl w-full h-auto object-cover block transition-transform duration-500 ease-out"
                />
            )}
           {/* ── External link icon top-right on hover ── */}
              <div className="absolute top-2 right-2 w-[26px] h-[26px] bg-black text-white backdrop-blur-sm rounded-[7px] border border-black/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-200">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
            </div>
        </div>
      ))}
    </div>
  </div>
)}
            </section>
            <CTA />
        </div>
    )
}

export default Templates;





function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-neutral-900 dark:text-white font-bold underline decoration-neutral-400 dark:decoration-neutral-500 underline-offset-2">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

