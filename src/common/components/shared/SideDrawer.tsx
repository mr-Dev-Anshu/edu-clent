// src/common/components/shared/SideDrawer.tsx
"use client"

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode   // optional — e.g. a "Create" button at the bottom
  width?: string             // default is 480px
}

export function SideDrawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = '480px',
}: SideDrawerProps) {

  // Close the drawer when user presses Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent page from scrolling when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Full screen overlay
    <div className='fixed inset-0 z-50 flex justify-end'>

      {/* Dark background — click it to close the drawer */}
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Actual drawer panel */}
      <div
        className='relative bg-white h-full flex flex-col shadow-2xl animate-slide-in-right'
        style={{ width }}
      >
        {/* Header bar */}
        <div className='flex items-center justify-between px-6 py-5 border-b'>
          <h2 className='text-lg font-bold text-slate-800'>{title}</h2>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg hover:bg-slate-100 text-slate-500'
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className='flex-1 overflow-y-auto px-6 py-5'>
          {children}
        </div>

        {/* Optional sticky footer (e.g. "Create Class" button) */}
        {footer && (
          <div className='px-6 py-4 border-t bg-white'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}